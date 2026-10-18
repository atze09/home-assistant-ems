"""Discovery of the self describing smart1 "linear items"."""

from __future__ import annotations

from dataclasses import dataclass
import logging
import re
import struct

from .const import (
    DISCOVERY_MAX_ADDRESS,
    DISCOVERY_MAX_EMPTY,
    ITEM_SIZE,
    ITEM_TYPE_METER,
    ITEM_TYPE_REGULATION,
    SUBTYPE_MANUAL_SLIDER,
    SUBTYPE_MANUAL_SWITCH,
)
from .modbus import ModbusExceptionResponse, SmartOneClient

_LOGGER = logging.getLogger(__name__)

# Registers 0..81 of an item contain everything we need for discovery.
_DESCRIPTOR_REGISTERS = 82

KNOWN_UNIT_TYPES = (
    "Temperature",
    "Percent",
    "Energy",
    "NoUnit",
    "Ampere",
    "Voltage",
    "Herz",
    "Pressure",
    "Volume",
    "Flow",
)

# Meters are matched by name prefix, everything else falls back to "energy".
_METER_PREFIXES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("heating_rod", ("heizstab", "wärmestrom")),
    ("heat_pump", ("wp ", "wärmepumpe")),
    ("ecar", ("ecar", "e-car", "wallbox")),
    ("battery", ("batt", "pv von batterie")),
)

# First match wins, so more specific modules come first.
_MODULE_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = tuple(
    (module, re.compile(pattern))
    for module, pattern in (
        ("ecar", r"ecar|e-car|wallbox"),
        ("battery", r"\bbatt|ladezustand|max (ent)?laden"),
        ("hot_water", r"\bww\b|ww[-_ ]|warmwasser|zirk"),
        (
            "heating_circuits",
            r"\bhk\s*\d|hk regler|hk pumpe|heizper|raumtemp|estrich|mischer|au(ss|ß)entemp",
        ),
        (
            "heat_pump",
            r"\bwp\b|wärmepumpe|waermepumpe|wärmeanf|wäremanf|leistungsanf|sockel|durchfluss",
        ),
        ("heating_rod", r"heizstab|quantum|\bqh\b"),
        ("boiler", r"kessel|holz|\böl|bivalenz"),
        ("buffer", r"puffer|nachheiz"),
        ("energy", r"grid|netz|\bpv\b|überschuss|bezug|\bfs\d|eigenverbrauch"),
    )
)

# Internal calculation values of the controller, shown as diagnostic entities.
_DIAGNOSTIC_PATTERN = re.compile(
    r"°k|\bflag\b|visu|faktor|fakor|\bdiff|differenz|hyster|enabled|freigabe|sockel"
)

# Well known values used by the sidebar panel. Matched against the
# normalised (lower case, single spaced) item name, first item wins.
ROLE_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = tuple(
    (role, re.compile(pattern))
    for role, pattern in (
        ("pv_power", r"^pv erzeugung"),
        ("grid_power", r"^grid power"),
        ("grid_import", r"^bezug$"),
        ("grid_export", r"^überschuss$"),
        ("house_power", r"^hausstrom"),
        ("self_consumption", r"^eigenverbrauch"),
        ("total_consumption", r"^gesamtverbrauch"),
        ("battery_soc", r"ladezustand"),
        ("battery_power", r"^batt power"),
        ("battery_charge", r"^batt laden"),
        ("battery_discharge", r"^batt entladen"),
        ("battery_voltage", r"^batt v$"),
        ("battery_current", r"^batt a$"),
        ("heating_rod_power", r"^heizstab leistung"),
        ("heating_rod_percent", r"^heizstab 0-100"),
        ("heat_pump_power", r"^wp bezug"),
        ("heat_pump_percent", r"^wp 0-100"),
        ("heat_pump_switch", r"^wp 0/1"),
        ("ecar_power", r"^ecar laden"),
        ("grid_frequency", r"^netzfrequenz"),
        ("outdoor_temp", r"^au(ss|ß)entemperatur$"),
        ("hot_water_temp", r"^ww[_ ]?temperatur"),
        ("hot_water_target", r"^ww-solltemp"),
        ("hot_water_valve", r"^ww-umschaltvent"),
        ("tank_top", r"^puffer oben$"),
        ("tank_middle", r"^puffer mitte"),
        ("tank_bottom", r"^puffer unten$"),
        ("heating_rod_temp", r"^temperatur heizstab"),
        ("hk1_flow", r"^vorlauf hk ?1$"),
        ("hk1_target", r"^vorlauf soll hk ?1$"),
        ("hk1_pump", r"^pumpe hk ?1$"),
        ("hk1_mixer_open", r"^mischer hk ?1 auf$"),
        ("hk1_mixer_close", r"^mischer hk ?1 zu$"),
        ("hk2_flow", r"^vorlauf hk ?2$"),
        ("hk2_target", r"^vorlauf soll hk ?2$"),
        ("hk2_pump", r"^pumpe hk ?2$"),
        ("hk2_mixer_open", r"^mischer hk ?2 auf$"),
        ("hk2_mixer_close", r"^mischer hk ?2 zu$"),
    )
)


@dataclass(frozen=True, slots=True)
class SystemInfo:
    """General information of the controller."""

    serial: str
    version: str
    hardware: str


@dataclass(frozen=True, slots=True)
class Item:
    """One linear item (meter, sensor or regulation)."""

    address: int
    name: str
    key: str
    unit: str
    unit_type: str
    item_type: int
    sub_type: int
    module: str
    diagnostic: bool

    @property
    def is_meter(self) -> bool:
        return self.item_type == ITEM_TYPE_METER

    @property
    def is_switch(self) -> bool:
        return (
            self.item_type == ITEM_TYPE_REGULATION
            and self.sub_type == SUBTYPE_MANUAL_SWITCH
        )

    @property
    def is_slider(self) -> bool:
        return (
            self.item_type == ITEM_TYPE_REGULATION
            and self.sub_type == SUBTYPE_MANUAL_SLIDER
        )

    @property
    def writable(self) -> bool:
        return self.is_switch or self.is_slider

    @property
    def uid(self) -> str:
        """Stable id of the item, independent of its register address."""
        return self.key or f"addr{self.address}"


def _latin1(raw: bytes) -> str:
    return raw.split(b"\x00", 1)[0].decode("latin-1").strip()


def normalize_name(name: str) -> str:
    return " ".join(name.lower().split())


def _categorize(name: str, item_type: int) -> str:
    lowered = normalize_name(name)
    if item_type == ITEM_TYPE_METER:
        for module, prefixes in _METER_PREFIXES:
            if lowered.startswith(prefixes):
                return module
        return "energy"
    for module, pattern in _MODULE_PATTERNS:
        if pattern.search(lowered):
            return module
    return "system"


def parse_item(address: int, raw: bytes) -> Item | None:
    """Parse the descriptor registers of an item, None for an empty slot."""
    name = _latin1(raw[40:80])
    unit_type = _latin1(raw[80:100])
    item_type, sub_type = struct.unpack(">HH", raw[160:164])
    if not name and item_type == 0:
        return None

    # Names longer than 40 characters spill over into the unit type field.
    if unit_type not in KNOWN_UNIT_TYPES:
        for known in KNOWN_UNIT_TYPES:
            if unit_type.endswith(known):
                name += unit_type[: -len(known)]
                unit_type = known
                break

    name = " ".join(name.split())
    return Item(
        address=address,
        name=name,
        key=_latin1(raw[100:140]),
        unit=_latin1(raw[140:150]),
        unit_type=unit_type,
        item_type=item_type,
        sub_type=sub_type,
        module=_categorize(name, item_type),
        diagnostic=bool(_DIAGNOSTIC_PATTERN.search(normalize_name(name))),
    )


async def async_read_system_info(client: SmartOneClient) -> SystemInfo:
    """Read version, serial number and hardware revision."""
    major, minor, revision = struct.unpack(
        ">HHH", await client.read_input_registers(0, 3)
    )
    serial = _latin1(await client.read_input_registers(10, 10))
    hardware = _latin1(await client.read_input_registers(20, 20))
    return SystemInfo(
        serial=serial or f"{client.host}:{client.unit_id}",
        version=f"{major}.{minor}.{revision}",
        hardware=hardware,
    )


async def async_discover(client: SmartOneClient, start: int) -> list[Item]:
    """Scan the register map for configured items."""
    items: list[Item] = []
    empty = 0
    address = start
    while address <= DISCOVERY_MAX_ADDRESS and empty < DISCOVERY_MAX_EMPTY:
        try:
            raw = await client.read_input_registers(address, _DESCRIPTOR_REGISTERS)
        except ModbusExceptionResponse:
            item = None
        else:
            item = parse_item(address, raw)
        if item is None:
            empty += 1
        else:
            empty = 0
            items.append(item)
        address += ITEM_SIZE
    _LOGGER.debug("Discovered %s items starting at %s", len(items), start)
    return items


def assign_roles(items: list[Item]) -> dict[str, Item]:
    """Map well known roles (used by the panel) to items."""
    roles: dict[str, Item] = {}
    for item in items:
        lowered = normalize_name(item.name)
        for role, pattern in ROLE_PATTERNS:
            if role not in roles and pattern.search(lowered):
                roles[role] = item
                break
    return roles

"""Websocket API used by the sidebar panel: configuration and settings."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_HOST, CONF_PORT
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv, entity_registry as er

from .const import (
    CONF_BATTERY_SOC,
    CONF_CARS,
    CONF_DATASHEET,
    CONF_HOT_WATER_DURATION,
    CONF_HOT_WATER_ITEM,
    CONF_HP_RUNNING_W,
    CONF_INVERT,
    CONF_LOADS,
    CONF_MODULES,
    CONF_PV_SYSTEMS,
    CONF_RENNERGY,
    CONF_ROD_BOOST_DURATION,
    CONF_ROD_BOOST_ITEM,
    CONF_ROD_BOOST_PERCENT,
    CONF_SCAN_INTERVAL,
    CONF_START_ADDRESS,
    CONF_TANK_SENSORS,
    CONF_UNIT_ID,
    CONF_WATER_FLOW,
    DEFAULT_PORT,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_START_ADDRESS,
    DEFAULT_UNIT_ID,
    DEVICE_ID_PREFIX,
    DEVICE_LISTS,
    DOMAIN,
    ENTITY_OPTIONS,
    INVERTIBLE,
    MODULES,
    SCHEMA_SECTIONS,
)
from .coordinator import EmsConfigEntry
from .datasheet import parse_datasheet
from .entity import ROLE_VALUE, entity_specs, module_name, unique_id
from .modbus import ModbusError
from .rennergy import async_probe
from .stats import device_list

MAX_DEVICES = 20

_RENNERGY_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_HOST): vol.All(str, vol.Length(min=1, max=255)),
        vol.Optional(CONF_PORT, default=DEFAULT_PORT): vol.All(vol.Coerce(int), vol.Range(1, 65535)),
        vol.Optional(CONF_UNIT_ID, default=DEFAULT_UNIT_ID): vol.All(vol.Coerce(int), vol.Range(0, 255)),
        vol.Optional(CONF_START_ADDRESS, default=DEFAULT_START_ADDRESS): vol.All(
            vol.Coerce(int), vol.Range(0, 65000)
        ),
        vol.Optional(CONF_MODULES, default=list(MODULES)): [vol.In(MODULES)],
        vol.Optional(CONF_SCAN_INTERVAL, default=DEFAULT_SCAN_INTERVAL): vol.All(
            vol.Coerce(int), vol.Range(5, 300)
        ),
    }
)


def _device_schema(key: str) -> vol.Schema:
    fields: dict[Any, Any] = {
        vol.Required("id"): vol.Match(rf"^{DEVICE_ID_PREFIX[key]}[a-z0-9]{{1,16}}$"),
        vol.Optional("name", default=""): vol.All(str, vol.Length(max=60)),
    }
    for field in DEVICE_LISTS[key]:
        fields[vol.Optional(field)] = (
            vol.Match(r"^mdi:[a-z0-9-]+$") if field == "icon" else vol.Any(None, cv.entity_id)
        )
    return vol.Schema(fields)


# Everything the settings tab of the panel may store.
OPTIONS_SCHEMA = vol.Schema(
    {
        **{vol.Optional(key): vol.Any(None, cv.entity_id) for key in ENTITY_OPTIONS},
        vol.Optional(CONF_TANK_SENSORS): [cv.entity_id],
        **{
            vol.Optional(key): vol.All([_device_schema(key)], vol.Length(max=MAX_DEVICES))
            for key in DEVICE_LISTS
        },
        vol.Optional(CONF_INVERT): [vol.In(INVERTIBLE)],
        vol.Optional(CONF_DATASHEET): vol.Any(None, str),
        vol.Optional(CONF_HP_RUNNING_W): vol.All(vol.Coerce(int), vol.Range(10, 5000)),
        vol.Optional(CONF_HOT_WATER_ITEM): vol.Any(None, str),
        vol.Optional(CONF_HOT_WATER_DURATION): vol.All(vol.Coerce(int), vol.Range(5, 600)),
        vol.Optional(CONF_ROD_BOOST_ITEM): vol.Any(None, str),
        vol.Optional(CONF_ROD_BOOST_DURATION): vol.All(vol.Coerce(int), vol.Range(5, 600)),
        vol.Optional(CONF_ROD_BOOST_PERCENT): vol.All(vol.Coerce(int), vol.Range(1, 100)),
        vol.Optional(CONF_RENNERGY): vol.Any(None, _RENNERGY_SCHEMA),
    }
)


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_get_settings)
    websocket_api.async_register_command(hass, ws_save_settings)
    websocket_api.async_register_command(hass, ws_probe_rennergy)


def _loaded_entry(hass: HomeAssistant, entry_id: str) -> EmsConfigEntry | None:
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.state is not ConfigEntryState.LOADED:
        return None
    return entry


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/config"})
@callback
def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all systems with their sources, items and entity ids."""
    registry = er.async_get(hass)
    language = hass.config.language
    systems = []
    entry: EmsConfigEntry
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.state is not ConfigEntryState.LOADED:
            continue
        data = entry.runtime_data
        hub = data.rennergy
        options = entry.options

        items = []
        roles: dict[str, str] = {}
        buttons: dict[str, str] = {}
        modules: list[dict[str, str]] = []
        if hub is not None:
            serial = hub.system.serial
            by_address: dict[int, dict[str, str]] = {}
            for item in hub.items:
                ids = {}
                for platform, role in entity_specs(item):
                    entity_id = registry.async_get_entity_id(
                        platform, DOMAIN, unique_id(serial, item, role)
                    )
                    if entity_id:
                        ids[role] = entity_id
                by_address[item.address] = ids
                items.append(
                    {
                        "address": item.address,
                        "name": item.name,
                        "module": item.module,
                        "unit": item.unit,
                        "meter": item.is_meter,
                        "switch": item.is_switch,
                        "slider": item.is_slider,
                        "diagnostic": item.diagnostic,
                        "entities": ids,
                    }
                )
            roles = {
                role: by_address[item.address][ROLE_VALUE]
                for role, item in hub.roles.items()
                if ROLE_VALUE in by_address.get(item.address, {})
            }
            present = {item.module for item in hub.items}
            modules = [
                {"id": m, "name": module_name(language, m)} for m in MODULES if m in present
            ]
            for reg_entry in er.async_entries_for_config_entry(registry, entry.entry_id):
                if reg_entry.domain == "button" and reg_entry.unique_id.startswith(f"{serial}_"):
                    buttons[reg_entry.unique_id[len(serial) + 1 :]] = reg_entry.entity_id

        stat_prefix = f"{entry.entry_id}_stat_"
        stats = {
            reg_entry.unique_id[len(stat_prefix) :]: reg_entry.entity_id
            for reg_entry in er.async_entries_for_config_entry(registry, entry.entry_id)
            if reg_entry.unique_id.startswith(stat_prefix)
        }

        systems.append(
            {
                "entry_id": entry.entry_id,
                "title": entry.title,
                "rennergy": {
                    "serial": hub.system.serial,
                    "version": hub.system.version,
                    "host": options[CONF_RENNERGY][CONF_HOST],
                    "hot_water_item": hub.hot_water_item.name if hub.hot_water_item else None,
                    "rod_boost_item": hub.rod_boost_item.name if hub.rod_boost_item else None,
                }
                if hub
                else None,
                "rennergy_error": data.rennergy_error,
                "modules": modules,
                "items": items,
                "roles": roles,
                "stats": stats,
                "buttons": buttons,
                "power_sensors": {
                    key: ids
                    for key, ids in data.stats.power_sensors.items()
                    if key not in data.stats.inverted
                },
                "inverted_power": {
                    key: ids
                    for key, ids in data.stats.power_sensors.items()
                    if key in data.stats.inverted
                },
                # Counters per statistics source, for the charts of the panel.
                "energy_meters": {
                    source: ids
                    for source in data.stats.energy_sources
                    if (ids := data.stats.entity_ids(source))
                },
                "battery_soc": options.get(CONF_BATTERY_SOC),
                "water_flow": options.get(CONF_WATER_FLOW),
                "pv_systems": device_list(options, CONF_PV_SYSTEMS),
                "cars": device_list(options, CONF_CARS),
                "loads": device_list(options, CONF_LOADS),
                "schema": {
                    field: options[field]
                    for section in SCHEMA_SECTIONS.values()
                    for field in section
                    if options.get(field)
                },
            }
        )
    connection.send_result(msg["id"], {"systems": systems})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/settings/get", vol.Required("entry_id"): str}
)
@callback
def ws_get_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Options of an entry plus the writable Rennergy items for the actions."""
    entry = _loaded_entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "EMS entry not found")
        return
    hub = entry.runtime_data.rennergy
    connection.send_result(
        msg["id"],
        {
            "options": dict(entry.options),
            "writable_items": [
                {"uid": item.uid, "name": item.name, "address": item.address}
                for item in (hub.all_items if hub else [])
                if item.writable
            ],
            "modules": list(MODULES),
            "module_names": {m: module_name(hass.config.language, m) for m in MODULES},
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/settings/save",
        vol.Required("entry_id"): str,
        vol.Required("options"): dict,
    }
)
@callback
def ws_save_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Validate and store the options; the entry reloads itself afterwards."""
    entry = _loaded_entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "EMS entry not found")
        return
    try:
        options = OPTIONS_SCHEMA(msg["options"])
        if options.get(CONF_DATASHEET):
            parse_datasheet(options[CONF_DATASHEET])
    except (vol.Invalid, ValueError) as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    # Empty values are not stored, so a field can be cleared again.
    options = {k: v for k, v in options.items() if v not in (None, "", [])}
    for key in DEVICE_LISTS:
        ids = [d["id"] for d in options.get(key, [])]
        if len(ids) != len(set(ids)):
            connection.send_error(msg["id"], "invalid", f"duplicate id in {key}")
            return
    hass.config_entries.async_update_entry(entry, options=options)
    connection.send_result(msg["id"], {"saved": True})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/rennergy/probe",
        vol.Required(CONF_HOST): str,
        vol.Optional(CONF_PORT, default=DEFAULT_PORT): vol.Coerce(int),
        vol.Optional(CONF_UNIT_ID, default=DEFAULT_UNIT_ID): vol.Coerce(int),
        vol.Optional(CONF_START_ADDRESS, default=DEFAULT_START_ADDRESS): vol.Coerce(int),
    }
)
@websocket_api.async_response
async def ws_probe_rennergy(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Test the connection to a Rennergy controller and list its areas."""
    try:
        system, items = await async_probe(msg)
    except ModbusError as err:
        connection.send_error(msg["id"], "cannot_connect", str(err))
        return
    present = {item.module for item in items}
    connection.send_result(
        msg["id"],
        {
            "serial": system.serial,
            "version": system.version,
            "count": len(items),
            "modules": [m for m in MODULES if m in present],
        },
    )

"""Constants for the Rennergy EMS integration."""

from __future__ import annotations

DOMAIN = "rennergy"
VERSION = "0.2.0"

CONF_UNIT_ID = "unit_id"
CONF_START_ADDRESS = "start_address"
CONF_MODULES = "modules"
CONF_SCAN_INTERVAL = "scan_interval"

# External Home Assistant sensors (options, "Zähler").
CONF_HP_HEAT_ENERGY = "heat_pump_heat_energy"
CONF_HP_HEAT_POWER = "heat_pump_heat_power"
CONF_HP_ELECTRIC_ENERGY = "heat_pump_electric_energy"
CONF_HP_ELECTRIC_POWER = "heat_pump_electric_power"
CONF_HC1_HEAT_ENERGY = "heating_circuit_1_heat_energy"
CONF_HC2_HEAT_ENERGY = "heating_circuit_2_heat_energy"
CONF_STOVE_HEAT_ENERGY = "stove_heat_energy"
CONF_STOVE_HEAT_POWER = "stove_heat_power"
CONF_PV_ENERGY = "pv_energy"
CONF_PV_POWER = "pv_power"

ENERGY_METER_OPTIONS = (
    CONF_PV_ENERGY,
    CONF_HP_HEAT_ENERGY,
    CONF_HP_ELECTRIC_ENERGY,
    CONF_HC1_HEAT_ENERGY,
    CONF_HC2_HEAT_ENERGY,
    CONF_STOVE_HEAT_ENERGY,
)
POWER_METER_OPTIONS = (
    CONF_PV_POWER,
    CONF_HP_HEAT_POWER,
    CONF_HP_ELECTRIC_POWER,
    CONF_STOVE_HEAT_POWER,
)

# Hot water quick load (options, "Aktionen").
CONF_HOT_WATER_ITEM = "hot_water_item"
CONF_HOT_WATER_DURATION = "hot_water_duration"
DEFAULT_HOT_WATER_DURATION = 60

PERIODS: tuple[str, ...] = ("day", "week", "month", "year")

DEFAULT_PORT = 502
DEFAULT_UNIT_ID = 1
DEFAULT_START_ADDRESS = 20000
DEFAULT_SCAN_INTERVAL = 15

# smart1 "linear items": every item occupies a block of 100 registers.
ITEM_SIZE = 100
# Discovery stops after this many empty blocks in a row.
DISCOVERY_MAX_EMPTY = 10
DISCOVERY_MAX_ADDRESS = 65400

# Register offsets inside an item block.
REG_VALUE = 0
REG_SET_VALUE = 90
REG_SET_MODE = 92

ITEM_TYPE_METER = 1
ITEM_TYPE_SENSOR = 2
ITEM_TYPE_REGULATION = 3

SUBTYPE_GENERIC = 0
SUBTYPE_MANUAL_SWITCH = 1
SUBTYPE_MANUAL_SLIDER = 2

MODE_AUTO = "auto"
MODE_MANUAL = "manual"

# Modules ("Bereiche") in display order.
MODULES: tuple[str, ...] = (
    "energy",
    "battery",
    "heat_pump",
    "heating_rod",
    "buffer",
    "hot_water",
    "heating_circuits",
    "boiler",
    "ecar",
    "system",
)

MODULE_NAMES: dict[str, dict[str, str]] = {
    "de": {
        "energy": "Energie",
        "battery": "Batterie",
        "heat_pump": "Wärmepumpe",
        "heating_rod": "Heizstab",
        "buffer": "Pufferspeicher",
        "hot_water": "Warmwasser",
        "heating_circuits": "Heizkreise",
        "boiler": "Kessel",
        "ecar": "E-Auto",
        "system": "System",
        "statistics": "Statistik",
    },
    "en": {
        "energy": "Energy",
        "battery": "Battery",
        "heat_pump": "Heat pump",
        "heating_rod": "Heating rod",
        "buffer": "Buffer tank",
        "hot_water": "Hot water",
        "heating_circuits": "Heating circuits",
        "boiler": "Boiler",
        "ecar": "Electric car",
        "system": "System",
        "statistics": "Statistics",
    },
}

PANEL_URL_PATH = "rennergy"
PANEL_STATIC_URL = "/rennergy_static"
PANEL_COMPONENT = "rennergy-panel"

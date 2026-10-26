"""Constants for the Rennergy EMS integration."""

from __future__ import annotations

DOMAIN = "ems"
VERSION = "0.4.0"

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
# Optional external meters that replace the Rennergy values.
CONF_GRID_IMPORT_ENERGY = "grid_import_energy"
CONF_GRID_EXPORT_ENERGY = "grid_export_energy"
CONF_GRID_POWER = "grid_power"
CONF_BATTERY_CHARGE_ENERGY = "battery_charge_energy"
CONF_BATTERY_DISCHARGE_ENERGY = "battery_discharge_energy"
CONF_BATTERY_POWER = "battery_power"
CONF_BATTERY_SOC = "battery_soc"
CONF_CONSUMPTION_ENERGY = "consumption_energy"
CONF_HOUSE_POWER = "house_power"
CONF_ROD_ENERGY = "heating_rod_energy"
CONF_ROD_POWER = "heating_rod_power"
# Water meter (total counter) and current flow.
CONF_WATER_VOLUME = "water_volume"
CONF_WATER_FLOW = "water_flow"

ENERGY_METER_OPTIONS = (
    CONF_PV_ENERGY,
    CONF_GRID_IMPORT_ENERGY,
    CONF_GRID_EXPORT_ENERGY,
    CONF_BATTERY_CHARGE_ENERGY,
    CONF_BATTERY_DISCHARGE_ENERGY,
    CONF_CONSUMPTION_ENERGY,
    CONF_ROD_ENERGY,
    CONF_HP_HEAT_ENERGY,
    CONF_HP_ELECTRIC_ENERGY,
    CONF_HC1_HEAT_ENERGY,
    CONF_HC2_HEAT_ENERGY,
    CONF_STOVE_HEAT_ENERGY,
)
POWER_METER_OPTIONS = (
    CONF_PV_POWER,
    CONF_GRID_POWER,
    CONF_BATTERY_POWER,
    CONF_HOUSE_POWER,
    CONF_ROD_POWER,
    CONF_HP_HEAT_POWER,
    CONF_HP_ELECTRIC_POWER,
    CONF_STOVE_HEAT_POWER,
)
# PV may consist of several systems (e.g. roof, fence, garden house).
MULTI_ENTITY_OPTIONS = (CONF_PV_ENERGY, CONF_PV_POWER)

# Meters page of the options, grouped into sections.
METER_SECTIONS: dict[str, tuple[str, ...]] = {
    "pv": (CONF_PV_ENERGY, CONF_PV_POWER),
    "grid": (CONF_GRID_IMPORT_ENERGY, CONF_GRID_EXPORT_ENERGY, CONF_GRID_POWER),
    "battery": (
        CONF_BATTERY_CHARGE_ENERGY,
        CONF_BATTERY_DISCHARGE_ENERGY,
        CONF_BATTERY_POWER,
        CONF_BATTERY_SOC,
    ),
    "house": (CONF_CONSUMPTION_ENERGY, CONF_HOUSE_POWER),
    "heating_rod": (CONF_ROD_ENERGY, CONF_ROD_POWER),
    "heat_pump": (
        CONF_HP_HEAT_ENERGY,
        CONF_HP_HEAT_POWER,
        CONF_HP_ELECTRIC_ENERGY,
        CONF_HP_ELECTRIC_POWER,
    ),
    "heat": (
        CONF_HC1_HEAT_ENERGY,
        CONF_HC2_HEAT_ENERGY,
        CONF_STOVE_HEAT_ENERGY,
        CONF_STOVE_HEAT_POWER,
    ),
    "water": (CONF_WATER_VOLUME, CONF_WATER_FLOW),
}

# Electric cars (options, "E-Autos"): section -> fields "<car>_<field>".
CARS: tuple[str, ...] = ("car1", "car2", "car3")
CAR_FIELDS: tuple[str, ...] = ("name", "soc", "power", "energy", "range")
# Further electric consumers (options, "Verbraucher"), e.g. pool or whirlpool.
LOADS: tuple[str, ...] = ("load1", "load2", "load3", "load4", "load5", "load6")
LOAD_FIELDS: tuple[str, ...] = ("name", "power", "energy", "temp", "icon")

# Plant schema (options, "Anlagenschema"): section -> fields.
SCHEMA_SECTIONS: dict[str, tuple[str, ...]] = {
    "hc1": ("hc1_flow_temp", "hc1_return_temp", "hc1_heat_power"),
    "hc2": ("hc2_flow_temp", "hc2_return_temp", "hc2_heat_power"),
    "stove": ("stove_temp", "stove_flow_temp", "stove_return_temp", "stove_status"),
    "heat_pump": ("hp_flow_temp", "hp_return_temp", "hp_status"),
    "tank": ("tank_sensors", "rod_temp"),
}
CONF_TANK_SENSORS = "tank_sensors"
CONF_HP_FLOW_TEMP = "hp_flow_temp"
CONF_OUTDOOR_TEMP = "outdoor_temp"

# Heat pump datasheet (options, "Wärmepumpe").
CONF_DATASHEET = "datasheet"
CONF_HP_RUNNING_W = "hp_running_w"
DEFAULT_HP_RUNNING_W = 300

# Hot water quick load (options, "Aktionen").
CONF_HOT_WATER_ITEM = "hot_water_item"
CONF_HOT_WATER_DURATION = "hot_water_duration"
DEFAULT_HOT_WATER_DURATION = 60

# Heating rod boost (options, "Aktionen").
CONF_ROD_BOOST_ITEM = "rod_boost_item"
CONF_ROD_BOOST_DURATION = "rod_boost_duration"
CONF_ROD_BOOST_PERCENT = "rod_boost_percent"
DEFAULT_ROD_BOOST_DURATION = 60
DEFAULT_ROD_BOOST_PERCENT = 100

# Services.
SERVICE_SET_MANUAL = "set_manual"
SERVICE_SET_AUTO = "set_auto"
ATTR_VALUE = "value"
ATTR_DURATION = "duration"

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

PANEL_URL_PATH = "ems"
PANEL_STATIC_URL = "/ems_static"
PANEL_COMPONENT = "ems-panel"

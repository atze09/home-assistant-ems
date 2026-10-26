"""Config flow for the Rennergy EMS."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant import data_entry_flow
from homeassistant.const import CONF_HOST, CONF_PORT
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    IconSelector,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
)

from .const import (
    CAR_FIELDS,
    CARS,
    CONF_DATASHEET,
    CONF_HOT_WATER_DURATION,
    CONF_HOT_WATER_ITEM,
    CONF_HP_RUNNING_W,
    CONF_MODULES,
    CONF_OUTDOOR_TEMP,
    CONF_ROD_BOOST_DURATION,
    CONF_ROD_BOOST_ITEM,
    CONF_ROD_BOOST_PERCENT,
    CONF_TANK_SENSORS,
    CONF_WATER_VOLUME,
    DEFAULT_HP_RUNNING_W,
    DEFAULT_ROD_BOOST_DURATION,
    DEFAULT_ROD_BOOST_PERCENT,
    MULTI_ENTITY_OPTIONS,
    SCHEMA_SECTIONS,
    CONF_SCAN_INTERVAL,
    CONF_START_ADDRESS,
    CONF_UNIT_ID,
    DEFAULT_HOT_WATER_DURATION,
    DEFAULT_PORT,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_START_ADDRESS,
    DEFAULT_UNIT_ID,
    DOMAIN,
    ENERGY_METER_OPTIONS,
    LOAD_FIELDS,
    LOADS,
    METER_SECTIONS,
    MODULES,
)
from .datasheet import parse_datasheet
from .discovery import Item, SystemInfo, async_discover, async_read_system_info
from .modbus import ModbusError, SmartOneClient

_LOGGER = logging.getLogger(__name__)


def _modules_of(items: list[Item]) -> list[str]:
    present = {item.module for item in items}
    return [module for module in MODULES if module in present]


def _modules_selector(modules: list[str]) -> SelectSelector:
    return SelectSelector(
        SelectSelectorConfig(
            options=modules,
            multiple=True,
            mode=SelectSelectorMode.LIST,
            translation_key=CONF_MODULES,
        )
    )


def _interval_selector() -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(
            min=5, max=300, step=1, unit_of_measurement="s", mode=NumberSelectorMode.BOX
        )
    )


class RennergyConfigFlow(ConfigFlow, domain=DOMAIN):
    """Set up a Rennergy EMS by IP address."""

    VERSION = 1

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._items: list[Item] = []
        self._system: SystemInfo | None = None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            client = SmartOneClient(
                user_input[CONF_HOST],
                int(user_input[CONF_PORT]),
                int(user_input[CONF_UNIT_ID]),
            )
            try:
                system = await async_read_system_info(client)
                items = await async_discover(
                    client, int(user_input[CONF_START_ADDRESS])
                )
            except ModbusError:
                errors["base"] = "cannot_connect"
            except Exception:
                _LOGGER.exception("Unexpected error during setup")
                errors["base"] = "unknown"
            else:
                if not items:
                    errors["base"] = "no_items"
                else:
                    await self.async_set_unique_id(system.serial)
                    self._abort_if_unique_id_configured(
                        updates={CONF_HOST: user_input[CONF_HOST]}
                    )
                    self._data = {
                        CONF_HOST: user_input[CONF_HOST],
                        CONF_PORT: int(user_input[CONF_PORT]),
                        CONF_UNIT_ID: int(user_input[CONF_UNIT_ID]),
                        CONF_START_ADDRESS: int(user_input[CONF_START_ADDRESS]),
                    }
                    self._items = items
                    self._system = system
                    return await self.async_step_modules()
            finally:
                await client.close()

        defaults = user_input or {}
        schema = vol.Schema(
            {
                vol.Required(CONF_HOST, default=defaults.get(CONF_HOST, "")): str,
                vol.Required(
                    CONF_PORT, default=defaults.get(CONF_PORT, DEFAULT_PORT)
                ): vol.All(vol.Coerce(int), vol.Range(min=1, max=65535)),
                vol.Required(
                    CONF_UNIT_ID, default=defaults.get(CONF_UNIT_ID, DEFAULT_UNIT_ID)
                ): vol.All(vol.Coerce(int), vol.Range(min=0, max=255)),
                vol.Required(
                    CONF_START_ADDRESS,
                    default=defaults.get(CONF_START_ADDRESS, DEFAULT_START_ADDRESS),
                ): vol.All(vol.Coerce(int), vol.Range(min=0, max=65000)),
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    async def async_step_modules(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        available = _modules_of(self._items)
        if user_input is not None:
            return self.async_create_entry(
                title=f"EMS ({self._data[CONF_HOST]})",
                data=self._data,
                options={
                    CONF_MODULES: user_input[CONF_MODULES],
                    CONF_SCAN_INTERVAL: int(user_input[CONF_SCAN_INTERVAL]),
                },
            )

        assert self._system is not None
        schema = vol.Schema(
            {
                vol.Required(CONF_MODULES, default=available): _modules_selector(
                    available
                ),
                vol.Required(
                    CONF_SCAN_INTERVAL, default=DEFAULT_SCAN_INTERVAL
                ): _interval_selector(),
            }
        )
        return self.async_show_form(
            step_id="modules",
            data_schema=schema,
            description_placeholders={
                "serial": self._system.serial,
                "version": self._system.version,
                "count": str(len(self._items)),
            },
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return RennergyOptionsFlow()


def _sensor_selector(device_class: str | None = None, multiple: bool = False) -> EntitySelector:
    config = EntitySelectorConfig(domain="sensor", multiple=multiple)
    if device_class:
        config = EntitySelectorConfig(
            domain="sensor", device_class=device_class, multiple=multiple
        )
    return EntitySelector(config)


def _status_selector() -> EntitySelector:
    return EntitySelector(
        EntitySelectorConfig(
            domain=["binary_sensor", "sensor", "switch", "input_boolean"]
        )
    )


def _as_list(value: Any) -> list[str]:
    if not value:
        return []
    return [value] if isinstance(value, str) else list(value)


class RennergyOptionsFlow(OptionsFlow):
    """Options, split into areas, meters, plant schema, heat pump and actions."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        return self.async_show_menu(
            step_id="init",
            menu_options=[
                "modules",
                "meters",
                "cars",
                "loads",
                "schema",
                "heat_pump",
                "actions",
            ],
        )

    def _save(self, changes: dict[str, Any], cleared: tuple[str, ...] = ()) -> ConfigFlowResult:
        options = {
            k: v for k, v in self.config_entry.options.items() if k not in cleared
        }
        options.update(changes)
        return self.async_create_entry(data=options)

    @property
    def _runtime(self):
        return getattr(self.config_entry, "runtime_data", None)

    def _suggested(self, key: str) -> dict[str, Any]:
        return {"suggested_value": self.config_entry.options.get(key)}

    async def async_step_modules(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self._save(
                {
                    CONF_MODULES: user_input[CONF_MODULES],
                    CONF_SCAN_INTERVAL: int(user_input[CONF_SCAN_INTERVAL]),
                }
            )

        runtime = self._runtime
        available = (
            _modules_of(runtime.all_items) if runtime is not None else list(MODULES)
        )
        options = self.config_entry.options
        schema = vol.Schema(
            {
                vol.Required(
                    CONF_MODULES,
                    default=[m for m in options.get(CONF_MODULES, available) if m in available],
                ): _modules_selector(available),
                vol.Required(
                    CONF_SCAN_INTERVAL,
                    default=options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL),
                ): _interval_selector(),
            }
        )
        return self.async_show_form(step_id="modules", data_schema=schema)

    async def async_step_meters(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        keys = tuple(k for fields in METER_SECTIONS.values() for k in fields)
        if user_input is not None:
            flat: dict[str, Any] = {}
            for section in METER_SECTIONS:
                flat.update(user_input.get(section) or {})
            # Fields left empty are removed, so a meter can be unassigned again.
            return self._save(
                {k: v for k, v in flat.items() if k in keys and v},
                cleared=keys,
            )

        options = self.config_entry.options
        schema: dict[Any, Any] = {}
        for section, fields in METER_SECTIONS.items():
            inner: dict[Any, Any] = {}
            for key in fields:
                multiple = key in MULTI_ENTITY_OPTIONS
                value = options.get(key)
                # Many heat meters report power without a device class.
                device_class = (
                    "energy"
                    if key in ENERGY_METER_OPTIONS
                    else "water"
                    if key == CONF_WATER_VOLUME
                    else None
                )
                inner[
                    vol.Optional(
                        key,
                        description={
                            "suggested_value": _as_list(value) if multiple else value
                        },
                    )
                ] = _sensor_selector(device_class, multiple)
            schema[vol.Optional(section)] = data_entry_flow.section(
                vol.Schema(inner), {"collapsed": section not in ("pv", "heat_pump")}
            )
        return self.async_show_form(step_id="meters", data_schema=vol.Schema(schema))

    async def async_step_cars(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        return self._devices_step("cars", CARS, CAR_FIELDS, user_input)

    async def async_step_loads(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        return self._devices_step("loads", LOADS, LOAD_FIELDS, user_input)

    def _devices_step(
        self,
        step_id: str,
        devices: tuple[str, ...],
        fields: tuple[str, ...],
        user_input: dict[str, Any] | None,
    ) -> ConfigFlowResult:
        """One collapsible section per device, stored flat as "<device>_<field>"."""
        keys = tuple(f"{device}_{field}" for device in devices for field in fields)
        if user_input is not None:
            flat: dict[str, Any] = {}
            for device in devices:
                flat.update(user_input.get(device) or {})
            return self._save(
                {k: v for k, v in flat.items() if k in keys and v}, cleared=keys
            )

        options = self.config_entry.options
        schema: dict[Any, Any] = {}
        for index, device in enumerate(devices):
            inner: dict[Any, Any] = {}
            for field in fields:
                key = f"{device}_{field}"
                if field == "name":
                    selector: Any = TextSelector()
                elif field == "icon":
                    selector = IconSelector()
                else:
                    selector = _sensor_selector("energy" if field == "energy" else None)
                inner[vol.Optional(key, description=self._suggested(key))] = selector
            used = any(options.get(f"{device}_{f}") for f in fields)
            schema[vol.Optional(device)] = data_entry_flow.section(
                vol.Schema(inner), {"collapsed": index > 0 and not used}
            )
        return self.async_show_form(step_id=step_id, data_schema=vol.Schema(schema))

    async def async_step_schema(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        fields = [f for section in SCHEMA_SECTIONS.values() for f in section]
        if user_input is not None:
            flat: dict[str, Any] = {}
            for section in SCHEMA_SECTIONS:
                flat.update(user_input.get(section) or {})
            return self._save(
                {k: v for k, v in flat.items() if k in fields and v},
                cleared=tuple(fields),
            )

        schema: dict[Any, Any] = {}
        for section, section_fields in SCHEMA_SECTIONS.items():
            inner: dict[Any, Any] = {}
            for field in section_fields:
                if field == CONF_TANK_SENSORS:
                    selector = _sensor_selector(None, multiple=True)
                elif field.endswith("_status"):
                    selector = _status_selector()
                else:
                    selector = _sensor_selector()
                inner[vol.Optional(field, description=self._suggested(field))] = selector
            schema[vol.Optional(section)] = data_entry_flow.section(
                vol.Schema(inner), {"collapsed": False}
            )
        return self.async_show_form(step_id="schema", data_schema=vol.Schema(schema))

    async def async_step_heat_pump(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            text = (user_input.get(CONF_DATASHEET) or "").strip()
            try:
                parse_datasheet(text)
            except ValueError:
                errors[CONF_DATASHEET] = "invalid_datasheet"
            else:
                changes: dict[str, Any] = {
                    CONF_HP_RUNNING_W: int(user_input[CONF_HP_RUNNING_W])
                }
                if text:
                    changes[CONF_DATASHEET] = text
                if user_input.get(CONF_OUTDOOR_TEMP):
                    changes[CONF_OUTDOOR_TEMP] = user_input[CONF_OUTDOOR_TEMP]
                return self._save(
                    changes, cleared=(CONF_DATASHEET, CONF_OUTDOOR_TEMP)
                )

        options = self.config_entry.options
        schema = vol.Schema(
            {
                vol.Optional(
                    CONF_DATASHEET, description=self._suggested(CONF_DATASHEET)
                ): TextSelector(TextSelectorConfig(multiline=True)),
                vol.Optional(
                    CONF_OUTDOOR_TEMP, description=self._suggested(CONF_OUTDOOR_TEMP)
                ): _sensor_selector(),
                vol.Required(
                    CONF_HP_RUNNING_W,
                    default=options.get(CONF_HP_RUNNING_W, DEFAULT_HP_RUNNING_W),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=10,
                        max=5000,
                        step=10,
                        unit_of_measurement="W",
                        mode=NumberSelectorMode.BOX,
                    )
                ),
            }
        )
        return self.async_show_form(
            step_id="heat_pump", data_schema=schema, errors=errors
        )

    async def async_step_actions(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        item_keys = (CONF_HOT_WATER_ITEM, CONF_ROD_BOOST_ITEM)
        if user_input is not None:
            changes = {
                CONF_HOT_WATER_DURATION: int(user_input[CONF_HOT_WATER_DURATION]),
                CONF_ROD_BOOST_DURATION: int(user_input[CONF_ROD_BOOST_DURATION]),
                CONF_ROD_BOOST_PERCENT: int(user_input[CONF_ROD_BOOST_PERCENT]),
            }
            changes.update({k: user_input[k] for k in item_keys if user_input.get(k)})
            return self._save(changes, cleared=item_keys)

        runtime = self._runtime
        writable = [i for i in (runtime.all_items if runtime else []) if i.writable]
        options = self.config_entry.options
        item_selector = SelectSelector(
            SelectSelectorConfig(
                options=[
                    SelectOptionDict(value=i.uid, label=f"{i.name} ({i.address})")
                    for i in writable
                ],
                mode=SelectSelectorMode.DROPDOWN,
            )
        )

        def number(key: str, default: int, low: int, high: int, step: int, unit: str):
            return {
                vol.Required(key, default=options.get(key, default)): NumberSelector(
                    NumberSelectorConfig(
                        min=low,
                        max=high,
                        step=step,
                        unit_of_measurement=unit,
                        mode=NumberSelectorMode.BOX,
                    )
                )
            }

        schema = vol.Schema(
            {
                vol.Optional(
                    CONF_HOT_WATER_ITEM, description=self._suggested(CONF_HOT_WATER_ITEM)
                ): item_selector,
                **number(CONF_HOT_WATER_DURATION, DEFAULT_HOT_WATER_DURATION, 5, 600, 5, "min"),
                vol.Optional(
                    CONF_ROD_BOOST_ITEM, description=self._suggested(CONF_ROD_BOOST_ITEM)
                ): item_selector,
                **number(CONF_ROD_BOOST_DURATION, DEFAULT_ROD_BOOST_DURATION, 5, 600, 5, "min"),
                **number(CONF_ROD_BOOST_PERCENT, DEFAULT_ROD_BOOST_PERCENT, 1, 100, 1, "%"),
            }
        )
        return self.async_show_form(step_id="actions", data_schema=schema)

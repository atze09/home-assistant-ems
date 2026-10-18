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
from homeassistant.const import CONF_HOST, CONF_PORT
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)

from .const import (
    CONF_HOT_WATER_DURATION,
    CONF_HOT_WATER_ITEM,
    CONF_MODULES,
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
    MODULES,
    POWER_METER_OPTIONS,
)
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
                title=f"Rennergy EMS ({self._data[CONF_HOST]})",
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


def _sensor_selector(device_class: str) -> EntitySelector:
    return EntitySelector(
        EntitySelectorConfig(domain="sensor", device_class=device_class)
    )


class RennergyOptionsFlow(OptionsFlow):
    """Options, split into areas, external meters and actions."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        return self.async_show_menu(
            step_id="init", menu_options=["modules", "meters", "actions"]
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
        keys = ENERGY_METER_OPTIONS + POWER_METER_OPTIONS
        if user_input is not None:
            # Fields left empty are removed, so a meter can be unassigned again.
            return self._save(
                {k: user_input[k] for k in keys if user_input.get(k)},
                cleared=keys,
            )

        options = self.config_entry.options
        schema: dict[Any, Any] = {}
        for key in ENERGY_METER_OPTIONS:
            schema[
                vol.Optional(key, description={"suggested_value": options.get(key)})
            ] = _sensor_selector("energy")
        for key in POWER_METER_OPTIONS:
            schema[
                vol.Optional(key, description={"suggested_value": options.get(key)})
            ] = _sensor_selector("power")
        return self.async_show_form(step_id="meters", data_schema=vol.Schema(schema))

    async def async_step_actions(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            changes = {
                CONF_HOT_WATER_DURATION: int(user_input[CONF_HOT_WATER_DURATION])
            }
            if user_input.get(CONF_HOT_WATER_ITEM):
                changes[CONF_HOT_WATER_ITEM] = user_input[CONF_HOT_WATER_ITEM]
            return self._save(changes, cleared=(CONF_HOT_WATER_ITEM,))

        runtime = self._runtime
        writable = [i for i in (runtime.all_items if runtime else []) if i.writable]
        options = self.config_entry.options
        schema = vol.Schema(
            {
                vol.Optional(
                    CONF_HOT_WATER_ITEM,
                    description={"suggested_value": options.get(CONF_HOT_WATER_ITEM)},
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=[
                            SelectOptionDict(value=i.uid, label=f"{i.name} ({i.address})")
                            for i in writable
                        ],
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Required(
                    CONF_HOT_WATER_DURATION,
                    default=options.get(
                        CONF_HOT_WATER_DURATION, DEFAULT_HOT_WATER_DURATION
                    ),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=5,
                        max=600,
                        step=5,
                        unit_of_measurement="min",
                        mode=NumberSelectorMode.BOX,
                    )
                ),
            }
        )
        return self.async_show_form(step_id="actions", data_schema=schema)

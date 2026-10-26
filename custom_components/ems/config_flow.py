"""Config flow of the EMS.

The EMS needs no hardware. A Rennergy smart1 controller can be connected right
away or later in the settings of the panel, where everything else is set up too.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.const import CONF_HOST, CONF_PORT

from .const import (
    CONF_MODULES,
    CONF_RENNERGY,
    CONF_SCAN_INTERVAL,
    CONF_START_ADDRESS,
    CONF_UNIT_ID,
    DEFAULT_PORT,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_START_ADDRESS,
    DEFAULT_UNIT_ID,
    DOMAIN,
    MODULES,
)
from .modbus import ModbusError
from .rennergy import async_probe

_LOGGER = logging.getLogger(__name__)


class EmsConfigFlow(ConfigFlow, domain=DOMAIN):
    """Set up the EMS, optionally with a Rennergy controller."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        errors: dict[str, str] = {}
        if user_input is not None:
            host = (user_input.get(CONF_HOST) or "").strip()
            if not host:
                return self.async_create_entry(title="EMS", data={}, options={})
            rennergy = {
                CONF_HOST: host,
                CONF_PORT: int(user_input.get(CONF_PORT, DEFAULT_PORT)),
                CONF_UNIT_ID: DEFAULT_UNIT_ID,
                CONF_START_ADDRESS: DEFAULT_START_ADDRESS,
            }
            try:
                _system, items = await async_probe(rennergy)
            except ModbusError:
                errors["base"] = "cannot_connect"
            except Exception:
                _LOGGER.exception("Unexpected error during setup")
                errors["base"] = "unknown"
            else:
                if not items:
                    errors["base"] = "no_items"
                else:
                    present = {item.module for item in items}
                    rennergy[CONF_MODULES] = [m for m in MODULES if m in present]
                    rennergy[CONF_SCAN_INTERVAL] = DEFAULT_SCAN_INTERVAL
                    return self.async_create_entry(
                        title="EMS", data={}, options={CONF_RENNERGY: rennergy}
                    )

        defaults = user_input or {}
        schema = vol.Schema(
            {
                vol.Optional(CONF_HOST, default=defaults.get(CONF_HOST, "")): str,
                vol.Optional(CONF_PORT, default=defaults.get(CONF_PORT, DEFAULT_PORT)): vol.All(
                    vol.Coerce(int), vol.Range(min=1, max=65535)
                ),
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

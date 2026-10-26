"""Services of the Rennergy EMS, for use in automations."""

from __future__ import annotations

import voluptuous as vol

from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv, entity_registry as er

from .const import (
    ATTR_DURATION,
    ATTR_VALUE,
    DOMAIN,
    MODE_AUTO,
    SERVICE_SET_AUTO,
    SERVICE_SET_MANUAL,
)
from .coordinator import RennergyData
from .discovery import Item
from .entity import ROLE_MODE, ROLE_VALUE, unique_id

SET_MANUAL_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): cv.entity_ids,
        vol.Optional(ATTR_VALUE): vol.Coerce(float),
        vol.Optional(ATTR_DURATION): vol.All(vol.Coerce(int), vol.Range(min=1, max=1440)),
    }
)
SET_AUTO_SCHEMA = vol.Schema({vol.Required(ATTR_ENTITY_ID): cv.entity_ids})


def _resolve(hass: HomeAssistant, entity_id: str) -> tuple[RennergyData, Item]:
    """Find the controllable item behind a switch, number or mode select."""
    reg_entry = er.async_get(hass).async_get(entity_id)
    entry = (
        hass.config_entries.async_get_entry(reg_entry.config_entry_id)
        if reg_entry and reg_entry.platform == DOMAIN and reg_entry.config_entry_id
        else None
    )
    if entry is None or entry.state is not ConfigEntryState.LOADED:
        raise ServiceValidationError(f"{entity_id} is not an EMS entity")
    data: RennergyData = entry.runtime_data
    serial = data.system.serial
    for item in data.all_items:
        if item.writable and reg_entry.unique_id in (
            unique_id(serial, item, ROLE_VALUE),
            unique_id(serial, item, ROLE_MODE),
        ):
            return data, item
    raise ServiceValidationError(f"{entity_id} cannot be controlled via Modbus")


@callback
def async_register_services(hass: HomeAssistant) -> None:
    async def set_manual(call: ServiceCall) -> None:
        targets = [_resolve(hass, eid) for eid in call.data[ATTR_ENTITY_ID]]
        value = call.data.get(ATTR_VALUE)
        duration = call.data.get(ATTR_DURATION)
        for data, item in targets:
            if value is None and not item.is_switch:
                raise ServiceValidationError(f"{item.name}: a value is required")
            # Switches only know on/off: any value above 0 means on.
            target = 100.0 if value is None else value
            if item.is_switch:
                target = 100.0 if target > 0 else 0.0
            if duration:
                await data.actions.async_run(item, target, duration)
            else:
                if data.actions.active_until(item):
                    data.actions.async_forget(item)
                await data.coordinator.async_set_manual(item, target)

    async def set_auto(call: ServiceCall) -> None:
        for eid in call.data[ATTR_ENTITY_ID]:
            data, item = _resolve(hass, eid)
            if data.actions.active_until(item):
                await data.actions.async_cancel(item)
            else:
                await data.coordinator.async_set_mode(item, MODE_AUTO)

    hass.services.async_register(DOMAIN, SERVICE_SET_MANUAL, set_manual, SET_MANUAL_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_SET_AUTO, set_auto, SET_AUTO_SCHEMA)

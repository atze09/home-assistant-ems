"""Rennergy smart1 controller as an optional source of the EMS.

The controller is reached via Modbus TCP. It describes its items itself, they
become sensors, switches and sliders, and it is the place where the EMS can
take control (manual / automatic, quick load, heating rod boost).
"""

from __future__ import annotations

import logging
import re
from typing import Any

from homeassistant.const import CONF_HOST, CONF_PORT
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from .actions import ActionManager
from .const import (
    CONF_HOT_WATER_ITEM,
    CONF_MODULES,
    CONF_ROD_BOOST_ITEM,
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
from .coordinator import EmsConfigEntry, RennergyCoordinator, RennergyHub
from .discovery import (
    Item,
    SystemInfo,
    assign_roles,
    async_discover,
    async_read_system_info,
    normalize_name,
)
from .modbus import ModbusError, SmartOneClient

_LOGGER = logging.getLogger(__name__)


def _client(config: dict[str, Any]) -> SmartOneClient:
    return SmartOneClient(
        config[CONF_HOST],
        int(config.get(CONF_PORT, DEFAULT_PORT)),
        int(config.get(CONF_UNIT_ID, DEFAULT_UNIT_ID)),
    )


async def async_probe(config: dict[str, Any]) -> tuple[SystemInfo, list[Item]]:
    """Connect once and discover all items, for the settings of the panel.

    Raises ModbusError if the controller cannot be reached.
    """
    client = _client(config)
    try:
        system = await async_read_system_info(client)
        items = await async_discover(
            client, int(config.get(CONF_START_ADDRESS, DEFAULT_START_ADDRESS))
        )
    finally:
        await client.close()
    return system, items


def _action_item(
    options: dict[str, Any], items: list[Item], option: str, *patterns: str
) -> Item | None:
    """Configured item of an action, or the first writable item matching a pattern."""
    writable = [item for item in items if item.writable]
    if uid := options.get(option):
        return next((item for item in writable if item.uid == uid), None)
    for pattern in patterns:
        found = next(
            (item for item in writable if re.search(pattern, normalize_name(item.name))),
            None,
        )
        if found is not None:
            return found
    return None


async def async_setup_rennergy(
    hass: HomeAssistant, entry: EmsConfigEntry, config: dict[str, Any]
) -> RennergyHub:
    """Connect to the controller. Raises ModbusError if it cannot be reached."""
    client = _client(config)
    try:
        system = await async_read_system_info(client)
        all_items = await async_discover(
            client, int(config.get(CONF_START_ADDRESS, DEFAULT_START_ADDRESS))
        )
        modules = set(config.get(CONF_MODULES) or MODULES)
        items = [item for item in all_items if item.module in modules]
        coordinator = RennergyCoordinator(
            hass,
            entry,
            client,
            system,
            items,
            int(config.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)),
        )
        await coordinator.async_refresh()
        if not coordinator.last_update_success:
            raise ModbusError("first update failed")
    except ModbusError:
        await client.close()
        raise

    dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, system.serial)},
        name="Rennergy smart1",
        manufacturer="Rennergy",
        model="smart1",
        serial_number=system.serial,
        sw_version=system.version,
        hw_version=system.hardware or None,
        configuration_url=f"http://{config[CONF_HOST]}",
        via_device=(DOMAIN, entry.entry_id),
    )

    actions = ActionManager(hass, entry.entry_id, coordinator, all_items)
    await actions.async_start()
    options = dict(entry.options)
    return RennergyHub(
        client=client,
        coordinator=coordinator,
        system=system,
        items=items,
        all_items=all_items,
        roles=assign_roles(items),
        actions=actions,
        hot_water_item=_action_item(options, all_items, CONF_HOT_WATER_ITEM, "schnelladung"),
        # Prefer the 0-100 % slider of the heating rod over its on/off switch.
        rod_boost_item=_action_item(
            options, all_items, CONF_ROD_BOOST_ITEM, r"^heizstab 0-100", r"heizstab"
        ),
    )


async def async_unload_rennergy(hub: RennergyHub) -> None:
    await hub.actions.async_stop()
    await hub.client.close()

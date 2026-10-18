"""The Rennergy EMS integration."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_HOST, CONF_PORT, Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv, device_registry as dr
from homeassistant.helpers.typing import ConfigType

from .actions import ActionManager
from .const import (
    CONF_HOT_WATER_ITEM,
    CONF_MODULES,
    CONF_SCAN_INTERVAL,
    CONF_START_ADDRESS,
    CONF_UNIT_ID,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_START_ADDRESS,
    DOMAIN,
    MODULES,
)
from .coordinator import RennergyConfigEntry, RennergyCoordinator, RennergyData
from .discovery import (
    Item,
    assign_roles,
    async_discover,
    async_read_system_info,
    normalize_name,
)
from .modbus import ModbusError, SmartOneClient
from .panel import async_register_panel, async_unregister_panel
from .stats import StatsManager
from .websocket import async_register_websocket

PLATFORMS = [
    Platform.BUTTON,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SENSOR,
    Platform.SWITCH,
]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    async_register_websocket(hass)
    return True


def _hot_water_item(entry: RennergyConfigEntry, items: list[Item]) -> Item | None:
    """Configured quick load item, or the controller's "Schnelladung" switch."""
    writable = [item for item in items if item.writable]
    if uid := entry.options.get(CONF_HOT_WATER_ITEM):
        return next((item for item in writable if item.uid == uid), None)
    return next(
        (item for item in writable if "schnelladung" in normalize_name(item.name)),
        None,
    )


async def async_setup_entry(hass: HomeAssistant, entry: RennergyConfigEntry) -> bool:
    client = SmartOneClient(
        entry.data[CONF_HOST], entry.data[CONF_PORT], entry.data[CONF_UNIT_ID]
    )
    try:
        system = await async_read_system_info(client)
        all_items = await async_discover(
            client, entry.data.get(CONF_START_ADDRESS, DEFAULT_START_ADDRESS)
        )
    except ModbusError as err:
        await client.close()
        raise ConfigEntryNotReady(
            f"Cannot reach Rennergy EMS at {entry.data[CONF_HOST]}: {err}"
        ) from err

    modules = set(entry.options.get(CONF_MODULES, MODULES))
    items = [item for item in all_items if item.module in modules]

    coordinator = RennergyCoordinator(
        hass,
        entry,
        client,
        system,
        items,
        entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL),
    )
    try:
        await coordinator.async_config_entry_first_refresh()
    except ConfigEntryNotReady:
        await client.close()
        raise

    dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, system.serial)},
        name="Rennergy EMS",
        manufacturer="Rennergy",
        model="EMS (smart1)",
        serial_number=system.serial,
        sw_version=system.version,
        hw_version=system.hardware or None,
        configuration_url=f"http://{entry.data[CONF_HOST]}",
    )

    roles = assign_roles(items)
    stats = StatsManager(hass, entry.entry_id, coordinator, dict(entry.options), roles)
    await stats.async_start()
    actions = ActionManager(hass, entry.entry_id, coordinator, all_items)
    await actions.async_start()

    entry.runtime_data = RennergyData(
        client=client,
        coordinator=coordinator,
        system=system,
        items=items,
        all_items=all_items,
        roles=roles,
        stats=stats,
        actions=actions,
        hot_water_item=_hot_water_item(entry, all_items),
    )
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await async_register_panel(hass)
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def _async_reload(hass: HomeAssistant, entry: RennergyConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: RennergyConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        data = entry.runtime_data
        await data.actions.async_stop()
        await data.stats.async_stop()
        await data.client.close()
        others = [
            e
            for e in hass.config_entries.async_entries(DOMAIN)
            if e.entry_id != entry.entry_id and e.state is ConfigEntryState.LOADED
        ]
        if not others:
            async_unregister_panel(hass)
    return unloaded

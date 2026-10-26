"""The EMS integration.

The EMS core (statistics, energy flow, devices per car and consumer) works with
any Home Assistant entities. A Rennergy smart1 controller is an optional source
that adds the heating values and the controls.
"""

from __future__ import annotations

from datetime import timedelta
import logging

from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_HOST, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv, device_registry as dr
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.typing import ConfigType

from .const import CONF_CARS, CONF_LOADS, CONF_RENNERGY, DEVICE_PREFIXES, DOMAIN
from .coordinator import EmsConfigEntry, EmsData
from .modbus import ModbusError
from .panel import async_register_panel, async_unregister_panel
from .rennergy import async_setup_rennergy, async_unload_rennergy
from .services import async_register_services
from .stats import StatsManager, device_list
from .websocket import async_register_websocket

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [
    Platform.BUTTON,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SENSOR,
    Platform.SWITCH,
]

# An unreachable Rennergy is tried again after this time; the EMS keeps running.
RENNERGY_RETRY = timedelta(minutes=2)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    async_register_websocket(hass)
    async_register_services(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: EmsConfigEntry) -> bool:
    dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, entry.entry_id)},
        name="EMS",
        manufacturer="EMS",
        model="Energiemanagement",
    )
    _async_sync_devices(hass, entry)

    hub = None
    error = None
    if config := entry.options.get(CONF_RENNERGY):
        try:
            hub = await async_setup_rennergy(hass, entry, config)
        except ModbusError as err:
            error = f"{config.get(CONF_HOST)}: {err}"
            _LOGGER.warning(
                "Rennergy at %s not reachable (%s), EMS starts without it and retries",
                config.get(CONF_HOST),
                err,
            )

            async def _retry(_now) -> None:
                if entry.state is ConfigEntryState.LOADED:
                    await hass.config_entries.async_reload(entry.entry_id)

            entry.async_on_unload(async_call_later(hass, RENNERGY_RETRY, _retry))

    stats = StatsManager(
        hass,
        entry.entry_id,
        hub.coordinator if hub else None,
        dict(entry.options),
        hub.roles if hub else {},
    )
    await stats.async_start()

    entry.runtime_data = EmsData(stats=stats, rennergy=hub, rennergy_error=error)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await stats.async_after_setup()
    await async_register_panel(hass)
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


def _async_sync_devices(hass: HomeAssistant, entry: EmsConfigEntry) -> None:
    """One device per car and consumer; devices of removed ones are deleted."""
    registry = dr.async_get(hass)
    prefix = f"{entry.entry_id}_"
    wanted: set[str] = set()
    for key, model in ((CONF_CARS, "E-Auto"), (CONF_LOADS, "Verbraucher")):
        for device in device_list(entry.options, key):
            identifier = f"{prefix}{device['id']}"
            wanted.add(identifier)
            registry.async_get_or_create(
                config_entry_id=entry.entry_id,
                identifiers={(DOMAIN, identifier)},
                name=device.get("name") or device["id"],
                manufacturer="EMS",
                model=model,
                via_device=(DOMAIN, entry.entry_id),
            )
    for device in dr.async_entries_for_config_entry(registry, entry.entry_id):
        for domain, identifier in device.identifiers:
            own = domain == DOMAIN and identifier.startswith(prefix)
            if own and identifier[len(prefix) :].startswith(DEVICE_PREFIXES) and identifier not in wanted:
                registry.async_remove_device(device.id)


async def _async_reload(hass: HomeAssistant, entry: EmsConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: EmsConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        data = entry.runtime_data
        await data.stats.async_stop()
        if data.rennergy:
            await async_unload_rennergy(data.rennergy)
        others = [
            e
            for e in hass.config_entries.async_entries(DOMAIN)
            if e.entry_id != entry.entry_id and e.state is ConfigEntryState.LOADED
        ]
        if not others:
            async_unregister_panel(hass)
    return unloaded

"""Websocket API used by the sidebar panel."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN, MODULES, SCHEMA_SECTIONS
from .coordinator import RennergyConfigEntry
from .entity import ROLE_VALUE, entity_specs, module_name, unique_id


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get_config)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/config"})
@callback
def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all systems with their items and entity ids."""
    registry = er.async_get(hass)
    language = hass.config.language
    systems = []
    entry: RennergyConfigEntry
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.state is not ConfigEntryState.LOADED:
            continue
        data = entry.runtime_data
        serial = data.system.serial

        def entity_ids(item) -> dict[str, str]:
            result = {}
            for platform, role in entity_specs(item):
                entity_id = registry.async_get_entity_id(
                    platform, DOMAIN, unique_id(serial, item, role)
                )
                if entity_id:
                    result[role] = entity_id
            return result

        items = []
        by_address: dict[int, dict[str, str]] = {}
        for item in data.items:
            ids = entity_ids(item)
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
            for role, item in data.roles.items()
            if ROLE_VALUE in by_address.get(item.address, {})
        }
        stat_prefix = f"{serial}_stat_"
        stats: dict[str, str] = {}
        buttons: dict[str, str] = {}
        for reg_entry in er.async_entries_for_config_entry(registry, entry.entry_id):
            uid = reg_entry.unique_id
            if uid.startswith(stat_prefix):
                stats[uid[len(stat_prefix) :]] = reg_entry.entity_id
            elif reg_entry.domain == "button":
                buttons[uid[len(serial) + 1 :]] = reg_entry.entity_id

        present = {item.module for item in data.items}
        systems.append(
            {
                "entry_id": entry.entry_id,
                "title": entry.title,
                "serial": serial,
                "version": data.system.version,
                "modules": [
                    {"id": m, "name": module_name(language, m)}
                    for m in MODULES
                    if m in present
                ],
                "items": items,
                "roles": roles,
                "stats": stats,
                "buttons": buttons,
                "power_sensors": data.stats.power_sensors,
                "schema": {
                    field: entry.options[field]
                    for section in SCHEMA_SECTIONS.values()
                    for field in section
                    if entry.options.get(field)
                },
                "hot_water_item": data.hot_water_item.name
                if data.hot_water_item
                else None,
            }
        )
    connection.send_result(msg["id"], {"systems": systems})

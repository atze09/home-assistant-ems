"""Buttons of the Rennergy EMS: hot water quick load, heating rod boost, back to automatic."""

from __future__ import annotations

from typing import Any

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_HOT_WATER_DURATION,
    CONF_ROD_BOOST_DURATION,
    CONF_ROD_BOOST_PERCENT,
    DEFAULT_HOT_WATER_DURATION,
    DEFAULT_ROD_BOOST_DURATION,
    DEFAULT_ROD_BOOST_PERCENT,
    MODE_AUTO,
)
from .coordinator import RennergyConfigEntry, RennergyCoordinator
from .discovery import Item
from .entity import module_device_info


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RennergyConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    data = entry.runtime_data
    options = entry.options
    entities: list[ButtonEntity] = []
    if data.hot_water_item is not None:
        entities.append(
            TimedActionButton(
                data.coordinator,
                data.actions,
                data.hot_water_item,
                key="hot_water_quick_load",
                icon="mdi:water-boiler-alert",
                module="hot_water",
                value=100.0,
                minutes=options.get(CONF_HOT_WATER_DURATION, DEFAULT_HOT_WATER_DURATION),
            )
        )
    if data.rod_boost_item is not None:
        entities.append(
            TimedActionButton(
                data.coordinator,
                data.actions,
                data.rod_boost_item,
                key="heating_rod_boost",
                icon="mdi:heating-coil",
                module="heating_rod",
                value=float(options.get(CONF_ROD_BOOST_PERCENT, DEFAULT_ROD_BOOST_PERCENT)),
                minutes=options.get(CONF_ROD_BOOST_DURATION, DEFAULT_ROD_BOOST_DURATION),
            )
        )
    if any(item.writable for item in data.items):
        entities.append(AllAutomaticButton(data.coordinator, data.actions))
    async_add_entities(entities)


class TimedActionButton(ButtonEntity):
    """Sets an item to manual with a value, back to automatic after a while."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: RennergyCoordinator,
        actions,
        item: Item,
        *,
        key: str,
        icon: str,
        module: str,
        value: float,
        minutes: int,
    ) -> None:
        self._actions = actions
        self._item = item
        # Switches only know on/off.
        self._value = (100.0 if value > 0 else 0.0) if item.is_switch else value
        self._minutes = int(minutes)
        self._attr_translation_key = key
        self._attr_icon = icon
        self._attr_unique_id = f"{coordinator.system.serial}_{key}"
        self._attr_device_info = module_device_info(coordinator, module)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        until = self._actions.active_until(self._item)
        return {
            "item": self._item.name,
            "register": self._item.address,
            "value": self._value,
            "duration_minutes": self._minutes,
            "active_until": until.isoformat() if until else None,
        }

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._actions.async_add_listener(self.async_write_ha_state))

    async def async_press(self) -> None:
        await self._actions.async_run(self._item, self._value, self._minutes)


class AllAutomaticButton(ButtonEntity):
    """Hands every switch and slider back to the controller's automatic."""

    _attr_has_entity_name = True
    _attr_translation_key = "all_automatic"
    _attr_icon = "mdi:autorenew"

    def __init__(self, coordinator: RennergyCoordinator, actions) -> None:
        self._coordinator = coordinator
        self._actions = actions
        self._attr_unique_id = f"{coordinator.system.serial}_all_automatic"
        self._attr_device_info = module_device_info(coordinator, "system")

    async def async_press(self) -> None:
        for item in self._coordinator.items:
            if not item.writable:
                continue
            if self._actions.active_until(item):
                await self._actions.async_cancel(item)
            else:
                await self._coordinator.async_set_mode(item, MODE_AUTO)

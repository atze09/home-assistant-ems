"""Auto/manual mode of writable items of the Rennergy controller."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import MODE_AUTO, MODE_MANUAL
from .coordinator import EmsConfigEntry, RennergyCoordinator
from .discovery import Item
from .entity import ROLE_MODE, RennergyEntity, entity_specs


async def async_setup_entry(
    hass: HomeAssistant,
    entry: EmsConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    hub = entry.runtime_data.rennergy
    if hub is None:
        return
    coordinator = hub.coordinator
    async_add_entities(
        RennergyModeSelect(coordinator, item)
        for item in hub.items
        for platform, _role in entity_specs(item)
        if platform == "select"
    )


class RennergyModeSelect(RennergyEntity, SelectEntity, RestoreEntity):
    """Automatic or manual operation of a switch or slider.

    The device does not report the mode, so the last mode set from Home
    Assistant is shown (assumed state).
    """

    _attr_options = [MODE_AUTO, MODE_MANUAL]
    _attr_assumed_state = True
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, coordinator: RennergyCoordinator, item: Item) -> None:
        super().__init__(coordinator, item, ROLE_MODE)

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        if self.item.address in self.coordinator.modes:
            return
        last = await self.async_get_last_state()
        self.coordinator.modes[self.item.address] = (
            last.state if last and last.state in self._attr_options else MODE_AUTO
        )

    @property
    def current_option(self) -> str | None:
        return self.coordinator.modes.get(self.item.address, MODE_AUTO)

    async def async_select_option(self, option: str) -> None:
        await self.coordinator.async_set_mode(self.item, option)

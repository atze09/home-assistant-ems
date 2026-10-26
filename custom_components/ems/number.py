"""Manual value sliders of the Rennergy controller."""

from __future__ import annotations

from homeassistant.components.number import NumberDeviceClass, NumberEntity, NumberMode
from homeassistant.const import PERCENTAGE, UnitOfPower
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .coordinator import EmsConfigEntry, RennergyCoordinator
from .discovery import Item
from .entity import RennergyEntity, entity_specs


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
        RennergyNumber(coordinator, item)
        for item in hub.items
        for platform, _role in entity_specs(item)
        if platform == "number"
    )


class RennergyNumber(RennergyEntity, NumberEntity):
    """A smart1 ManualValueSlider.

    Setting a value puts the item into manual mode. Use the mode select to
    hand control back to the controller's automatic.
    """

    def __init__(self, coordinator: RennergyCoordinator, item: Item) -> None:
        super().__init__(coordinator, item)
        if item.unit == "W":
            self._attr_native_unit_of_measurement = UnitOfPower.WATT
            self._attr_device_class = NumberDeviceClass.POWER
            self._attr_native_min_value = 0
            self._attr_native_max_value = 30000
            self._attr_native_step = 10
            self._attr_mode = NumberMode.BOX
        else:
            self._attr_native_unit_of_measurement = (
                PERCENTAGE if item.unit == "%" else item.unit or None
            )
            self._attr_native_min_value = 0
            self._attr_native_max_value = 100
            self._attr_native_step = 1
            self._attr_mode = NumberMode.SLIDER

    @property
    def native_value(self) -> float | None:
        values = self.values
        return values[0] if values else None

    async def async_set_native_value(self, value: float) -> None:
        await self.coordinator.async_set_manual(self.item, value)

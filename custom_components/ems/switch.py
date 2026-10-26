"""Manual switches of the Rennergy EMS."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .coordinator import RennergyConfigEntry
from .entity import RennergyEntity, entity_specs


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RennergyConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data.coordinator
    async_add_entities(
        RennergySwitch(coordinator, item)
        for item in entry.runtime_data.items
        for platform, _role in entity_specs(item)
        if platform == "switch"
    )


class RennergySwitch(RennergyEntity, SwitchEntity):
    """A smart1 (Auto)ManualSwitch.

    Switching puts the item into manual mode. Use the mode select to hand
    control back to the controller's automatic.
    """

    @property
    def is_on(self) -> bool | None:
        values = self.values
        if not values or values[0] is None:
            return None
        return values[0] >= 50

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_manual(self.item, 100.0)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_manual(self.item, 0.0)

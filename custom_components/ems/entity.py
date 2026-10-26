"""Devices and the base entity of the Rennergy items."""

from __future__ import annotations

from homeassistant.const import EntityCategory
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, MODULE_NAMES
from .coordinator import ItemValues, RennergyCoordinator
from .discovery import Item

# Value roles created per item, as (platform, role).
ROLE_VALUE = "value"
ROLE_TODAY = "today"
ROLE_LAST_30_DAYS = "last_30_days"
ROLE_YEAR = "year"
ROLE_MODE = "mode"


def entity_specs(item: Item) -> list[tuple[str, str]]:
    """All entities created for an item, as (platform, role)."""
    if item.is_meter:
        return [
            ("sensor", ROLE_VALUE),
            ("sensor", ROLE_TODAY),
            ("sensor", ROLE_LAST_30_DAYS),
            ("sensor", ROLE_YEAR),
        ]
    if item.is_switch:
        return [("switch", ROLE_VALUE), ("select", ROLE_MODE)]
    if item.is_slider:
        return [("number", ROLE_VALUE), ("select", ROLE_MODE)]
    return [("sensor", ROLE_VALUE)]


def unique_id(serial: str, item: Item, role: str) -> str:
    return f"{serial}_{item.uid}_{role}"


def module_name(language: str, module: str) -> str:
    names = MODULE_NAMES.get(language.split("-")[0], MODULE_NAMES["en"])
    return names[module]


def ems_device_info(entry_id: str, key: str, name: str) -> DeviceInfo:
    """A device of the EMS itself (statistics, a car, a consumer)."""
    return DeviceInfo(
        identifiers={(DOMAIN, f"{entry_id}_{key}")},
        name=name,
        manufacturer="EMS",
        via_device=(DOMAIN, entry_id),
    )


def module_device_info(
    coordinator: RennergyCoordinator, module: str
) -> DeviceInfo:
    serial = coordinator.system.serial
    return DeviceInfo(
        identifiers={(DOMAIN, f"{serial}_{module}")},
        name=f"Rennergy {module_name(coordinator.hass.config.language, module)}",
        manufacturer="Rennergy",
        model="EMS (smart1)",
        via_device=(DOMAIN, serial),
    )


class RennergyEntity(CoordinatorEntity[RennergyCoordinator]):
    """An entity backed by one smart1 item."""

    _attr_has_entity_name = True

    def __init__(
        self, coordinator: RennergyCoordinator, item: Item, role: str = ROLE_VALUE
    ) -> None:
        super().__init__(coordinator)
        self.item = item
        self._role = role
        self._attr_unique_id = unique_id(coordinator.system.serial, item, role)
        self._attr_device_info = module_device_info(coordinator, item.module)
        if role == ROLE_VALUE:
            self._attr_name = item.name
        else:
            self._attr_translation_key = role
            self._attr_translation_placeholders = {"name": item.name}
        if item.diagnostic and not item.writable:
            self._attr_entity_category = EntityCategory.DIAGNOSTIC

    @property
    def values(self) -> ItemValues | None:
        if self.coordinator.data is None:
            return None
        return self.coordinator.data.get(self.item.address)

    @property
    def available(self) -> bool:
        return super().available and self.values is not None

    @property
    def extra_state_attributes(self) -> dict[str, int | str]:
        return {"register": self.item.address, "item_key": self.item.uid}

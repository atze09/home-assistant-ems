"""Data update coordinator for the Rennergy EMS."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
import logging
import math
from typing import TYPE_CHECKING

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import DOMAIN, MODE_AUTO, MODE_MANUAL, REG_SET_MODE, REG_SET_VALUE
from .discovery import Item, SystemInfo
from .modbus import ModbusError, ModbusExceptionResponse, SmartOneClient

if TYPE_CHECKING:
    from .actions import ActionManager
    from .stats import StatsManager

_LOGGER = logging.getLogger(__name__)

# Meter: current value, today, last 30 days, year. Others: current value only.
METER_VALUES = 4

type ItemValues = tuple[float | None, ...]
type RennergyConfigEntry = ConfigEntry[RennergyData]


@dataclass
class RennergyData:
    """Runtime data stored on the config entry."""

    client: SmartOneClient
    coordinator: RennergyCoordinator
    system: SystemInfo
    items: list[Item]
    all_items: list[Item]
    roles: dict[str, Item]
    stats: StatsManager
    actions: ActionManager
    hot_water_item: Item | None = None
    rod_boost_item: Item | None = None


class RennergyCoordinator(DataUpdateCoordinator[dict[int, ItemValues]]):
    """Polls all selected items."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        client: SmartOneClient,
        system: SystemInfo,
        items: list[Item],
        interval: int,
    ) -> None:
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=timedelta(seconds=interval),
        )
        self.client = client
        self.system = system
        self.items = items
        # Auto/manual mode is write-only on the device, so it is tracked here.
        self.modes: dict[int, str] = {}

    async def _async_update_data(self) -> dict[int, ItemValues]:
        data: dict[int, ItemValues] = {}
        try:
            for item in self.items:
                count = METER_VALUES if item.is_meter else 1
                try:
                    values = await self.client.read_floats(item.address, count)
                except ModbusExceptionResponse as err:
                    _LOGGER.debug("Skipping %s (%s): %s", item.name, item.address, err)
                    continue
                data[item.address] = tuple(
                    None if math.isnan(v) or math.isinf(v) else v for v in values
                )
        except ModbusError as err:
            raise UpdateFailed(str(err)) from err
        return data

    async def async_set_manual(self, item: Item, value: float) -> None:
        """Switch an item to manual mode and set its value."""
        try:
            await self.client.write_float(item.address + REG_SET_MODE, 100.0)
            await self.client.write_float(item.address + REG_SET_VALUE, float(value))
        except ModbusError as err:
            raise HomeAssistantError(f"Writing {item.name} failed: {err}") from err
        self.modes[item.address] = MODE_MANUAL
        if self.data is not None:
            current = self.data.get(item.address, (None,))
            self.data[item.address] = (float(value), *current[1:])
        self.async_update_listeners()
        await self.async_request_refresh()

    async def async_set_mode(self, item: Item, mode: str) -> None:
        """Switch an item between automatic and manual mode."""
        try:
            await self.client.write_float(
                item.address + REG_SET_MODE, 100.0 if mode == MODE_MANUAL else 0.0
            )
        except ModbusError as err:
            raise HomeAssistantError(f"Writing {item.name} failed: {err}") from err
        self.modes[item.address] = mode if mode == MODE_MANUAL else MODE_AUTO
        self.async_update_listeners()
        await self.async_request_refresh()

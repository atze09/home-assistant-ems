"""Timed manual overrides (e.g. hot water quick load) that survive restarts."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
import logging

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN, MODE_AUTO
from .coordinator import RennergyCoordinator
from .discovery import Item

_LOGGER = logging.getLogger(__name__)


class ActionManager:
    """Switches items to manual for a while and back to automatic afterwards."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_id: str,
        coordinator: RennergyCoordinator,
        items: list[Item],
    ) -> None:
        self.hass = hass
        self.coordinator = coordinator
        self._items = items
        self._store: Store[dict[str, str]] = Store(hass, 1, f"{DOMAIN}.actions.{entry_id}")
        self._timers: dict[int, datetime] = {}
        self._cancel: dict[int, Callable[[], None]] = {}
        self._listeners: list[Callable[[], None]] = []

    def _item(self, address: int) -> Item | None:
        return next((i for i in self._items if i.address == address), None)

    async def async_start(self) -> None:
        stored = await self._store.async_load() or {}
        now = dt_util.utcnow()
        for address_str, end_str in stored.items():
            address = int(address_str)
            end = dt_util.parse_datetime(end_str)
            item = self._item(address)
            if item is None or end is None:
                continue
            if end <= now:
                await self._async_finish(item)
            else:
                self._schedule(item, end)

    async def async_stop(self) -> None:
        for cancel in self._cancel.values():
            cancel()
        self._cancel.clear()

    def active_until(self, item: Item) -> datetime | None:
        return self._timers.get(item.address)

    @callback
    def async_add_listener(self, update: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(update)
        return lambda: self._listeners.remove(update)

    async def async_run(self, item: Item, value: float, minutes: int) -> None:
        """Set `item` to `value` in manual mode, back to automatic after `minutes`."""
        if not item.writable:
            raise HomeAssistantError(f"{item.name} cannot be controlled via Modbus")
        await self.coordinator.async_set_manual(item, value)
        self._schedule(item, dt_util.utcnow() + timedelta(minutes=minutes))
        await self._async_save()

    async def async_cancel(self, item: Item) -> None:
        """Stop a running override right away."""
        await self._async_finish(item)

    def _schedule(self, item: Item, end: datetime) -> None:
        if cancel := self._cancel.pop(item.address, None):
            cancel()
        self._timers[item.address] = end

        async def _done(_now: datetime) -> None:
            self._cancel.pop(item.address, None)
            await self._async_finish(item)

        self._cancel[item.address] = async_track_point_in_utc_time(self.hass, _done, end)
        self._notify()

    async def _async_finish(self, item: Item) -> None:
        if cancel := self._cancel.pop(item.address, None):
            cancel()
        self._timers.pop(item.address, None)
        try:
            await self.coordinator.async_set_mode(item, MODE_AUTO)
        except HomeAssistantError as err:
            _LOGGER.warning("Could not switch %s back to automatic: %s", item.name, err)
        await self._async_save()
        self._notify()

    async def _async_save(self) -> None:
        await self._store.async_save(
            {str(a): end.isoformat() for a, end in self._timers.items()}
        )

    def _notify(self) -> None:
        for update in list(self._listeners):
            update()

"""Statistics of the Rennergy EMS: period energies, work ratios, runtimes.

External meters (heat meters, heat pump electricity) and internal Rennergy
meters are integrated into per period sums (day, week, month, year). The
sums are stored, so they survive restarts.
"""

from __future__ import annotations

from collections import deque
from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CONF_HC1_HEAT_ENERGY,
    CONF_HC2_HEAT_ENERGY,
    CONF_HP_ELECTRIC_ENERGY,
    CONF_HP_ELECTRIC_POWER,
    CONF_HP_HEAT_ENERGY,
    CONF_HP_HEAT_POWER,
    CONF_PV_ENERGY,
    CONF_PV_POWER,
    CONF_STOVE_HEAT_ENERGY,
    CONF_STOVE_HEAT_POWER,
    DOMAIN,
    PERIODS,
)
from .coordinator import RennergyCoordinator
from .discovery import Item

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1
SAVE_DELAY = 60
COP_WINDOW = timedelta(minutes=15)
# Heating rod counts as running above this power.
HEATING_ROD_ON_W = 20

_ENERGY_TO_KWH = {
    "Wh": 0.001,
    "kWh": 1.0,
    "MWh": 1000.0,
    "GJ": 277.7778,
    "MJ": 0.2777778,
}
_POWER_TO_W = {"W": 1.0, "kW": 1000.0, "MW": 1_000_000.0}

# Energy sources: key -> option holding the external entity.
EXTERNAL_ENERGY_SOURCES: dict[str, str] = {
    "pv": CONF_PV_ENERGY,
    "hp_heat": CONF_HP_HEAT_ENERGY,
    "hp_electric": CONF_HP_ELECTRIC_ENERGY,
    "hc1_heat": CONF_HC1_HEAT_ENERGY,
    "hc2_heat": CONF_HC2_HEAT_ENERGY,
    "stove_heat": CONF_STOVE_HEAT_ENERGY,
}
HEATING_ROD = "heating_rod"
HEATING_ROD_RUNTIME = "heating_rod_runtime"
GRID_IMPORT = "grid_import"
GRID_EXPORT = "grid_export"
CONSUMPTION = "consumption"
# Internal sources: key -> role of the Rennergy meter.
INTERNAL_ENERGY_SOURCES: dict[str, str] = {
    HEATING_ROD: "heating_rod_power",
    GRID_IMPORT: "grid_import",
    GRID_EXPORT: "grid_export",
    CONSUMPTION: "total_consumption",
}


def period_key(period: str, now: datetime) -> str:
    local = dt_util.as_local(now)
    if period == "day":
        return local.date().isoformat()
    if period == "week":
        year, week, _ = local.isocalendar()
        return f"{year}-W{week:02d}"
    if period == "month":
        return f"{local.year}-{local.month:02d}"
    return str(local.year)


class PeriodSums:
    """Sums of increments per period plus an all time total."""

    def __init__(self, data: dict[str, Any] | None = None) -> None:
        data = data or {}
        self.total: float = data.get("total", 0.0)
        self.periods: dict[str, dict[str, Any]] = data.get("periods", {})

    def roll(self, now: datetime) -> None:
        for period in PERIODS:
            key = period_key(period, now)
            current = self.periods.get(period)
            if current is None or current["key"] != key:
                self.periods[period] = {
                    "key": key,
                    "sum": 0.0,
                    "previous": current["sum"] if current else None,
                }

    def add(self, amount: float, now: datetime) -> None:
        self.roll(now)
        self.total += amount
        for period in PERIODS:
            self.periods[period]["sum"] += amount

    def value(self, period: str, now: datetime) -> float:
        self.roll(now)
        return self.periods[period]["sum"]

    def as_dict(self) -> dict[str, Any]:
        return {"total": self.total, "periods": self.periods}


class CounterIntegrator(PeriodSums):
    """Turns readings of a (possibly resetting) energy counter into sums."""

    def __init__(self, data: dict[str, Any] | None = None) -> None:
        super().__init__(data)
        self.last: float | None = (data or {}).get("last")
        self.source: str | None = (data or {}).get("source")

    def reading(self, value: float, now: datetime) -> None:
        last = self.last
        if last is None:
            self.last = value
            self.roll(now)
            return
        if value >= last:
            delta = value - last
        elif value < last * 0.5 or value < 1.0:
            # Counter was reset (daily / yearly counter or meter exchange).
            delta = value
        else:
            # Small decrease: rounding or a glitch, ignore it.
            return
        self.last = value
        self.add(delta, now)

    def as_dict(self) -> dict[str, Any]:
        return {**super().as_dict(), "last": self.last, "source": self.source}


@dataclass
class _Sample:
    time: datetime
    heat: float
    electric: float


class StatsManager:
    """Collects all statistics of one config entry."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_id: str,
        coordinator: RennergyCoordinator,
        options: dict[str, Any],
        roles: dict[str, Item],
    ) -> None:
        self.hass = hass
        self.coordinator = coordinator
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.stats.{entry_id}"
        )
        self.external: dict[str, str] = {
            key: options[option]
            for key, option in EXTERNAL_ENERGY_SOURCES.items()
            if options.get(option)
        }
        self.power_sensors: dict[str, str] = {
            key: options[option]
            for key, option in (
                ("pv", CONF_PV_POWER),
                ("hp_heat", CONF_HP_HEAT_POWER),
                ("hp_electric", CONF_HP_ELECTRIC_POWER),
                ("stove_heat", CONF_STOVE_HEAT_POWER),
            )
            if options.get(option)
        }
        self.heating_rod: Item | None = roles.get("heating_rod_power")
        # Rennergy meters integrated from their yearly counter.
        self.internal: dict[str, Item] = {
            key: roles[role]
            for key, role in INTERNAL_ENERGY_SOURCES.items()
            if role in roles
        }
        self.sums: dict[str, PeriodSums] = {}
        self._last_rod_update: datetime | None = None
        self._cop_samples: deque[_Sample] = deque()
        self._listeners: list[Callable[[], None]] = []
        self._unsubs: list[Callable[[], None]] = []

    @property
    def energy_sources(self) -> list[str]:
        return [*self.external, *self.internal]

    def autarky(self, period: str) -> float | None:
        """Share of consumption not covered by the grid, in %."""
        grid = self.energy(GRID_IMPORT, period)
        consumption = self.energy(CONSUMPTION, period)
        if grid is None or not consumption or consumption < 0.05:
            return None
        return max(0.0, min(100.0, (1 - grid / consumption) * 100))

    def self_consumption(self, period: str) -> float | None:
        """Share of PV energy used on site, in %."""
        pv = self.energy("pv", period)
        export = self.energy(GRID_EXPORT, period)
        if export is None or not pv or pv < 0.05:
            return None
        return max(0.0, min(100.0, (1 - export / pv) * 100))

    @property
    def has_work_ratio(self) -> bool:
        return "hp_heat" in self.external and "hp_electric" in self.external

    @property
    def has_cop(self) -> bool:
        return self.has_work_ratio or (
            "hp_heat" in self.power_sensors and "hp_electric" in self.power_sensors
        )

    async def async_start(self) -> None:
        stored = await self._store.async_load() or {}
        for key in self.energy_sources:
            integrator = CounterIntegrator(stored.get(key))
            source = self.external.get(key) or f"item:{self.internal[key].uid}"
            if integrator.source != source:
                # Another meter was assigned: continue the sums, but do not
                # take the difference between two unrelated counters.
                integrator.last = None
                integrator.source = source
            self.sums[key] = integrator
        if self.heating_rod is not None:
            self.sums[HEATING_ROD_RUNTIME] = PeriodSums(stored.get(HEATING_ROD_RUNTIME))
            self._last_rod_update = dt_util.utcnow()

        for key, entity_id in self.external.items():
            state = self.hass.states.get(entity_id)
            if state is not None:
                self._read_external(key, state)
        if self.external or self.power_sensors:
            self._unsubs.append(
                async_track_state_change_event(
                    self.hass,
                    [*self.external.values(), *self.power_sensors.values()],
                    self._on_state_change,
                )
            )
        self._unsubs.append(self.coordinator.async_add_listener(self._on_coordinator))
        # Make period sums jump to zero right after midnight.
        self._unsubs.append(
            async_track_time_change(self.hass, self._on_midnight, hour=0, minute=0, second=1)
        )
        self._on_coordinator()

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        await self._store.async_save(self._data())

    @callback
    def async_add_listener(self, update: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(update)
        return lambda: self._listeners.remove(update)

    # ---------- values ----------

    def energy(self, source: str, period: str) -> float | None:
        sums = self.sums.get(source)
        return None if sums is None else sums.value(period, dt_util.utcnow())

    def runtime_hours(self, period: str) -> float | None:
        sums = self.sums.get(HEATING_ROD_RUNTIME)
        return None if sums is None else sums.value(period, dt_util.utcnow()) / 3600

    def work_ratio(self, period: str) -> float | None:
        heat = self.energy("hp_heat", period)
        electric = self.energy("hp_electric", period)
        if heat is None or not electric or electric < 0.05:
            return None
        return heat / electric

    def cop(self) -> float | None:
        heat_w = self._power("hp_heat")
        electric_w = self._power("hp_electric")
        if heat_w is not None and electric_w is not None:
            return heat_w / electric_w if electric_w > 50 else None
        if len(self._cop_samples) < 2:
            return None
        first, last = self._cop_samples[0], self._cop_samples[-1]
        electric = last.electric - first.electric
        if electric < 0.01:
            return None
        return (last.heat - first.heat) / electric

    def power(self, source: str) -> float | None:
        return self._power(source)

    # ---------- internals ----------

    def _power(self, key: str) -> float | None:
        entity_id = self.power_sensors.get(key)
        state = entity_id and self.hass.states.get(entity_id)
        if not state or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return None
        try:
            value = float(state.state)
        except ValueError:
            return None
        return value * _POWER_TO_W.get(state.attributes.get("unit_of_measurement", "W"), 1.0)

    def _read_external(self, key: str, state) -> bool:
        if state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return False
        try:
            value = float(state.state)
        except ValueError:
            return False
        unit = state.attributes.get("unit_of_measurement", "kWh")
        factor = _ENERGY_TO_KWH.get(unit)
        if factor is None:
            _LOGGER.warning("%s has unsupported energy unit %s", state.entity_id, unit)
            return False
        integrator = self.sums[key]
        assert isinstance(integrator, CounterIntegrator)
        integrator.reading(value * factor, dt_util.utcnow())
        return True

    @callback
    def _on_state_change(self, event: Event[EventStateChangedData]) -> None:
        entity_id = event.data["entity_id"]
        state = event.data["new_state"]
        for key, source in self.external.items():
            if source == entity_id and state is not None:
                if self._read_external(key, state) and key in ("hp_heat", "hp_electric"):
                    self._sample_cop()
                self._store.async_delay_save(self._data, SAVE_DELAY)
        self._notify()

    @callback
    def _on_coordinator(self) -> None:
        data = self.coordinator.data
        if not data:
            return
        now = dt_util.utcnow()
        for key, item in self.internal.items():
            values = data.get(item.address)
            # Year counter in Wh resets once a year, the integrator handles that.
            if values and len(values) > 3 and values[3] is not None:
                integrator = self.sums[key]
                assert isinstance(integrator, CounterIntegrator)
                integrator.reading(values[3] / 1000, now)

        rod = self.heating_rod
        if rod is not None and rod.address in data:
            power = data[rod.address][0]
            if self._last_rod_update is not None and power is not None and power > HEATING_ROD_ON_W:
                seconds = (now - self._last_rod_update).total_seconds()
                # Ignore gaps (e.g. connection loss) longer than a few polls.
                if 0 < seconds < 600:
                    self.sums[HEATING_ROD_RUNTIME].add(seconds, now)
            self._last_rod_update = now
        self._store.async_delay_save(self._data, SAVE_DELAY)
        self._notify()

    @callback
    def _on_midnight(self, _now: datetime) -> None:
        self._notify()

    def _sample_cop(self) -> None:
        heat = self.sums["hp_heat"].total
        electric = self.sums["hp_electric"].total
        now = dt_util.utcnow()
        self._cop_samples.append(_Sample(now, heat, electric))
        while len(self._cop_samples) > 2 and now - self._cop_samples[1].time > COP_WINDOW:
            self._cop_samples.popleft()

    def _notify(self) -> None:
        for update in list(self._listeners):
            update()

    def _data(self) -> dict[str, Any]:
        return {key: sums.as_dict() for key, sums in self.sums.items()}

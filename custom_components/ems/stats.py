"""Statistics of the Rennergy EMS.

* Energy per period (day, week, month, year) is read from Home Assistant's
  long-term statistics, so it is correct right away (including history) and
  robust against counter resets or glitches at startup.
* Heat pump factor (COP x temperature lift), datasheet targets and heating
  rod runtime are integrated by the integration itself and stored.
"""

from __future__ import annotations

from collections import deque
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.statistics import statistic_during_period
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, State, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import (
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CARS,
    CONF_BATTERY_CHARGE_ENERGY,
    CONF_BATTERY_DISCHARGE_ENERGY,
    CONF_BATTERY_POWER,
    CONF_CONSUMPTION_ENERGY,
    CONF_DATASHEET,
    CONF_GRID_EXPORT_ENERGY,
    CONF_GRID_IMPORT_ENERGY,
    CONF_GRID_POWER,
    CONF_HOUSE_POWER,
    CONF_ROD_ENERGY,
    CONF_ROD_POWER,
    CONF_WATER_VOLUME,
    CONF_HC1_HEAT_ENERGY,
    CONF_HC2_HEAT_ENERGY,
    CONF_HP_ELECTRIC_ENERGY,
    CONF_HP_ELECTRIC_POWER,
    CONF_HP_FLOW_TEMP,
    CONF_HP_HEAT_ENERGY,
    CONF_HP_HEAT_POWER,
    CONF_HP_RUNNING_W,
    CONF_OUTDOOR_TEMP,
    CONF_PV_ENERGY,
    CONF_PV_POWER,
    CONF_STOVE_HEAT_ENERGY,
    CONF_STOVE_HEAT_POWER,
    DEFAULT_HP_RUNNING_W,
    DOMAIN,
    LOADS,
    PERIODS,
)
from .coordinator import RennergyCoordinator
from .datasheet import carnot_cop, parse_datasheet, target_cop
from .discovery import Item

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1
SAVE_DELAY = 60
REFRESH_INTERVAL = timedelta(minutes=5)
# Heating rod counts as running above this power.
HEATING_ROD_ON_W = 20
# Larger jumps of an energy counter are treated as glitches, not energy.
MAX_PLAUSIBLE_KW = 100.0
# Current COP from the energy counters: heat / electricity over the last
# 30 minutes. Heat meters often report power only now and then, while their
# counters (which also give the work ratios) are reliable.
COP_WINDOW = timedelta(minutes=30)
COP_MIN_SPAN = timedelta(minutes=10)
COP_MIN_ELECTRIC_KWH = 0.1
COP_MAX = 15.0

_ENERGY_TO_KWH = {"Wh": 0.001, "kWh": 1.0, "MWh": 1000.0, "GJ": 277.7778, "MJ": 0.2777778}
_POWER_TO_W = {"W": 1.0, "kW": 1000.0, "MW": 1_000_000.0}

HEATING_ROD = "heating_rod"
HEATING_ROD_RUNTIME = "heating_rod_runtime"
GRID_IMPORT = "grid_import"
GRID_EXPORT = "grid_export"
CONSUMPTION = "consumption"
BATTERY_CHARGE = "battery_charge"
BATTERY_DISCHARGE = "battery_discharge"
WATER = "water"
HP_FACTOR = "hp_factor"

# External energy sources: key -> option. They win over internal sources
# with the same key.
EXTERNAL_ENERGY_SOURCES: dict[str, str] = {
    "pv": CONF_PV_ENERGY,
    GRID_IMPORT: CONF_GRID_IMPORT_ENERGY,
    GRID_EXPORT: CONF_GRID_EXPORT_ENERGY,
    BATTERY_CHARGE: CONF_BATTERY_CHARGE_ENERGY,
    BATTERY_DISCHARGE: CONF_BATTERY_DISCHARGE_ENERGY,
    CONSUMPTION: CONF_CONSUMPTION_ENERGY,
    HEATING_ROD: CONF_ROD_ENERGY,
    WATER: CONF_WATER_VOLUME,
    **{device: f"{device}_energy" for device in (*CARS, *LOADS)},
    "hp_heat": CONF_HP_HEAT_ENERGY,
    "hp_electric": CONF_HP_ELECTRIC_ENERGY,
    "hc1_heat": CONF_HC1_HEAT_ENERGY,
    "hc2_heat": CONF_HC2_HEAT_ENERGY,
    "stove_heat": CONF_STOVE_HEAT_ENERGY,
}
EXTERNAL_POWER_SOURCES: dict[str, str] = {
    "pv": CONF_PV_POWER,
    "grid": CONF_GRID_POWER,
    "battery": CONF_BATTERY_POWER,
    "house": CONF_HOUSE_POWER,
    HEATING_ROD: CONF_ROD_POWER,
    "hp_heat": CONF_HP_HEAT_POWER,
    "hp_electric": CONF_HP_ELECTRIC_POWER,
    "stove_heat": CONF_STOVE_HEAT_POWER,
}
# Internal sources: key -> role of the Rennergy meter (its yearly counter).
INTERNAL_ENERGY_SOURCES: dict[str, str] = {
    HEATING_ROD: "heating_rod_power",
    GRID_IMPORT: "grid_import",
    GRID_EXPORT: "grid_export",
    BATTERY_CHARGE: "battery_charge",
    BATTERY_DISCHARGE: "battery_discharge",
    CONSUMPTION: "total_consumption",
}


def _as_list(value: Any) -> list[str]:
    if not value:
        return []
    return [value] if isinstance(value, str) else list(value)


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


def period_start(period: str, now: datetime) -> datetime:
    start = dt_util.start_of_local_day(dt_util.as_local(now))
    if period == "week":
        return start - timedelta(days=start.weekday())
    if period == "month":
        return start.replace(day=1)
    if period == "year":
        return start.replace(month=1, day=1)
    return start


class PeriodSums:
    """Sums per period plus an all time total, for several named values."""

    def __init__(self, data: dict[str, Any] | None = None) -> None:
        data = data or {}
        self.periods: dict[str, dict[str, Any]] = data.get("periods", {})

    def _roll(self, now: datetime) -> None:
        for period in PERIODS:
            key = period_key(period, now)
            current = self.periods.get(period)
            if current is None or current["key"] != key:
                self.periods[period] = {"key": key, "values": {}}

    def add(self, values: dict[str, float], now: datetime) -> None:
        self._roll(now)
        for period in PERIODS:
            sums = self.periods[period]["values"]
            for name, amount in values.items():
                sums[name] = sums.get(name, 0.0) + amount

    def get(self, period: str, name: str, now: datetime) -> float:
        self._roll(now)
        return self.periods[period]["values"].get(name, 0.0)

    def as_dict(self) -> dict[str, Any]:
        return {"periods": self.periods}


def _float_state(state: State | None) -> float | None:
    if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
        return None
    try:
        return float(state.state)
    except ValueError:
        return None


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
        self._entry_id = entry_id
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.stats_v2.{entry_id}"
        )
        self.external: dict[str, list[str]] = {
            key: _as_list(options.get(option))
            for key, option in EXTERNAL_ENERGY_SOURCES.items()
            if options.get(option)
        }
        self.power_sensors: dict[str, list[str]] = {
            key: _as_list(options.get(option))
            for key, option in EXTERNAL_POWER_SOURCES.items()
            if options.get(option)
        }
        # Display names of cars and further consumers.
        self.names: dict[str, str] = {
            **{
                car: options.get(f"{car}_name") or f"E-Auto {index}"
                for index, car in enumerate(CARS, 1)
            },
            **{
                load: options.get(f"{load}_name") or f"Verbraucher {index}"
                for index, load in enumerate(LOADS, 1)
            },
        }
        self.roles = roles
        self.heating_rod: Item | None = roles.get("heating_rod_power")
        self.internal: dict[str, Item] = {
            key: roles[role]
            for key, role in INTERNAL_ENERGY_SOURCES.items()
            if role in roles and key not in self.external
        }
        self.datasheet = parse_datasheet(options.get(CONF_DATASHEET) or "")
        self.flow_sensor: str | None = options.get(CONF_HP_FLOW_TEMP)
        self.outdoor_sensor: str | None = options.get(CONF_OUTDOOR_TEMP)
        self.running_w: float = options.get(CONF_HP_RUNNING_W, DEFAULT_HP_RUNNING_W)

        # Energy per source and period from the long-term statistics (kWh).
        self._energy: dict[str, dict[str, float | None]] = {}
        self._runtime = PeriodSums()
        self._factor = PeriodSums()
        self._last_totals: dict[str, float] = {}
        # (time, heat counter, electricity counter) of the heat pump, in kWh.
        self._cop_samples: deque[tuple[datetime, float, float]] = deque()
        self._last_tick: datetime | None = None
        self._listeners: list[Callable[[], None]] = []
        self._unsubs: list[Callable[[], None]] = []

    # ---------- lifecycle ----------

    async def async_start(self) -> None:
        stored = await self._store.async_load() or {}
        self._runtime = PeriodSums(stored.get(HEATING_ROD_RUNTIME))
        self._factor = PeriodSums(stored.get(HP_FACTOR))
        self._unsubs.append(self.coordinator.async_add_listener(self._on_tick))
        self._unsubs.append(
            async_track_time_interval(self.hass, self._async_refresh, REFRESH_INTERVAL)
        )
        # Period sums start from zero right after midnight.
        self._unsubs.append(
            async_track_time_change(self.hass, self._async_refresh, hour=0, minute=0, second=5)
        )

    async def async_after_setup(self) -> None:
        """First refresh, once our own entities exist."""
        await self._async_refresh()

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        await self._store.async_save(self._data())

    @callback
    def async_add_listener(self, update: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(update)
        return lambda: self._listeners.remove(update)

    # ---------- what is available ----------

    @property
    def energy_sources(self) -> list[str]:
        return [*self.external, *self.internal]

    @property
    def has_work_ratio(self) -> bool:
        return "hp_heat" in self.external and "hp_electric" in self.external

    @property
    def has_cop(self) -> bool:
        has_power = "hp_heat" in self.power_sensors and "hp_electric" in self.power_sensors
        return has_power or self.has_work_ratio

    @property
    def has_lift(self) -> bool:
        return self.flow_sensor is not None and (
            self.outdoor_sensor is not None or "outdoor_temp" in self.roles
        )

    @property
    def has_factor(self) -> bool:
        return self.has_work_ratio and self.has_lift

    @property
    def has_target(self) -> bool:
        return bool(self.datasheet)

    # ---------- values ----------

    def energy(self, source: str, period: str) -> float | None:
        return self._energy.get(source, {}).get(period)

    def work_ratio(self, period: str) -> float | None:
        heat = self.energy("hp_heat", period)
        electric = self.energy("hp_electric", period)
        if heat is None or not electric or electric < 0.05:
            return None
        return heat / electric

    def autarky(self, period: str) -> float | None:
        grid = self.energy(GRID_IMPORT, period)
        consumption = self.energy(CONSUMPTION, period)
        if grid is None or not consumption or consumption < 0.05:
            return None
        return max(0.0, min(100.0, (1 - grid / consumption) * 100))

    def self_consumption(self, period: str) -> float | None:
        pv = self.energy("pv", period)
        export = self.energy(GRID_EXPORT, period)
        if export is None or not pv or pv < 0.05:
            return None
        return max(0.0, min(100.0, (1 - export / pv) * 100))

    @property
    def has_rod(self) -> bool:
        return self.heating_rod is not None or HEATING_ROD in self.power_sensors

    def rod_power(self, data: dict[int, Any] | None = None) -> float | None:
        """Heating rod power in W: external sensor first, then the Rennergy item."""
        if HEATING_ROD in self.power_sensors:
            return self.power(HEATING_ROD)
        data = self.coordinator.data if data is None else data
        rod = self.heating_rod
        if rod is None or not data or rod.address not in data:
            return None
        return data[rod.address][0]

    def runtime_hours(self, period: str) -> float | None:
        if not self.has_rod:
            return None
        return self._runtime.get(period, "seconds", dt_util.utcnow()) / 3600

    def power(self, source: str) -> float | None:
        """Sum of the power sensors of a source in W."""
        total = None
        for entity_id in self.power_sensors.get(source, []):
            state = self.hass.states.get(entity_id)
            value = _float_state(state)
            if value is None:
                continue
            unit = state.attributes.get("unit_of_measurement", "W")
            total = (total or 0.0) + value * _POWER_TO_W.get(unit, 1.0)
        return total

    def flow_temp(self) -> float | None:
        return _float_state(self.hass.states.get(self.flow_sensor)) if self.flow_sensor else None

    def outdoor_temp(self) -> float | None:
        if self.outdoor_sensor:
            return _float_state(self.hass.states.get(self.outdoor_sensor))
        item = self.roles.get("outdoor_temp")
        data = self.coordinator.data or {}
        if item is None or item.address not in data:
            return None
        return data[item.address][0]

    def lift(self) -> float | None:
        flow, outdoor = self.flow_temp(), self.outdoor_temp()
        return None if flow is None or outdoor is None else flow - outdoor

    def hp_running(self) -> bool:
        electric = self.power("hp_electric")
        if electric is not None:
            return electric > self.running_w
        heat = self.power("hp_heat")
        if heat is not None:
            return heat > 0
        # No power sensors: running if the electricity counter moved lately.
        if len(self._cop_samples) < 2:
            return False
        newest = self._cop_samples[-1]
        recent = [s for s in self._cop_samples if newest[0] - s[0] <= COP_MIN_SPAN]
        return newest[2] - recent[0][2] > 0

    def _counter_cop(self) -> float | None:
        """COP from the energy counters over the last COP_WINDOW."""
        if len(self._cop_samples) < 2:
            return None
        start, newest = self._cop_samples[0], self._cop_samples[-1]
        if newest[0] - start[0] < COP_MIN_SPAN:
            return None
        heat, electric = newest[1] - start[1], newest[2] - start[2]
        if electric < COP_MIN_ELECTRIC_KWH or heat <= 0:
            return None
        return heat / electric

    def cop(self) -> float | None:
        if not self.hp_running():
            return None
        cop = self._counter_cop()
        if cop is None:
            heat, electric = self.power("hp_heat"), self.power("hp_electric")
            # A heat power of 0 while running is a stale reading, not COP 0.
            if not heat or not electric or heat <= 0:
                return None
            cop = heat / electric
        return cop if 0 < cop <= COP_MAX else None

    def cop_target(self) -> float | None:
        flow, outdoor = self.flow_temp(), self.outdoor_temp()
        if flow is None or outdoor is None:
            return None
        return target_cop(self.datasheet, outdoor, flow)

    def factor(self) -> float | None:
        cop, lift = self.cop(), self.lift()
        return None if cop is None or lift is None else cop * lift

    def factor_target(self) -> float | None:
        cop, lift = self.cop_target(), self.lift()
        return None if cop is None or lift is None else cop * lift

    def efficiency(self) -> float | None:
        """Carnot efficiency (Gütegrad) in %."""
        cop, flow, outdoor = self.cop(), self.flow_temp(), self.outdoor_temp()
        if cop is None or flow is None or outdoor is None:
            return None
        return cop / carnot_cop(flow, outdoor) * 100

    def period_lift(self, period: str) -> float | None:
        now = dt_util.utcnow()
        heat = self._factor.get(period, "heat", now)
        return self._factor.get(period, "heat_lift", now) / heat if heat > 0.5 else None

    def period_factor(self, period: str) -> float | None:
        now = dt_util.utcnow()
        heat = self._factor.get(period, "heat", now)
        electric = self._factor.get(period, "electric", now)
        lift = self.period_lift(period)
        if lift is None or electric < 0.1:
            return None
        return heat / electric * lift

    def period_factor_target(self, period: str) -> float | None:
        now = dt_util.utcnow()
        heat = self._factor.get(period, "heat", now)
        expected = self._factor.get(period, "expected_electric", now)
        lift = self.period_lift(period)
        if lift is None or expected < 0.1:
            return None
        return heat / expected * lift

    def period_target_ratio(self, period: str) -> float | None:
        """Actual vs. datasheet performance in % (100 % = as specified)."""
        now = dt_util.utcnow()
        electric = self._factor.get(period, "electric", now)
        expected = self._factor.get(period, "expected_electric", now)
        if electric < 0.1 or expected < 0.1:
            return None
        return expected / electric * 100

    def target_ratio(self) -> float | None:
        cop, target = self.cop(), self.cop_target()
        return None if cop is None or not target else cop / target * 100

    # ---------- internals ----------

    def entity_ids(self, source: str) -> list[str]:
        if source in self.external:
            return self.external[source]
        item = self.internal.get(source)
        if item is None:
            return []
        registry = er.async_get(self.hass)
        entity_id = registry.async_get_entity_id(
            "sensor", DOMAIN, f"{self.coordinator.system.serial}_{item.uid}_year"
        )
        return [entity_id] if entity_id else []

    async def _async_refresh(self, _now: datetime | None = None) -> None:
        """Read period energies from the long-term statistics."""
        now = dt_util.utcnow()
        recorder = get_instance(self.hass)
        energy: dict[str, dict[str, float | None]] = {}
        for source in self.energy_sources:
            entity_ids = self.entity_ids(source)
            energy[source] = {}
            for period in PERIODS:
                total: float | None = None
                for entity_id in entity_ids:
                    try:
                        result = await recorder.async_add_executor_job(
                            statistic_during_period,
                            self.hass,
                            period_start(period, now),
                            None,
                            entity_id,
                            {"change"},
                            {"energy": "kWh", "volume": "L"},
                        )
                    except Exception:  # noqa: BLE001 - statistics are best effort
                        _LOGGER.debug("No statistics for %s", entity_id, exc_info=True)
                        continue
                    change = result.get("change")
                    if change is not None:
                        total = (total or 0.0) + max(0.0, change)
                energy[source][period] = total
        self._energy = energy
        self._notify()

    def _total(self, source: str) -> float | None:
        """Current meter reading of a source in kWh (sum of its entities)."""
        total = None
        for entity_id in self.external.get(source, []):
            state = self.hass.states.get(entity_id)
            value = _float_state(state)
            if value is None:
                return None
            factor = _ENERGY_TO_KWH.get(state.attributes.get("unit_of_measurement", "kWh"))
            if factor is None:
                return None
            total = (total or 0.0) + value * factor
        return total

    def _delta(self, source: str, hours: float) -> float:
        """Plausible increase of a counter since the last tick (kWh)."""
        value = self._total(source)
        if value is None:
            return 0.0
        last = self._last_totals.get(source)
        self._last_totals[source] = value
        if last is None:
            return 0.0
        delta = value - last
        if delta < 0 or delta > MAX_PLAUSIBLE_KW * hours + 1.0:
            return 0.0  # reset or glitch: just take the new reading as base
        return delta

    def _add_cop_sample(self, now: datetime) -> None:
        heat, electric = self._total("hp_heat"), self._total("hp_electric")
        if heat is None or electric is None:
            return
        samples = self._cop_samples
        if samples and (heat < samples[-1][1] or electric < samples[-1][2]):
            samples.clear()  # counter reset
        samples.append((now, heat, electric))
        while samples and now - samples[0][0] > COP_WINDOW:
            samples.popleft()

    @callback
    def _on_tick(self) -> None:
        """Integrate runtime and heat pump factor on every poll."""
        now = dt_util.utcnow()
        hours = (now - self._last_tick).total_seconds() / 3600 if self._last_tick else 0.0
        valid = self._last_tick is not None and 0 < hours < 0.2
        self._last_tick = now
        data = self.coordinator.data or {}

        if valid and self.has_rod:
            power = self.rod_power(data)
            if power is not None and power > HEATING_ROD_ON_W:
                self._runtime.add({"seconds": hours * 3600}, now)

        if self.has_work_ratio:
            self._add_cop_sample(now)
            heat = self._delta("hp_heat", hours)
            electric = self._delta("hp_electric", hours)
            lift = self.lift()
            if valid and (heat > 0 or electric > 0) and lift is not None:
                values = {"heat": heat, "electric": electric, "heat_lift": heat * lift}
                target = self.cop_target()
                if target:
                    values["expected_electric"] = heat / target
                self._factor.add(values, now)

        self._store.async_delay_save(self._data, SAVE_DELAY)
        self._notify()

    def _notify(self) -> None:
        for update in list(self._listeners):
            update()

    def _data(self) -> dict[str, Any]:
        return {
            HEATING_ROD_RUNTIME: self._runtime.as_dict(),
            HP_FACTOR: self._factor.as_dict(),
        }

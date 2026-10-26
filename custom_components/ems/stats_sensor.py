"""Sensor entities for the calculated statistics."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import (
    PERCENTAGE,
    UnitOfEnergy,
    UnitOfTemperature,
    UnitOfTime,
    UnitOfVolume,
)
from homeassistant.helpers.device_registry import DeviceInfo

from .const import PERIODS
from .entity import ems_device_info
from .stats import (
    BATTERY_CHARGE,
    BATTERY_DISCHARGE,
    CONSUMPTION,
    GRID_EXPORT,
    GRID_IMPORT,
    HEATING_ROD,
    WATER,
    StatsManager,
)

_LABELS = {
    "de": {
        "pv": "PV-Erzeugung",
        "hp_heat": "Wärmepumpe Wärme",
        "hp_electric": "Wärmepumpe Strom",
        "hc1_heat": "Heizkreis 1 Wärme",
        "hc2_heat": "Heizkreis 2 Wärme",
        "stove_heat": "Ofen Wärme",
        HEATING_ROD: "Heizstab Energie",
        GRID_IMPORT: "Netzbezug",
        GRID_EXPORT: "Einspeisung",
        BATTERY_CHARGE: "Batterie Ladung",
        BATTERY_DISCHARGE: "Batterie Entladung",
        CONSUMPTION: "Gesamtverbrauch",
        WATER: "Wasserverbrauch",
        "charged": "Geladen",
        "energy": "Energie",
        "heat_total": "Wärmeerzeugung gesamt",
        "runtime": "Heizstab Laufzeit",
        "hp_starts": "Wärmepumpe Starts",
        "hp_runtime": "Wärmepumpe Laufzeit",
        "ww_starts": "Warmwasser Ladungen",
        "ww_runtime": "Warmwasser Ladezeit",
        "total": "gesamt",
        "tank_energy": "Puffer Energie",
        "tank_level": "Puffer Ladezustand",
        "tank_mean": "Puffer Mitteltemperatur",
        "cop": "Wärmepumpe COP aktuell",
        "lift": "Wärmepumpe Hub aktuell",
        "lift_avg": "Wärmepumpe Ø Hub",
        "factor": "Wärmepumpe Faktor",
        "factor_target": "Wärmepumpe Faktor Soll",
        "target_ratio": "Wärmepumpe Soll/Ist",
        "efficiency": "Wärmepumpe Gütegrad aktuell",
        "factor_now": "Wärmepumpe Faktor aktuell",
        "factor_target_now": "Wärmepumpe Faktor Soll aktuell",
        "target_ratio_now": "Wärmepumpe Soll/Ist aktuell",
        "cop_target": "Wärmepumpe COP Soll aktuell",
        "autarky": "Autarkie",
        "self_consumption": "Eigenverbrauchsquote",
        "day": "heute",
        "week": "diese Woche",
        "month": "dieser Monat",
        "year": "dieses Jahr",
        "ratio_day": "Tagesarbeitszahl",
        "ratio_week": "Wochenarbeitszahl",
        "ratio_month": "Monatsarbeitszahl",
        "ratio_year": "Jahresarbeitszahl",
    },
    "en": {
        "pv": "PV production",
        "hp_heat": "Heat pump heat",
        "hp_electric": "Heat pump electricity",
        "hc1_heat": "Heating circuit 1 heat",
        "hc2_heat": "Heating circuit 2 heat",
        "stove_heat": "Stove heat",
        HEATING_ROD: "Heating rod energy",
        GRID_IMPORT: "Grid import",
        GRID_EXPORT: "Grid export",
        BATTERY_CHARGE: "Battery charge",
        BATTERY_DISCHARGE: "Battery discharge",
        CONSUMPTION: "Total consumption",
        WATER: "Water consumption",
        "charged": "Charged",
        "energy": "Energy",
        "heat_total": "Heat generation total",
        "runtime": "Heating rod runtime",
        "hp_starts": "Heat pump starts",
        "hp_runtime": "Heat pump runtime",
        "ww_starts": "Hot water loads",
        "ww_runtime": "Hot water loading time",
        "total": "total",
        "tank_energy": "Buffer tank energy",
        "tank_level": "Buffer tank charge",
        "tank_mean": "Buffer tank mean temperature",
        "cop": "Heat pump COP current",
        "lift": "Heat pump lift current",
        "lift_avg": "Heat pump avg. lift",
        "factor": "Heat pump factor",
        "factor_target": "Heat pump target factor",
        "target_ratio": "Heat pump actual vs. target",
        "efficiency": "Heat pump Carnot efficiency current",
        "factor_now": "Heat pump factor current",
        "factor_target_now": "Heat pump target factor current",
        "target_ratio_now": "Heat pump actual vs. target current",
        "cop_target": "Heat pump target COP current",
        "autarky": "Self-sufficiency",
        "self_consumption": "Self-consumption rate",
        "day": "today",
        "week": "this week",
        "month": "this month",
        "year": "this year",
        "ratio_day": "Daily performance factor",
        "ratio_week": "Weekly performance factor",
        "ratio_month": "Monthly performance factor",
        "ratio_year": "Seasonal performance factor (year)",
    },
}

# Heat generators summed up in "heat_total". The heating rod turns
# electricity 1:1 into heat.
_HEAT_GENERATORS = ("hp_heat", "stove_heat", HEATING_ROD)


def stat_unique_id(entry_id: str, key: str) -> str:
    return f"{entry_id}_stat_{key}"


@dataclass(frozen=True, kw_only=True)
class StatDescription:
    key: str
    name: str
    value: Callable[[], float | None]
    unit: str | None = None
    device_class: SensorDeviceClass | None = None
    state_class: SensorStateClass | None = SensorStateClass.MEASUREMENT
    precision: int = 1
    icon: str | None = None
    # Car or consumer the value belongs to (its device).
    device: str | None = None


def build_descriptions(language: str, stats: StatsManager) -> list[StatDescription]:
    labels = _LABELS.get(language.split("-")[0], _LABELS["en"])
    result: list[StatDescription] = []

    def per_period(
        key: str,
        label: Callable[[str], str],
        fn: Callable[[str], float | None],
        **kwargs,
    ) -> None:
        for period in PERIODS:
            result.append(
                StatDescription(
                    key=f"{key}_{period}",
                    name=label(period),
                    value=lambda p=period: fn(p),
                    **kwargs,
                )
            )

    energy_kwargs = {
        "unit": UnitOfEnergy.KILO_WATT_HOUR,
        "device_class": SensorDeviceClass.ENERGY,
        "state_class": SensorStateClass.TOTAL_INCREASING,
    }
    water_kwargs = {
        "unit": UnitOfVolume.LITERS,
        "device_class": SensorDeviceClass.WATER,
        "state_class": SensorStateClass.TOTAL_INCREASING,
        "precision": 0,
        "icon": "mdi:water",
    }
    for source in stats.energy_sources:
        device = source if source in stats.devices else None
        if device:
            # Named by its device, e.g. "Pool Energie heute".
            label = labels["charged"] if source in stats.cars else labels["energy"]
        else:
            label = labels.get(source, source)
        per_period(
            source,
            lambda p, s=label: f"{s} {labels[p]}",
            lambda p, s=source: stats.energy(s, p),
            device=device,
            **(water_kwargs if source == WATER else energy_kwargs),
        )

    generators = [s for s in _HEAT_GENERATORS if s in stats.energy_sources]
    if len(generators) >= 2:

        def heat_total(period: str) -> float | None:
            values = [stats.energy(s, period) for s in generators]
            return sum(v for v in values if v is not None)

        per_period(
            "heat_total",
            lambda p: f"{labels['heat_total']} {labels[p]}",
            heat_total,
            **energy_kwargs,
        )

    if stats.has_work_ratio:
        per_period(
            "work_ratio",
            lambda p: labels[f"ratio_{p}"],
            stats.work_ratio,
            precision=2,
            icon="mdi:heat-pump",
        )
    def current(
        key: str, fn: Callable[[], float | None], name: str | None = None, **kwargs
    ) -> None:
        result.append(StatDescription(key=key, name=name or labels[key], value=fn, **kwargs))

    temp_kwargs = {"unit": UnitOfTemperature.KELVIN, "precision": 1}
    if stats.has_cop:
        current("cop", stats.cop, precision=2, icon="mdi:heat-pump-outline")
    if stats.has_lift:
        current("lift", stats.lift, icon="mdi:thermometer-chevron-up", **temp_kwargs)
    if stats.has_cop and stats.has_lift:
        current("factor_now", stats.factor, precision=0, icon="mdi:speedometer")
        current("efficiency", stats.efficiency, unit=PERCENTAGE, precision=0, icon="mdi:gauge")
    if stats.has_target and stats.has_lift:
        current("cop_target", stats.cop_target, precision=2, icon="mdi:file-document-outline")
        current("factor_target_now", stats.factor_target, precision=0, icon="mdi:speedometer-medium")
        if stats.has_cop:
            current("target_ratio_now", stats.target_ratio, unit=PERCENTAGE, precision=0, icon="mdi:scale-balance")

    if stats.has_factor:
        per_period(
            "lift",
            lambda p: f"{labels['lift_avg']} {labels[p]}",
            stats.period_lift,
            icon="mdi:thermometer-chevron-up",
            **temp_kwargs,
        )
        per_period(
            "factor",
            lambda p: f"{labels['factor']} {labels[p]}",
            stats.period_factor,
            precision=0,
            icon="mdi:speedometer",
        )
        if stats.has_target:
            per_period(
                "factor_target",
                lambda p: f"{labels['factor_target']} {labels[p]}",
                stats.period_factor_target,
                precision=0,
                icon="mdi:speedometer-medium",
            )
            per_period(
                "target_ratio",
                lambda p: f"{labels['target_ratio']} {labels[p]}",
                stats.period_target_ratio,
                unit=PERCENTAGE,
                precision=0,
                icon="mdi:scale-balance",
            )

    # Starts and running time: per period, plus all time counters whose
    # long-term statistics give any past period.
    for phase, has_signal in (("hp", stats.has_hp_signal), ("ww", stats.has_ww_signal)):
        if not has_signal:
            continue
        per_period(
            f"{phase}_starts",
            lambda p, k=phase: f"{labels[f'{k}_starts']} {labels[p]}",
            lambda p, k=phase: stats.starts(k, p),
            state_class=SensorStateClass.TOTAL_INCREASING,
            precision=0,
            icon="mdi:counter",
        )
        per_period(
            f"{phase}_runtime",
            lambda p, k=phase: f"{labels[f'{k}_runtime']} {labels[p]}",
            lambda p, k=phase: stats.run_hours(k, p),
            unit=UnitOfTime.HOURS,
            device_class=SensorDeviceClass.DURATION,
            state_class=SensorStateClass.TOTAL_INCREASING,
            precision=1,
        )
        current(
            f"{phase}_starts_total",
            lambda k=phase: stats.total_starts(k),
            name=f"{labels[f'{phase}_starts']} {labels['total']}",
            state_class=SensorStateClass.TOTAL_INCREASING,
            precision=0,
            icon="mdi:counter",
        )
        current(
            f"{phase}_runtime_total",
            lambda k=phase: stats.total_hours(k),
            name=f"{labels[f'{phase}_runtime']} {labels['total']}",
            unit=UnitOfTime.HOURS,
            device_class=SensorDeviceClass.DURATION,
            state_class=SensorStateClass.TOTAL_INCREASING,
            precision=1,
        )

    if stats.tank_sensors or stats.tank_items:
        current("tank_mean", stats.tank_mean_temp, unit=UnitOfTemperature.CELSIUS,
                device_class=SensorDeviceClass.TEMPERATURE, precision=1)
        current("tank_level", stats.tank_level, unit=PERCENTAGE, precision=0, icon="mdi:storage-tank")
        if stats.has_tank:
            current("tank_energy", stats.tank_energy, unit=UnitOfEnergy.KILO_WATT_HOUR,
                    device_class=SensorDeviceClass.ENERGY_STORAGE, precision=1)

    if stats.has_rod:
        per_period(
            "heating_rod_runtime",
            lambda p: f"{labels['runtime']} {labels[p]}",
            stats.runtime_hours,
            unit=UnitOfTime.HOURS,
            device_class=SensorDeviceClass.DURATION,
            state_class=SensorStateClass.TOTAL_INCREASING,
        )

    sources = stats.energy_sources
    if GRID_IMPORT in sources and CONSUMPTION in sources:
        per_period(
            "autarky",
            lambda p: f"{labels['autarky']} {labels[p]}",
            stats.autarky,
            unit=PERCENTAGE,
            precision=0,
            icon="mdi:home-lightning-bolt",
        )
    if "pv" in sources and GRID_EXPORT in sources:
        per_period(
            "self_consumption",
            lambda p: f"{labels['self_consumption']} {labels[p]}",
            stats.self_consumption,
            unit=PERCENTAGE,
            precision=0,
            icon="mdi:solar-power-variant",
        )
    return result


class EmsStatSensor(SensorEntity):
    """A calculated statistic."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(
        self,
        stats: StatsManager,
        entry_id: str,
        description: StatDescription,
    ) -> None:
        self._stats = stats
        self._description = description
        self._attr_unique_id = stat_unique_id(entry_id, description.key)
        self._attr_name = description.name
        self._attr_native_unit_of_measurement = description.unit
        self._attr_device_class = description.device_class
        self._attr_state_class = description.state_class
        self._attr_suggested_display_precision = description.precision
        self._attr_icon = description.icon
        # Values of a car or consumer belong to its own device.
        device = description.device
        self._attr_device_info: DeviceInfo = (
            ems_device_info(entry_id, device, stats.names[device])
            if device
            else ems_device_info(entry_id, "statistics", "EMS Statistik")
        )

    @property
    def native_value(self) -> float | None:
        return self._description.value()

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._stats.async_add_listener(self.async_write_ha_state))

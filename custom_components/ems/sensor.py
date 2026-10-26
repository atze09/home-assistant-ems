"""Sensors: Rennergy items and the statistics of the EMS."""

from __future__ import annotations

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import (
    PERCENTAGE,
    UnitOfElectricCurrent,
    UnitOfElectricPotential,
    UnitOfEnergy,
    UnitOfFrequency,
    UnitOfPower,
    UnitOfTemperature,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .coordinator import EmsConfigEntry, RennergyCoordinator
from .discovery import Item, normalize_name
from .entity import (
    ROLE_LAST_30_DAYS,
    ROLE_TODAY,
    ROLE_VALUE,
    ROLE_YEAR,
    RennergyEntity,
    entity_specs,
)
from .stats_sensor import EmsStatSensor, build_descriptions

# Device unit -> (HA unit, device class, display precision)
_UNITS: dict[str, tuple[str | None, SensorDeviceClass | None, int]] = {
    "W": (UnitOfPower.WATT, SensorDeviceClass.POWER, 0),
    "kW": (UnitOfPower.KILO_WATT, SensorDeviceClass.POWER, 2),
    "Wh": (UnitOfEnergy.WATT_HOUR, SensorDeviceClass.ENERGY, 0),
    "kWh": (UnitOfEnergy.KILO_WATT_HOUR, SensorDeviceClass.ENERGY, 1),
    "°C": (UnitOfTemperature.CELSIUS, SensorDeviceClass.TEMPERATURE, 1),
    "%": (PERCENTAGE, None, 0),
    "A": (UnitOfElectricCurrent.AMPERE, SensorDeviceClass.CURRENT, 1),
    "V": (UnitOfElectricPotential.VOLT, SensorDeviceClass.VOLTAGE, 1),
    "Hz": (UnitOfFrequency.HERTZ, SensorDeviceClass.FREQUENCY, 2),
}

_METER_ROLE_INDEX = {ROLE_VALUE: 0, ROLE_TODAY: 1, ROLE_LAST_30_DAYS: 2, ROLE_YEAR: 3}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: EmsConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    data = entry.runtime_data
    entities: list[SensorEntity] = []
    if (hub := data.rennergy) is not None:
        for item in hub.items:
            for platform, role in entity_specs(item):
                if platform != "sensor":
                    continue
                if item.is_meter and role != ROLE_VALUE:
                    entities.append(RennergyMeterEnergySensor(hub.coordinator, item, role))
                else:
                    entities.append(RennergyValueSensor(hub.coordinator, item))

    entities.extend(
        EmsStatSensor(data.stats, entry.entry_id, description)
        for description in build_descriptions(hass.config.language, data.stats)
    )
    async_add_entities(entities)


class RennergyValueSensor(RennergyEntity, SensorEntity):
    """Current value of a meter, sensor or regulation."""

    def __init__(self, coordinator: RennergyCoordinator, item: Item) -> None:
        super().__init__(coordinator, item)
        unit, device_class, precision = _UNITS.get(item.unit, (None, None, 1))
        if item.unit and unit is None:
            unit = item.unit
        if unit == PERCENTAGE and "ladezustand" in normalize_name(item.name):
            device_class = SensorDeviceClass.BATTERY
        if device_class == SensorDeviceClass.ENERGY:
            # Current value of an energy item is a rate, never a counter.
            device_class = None
        if not item.unit and item.unit_type == "NoUnit":
            precision = 0
        self._attr_native_unit_of_measurement = unit
        self._attr_device_class = device_class
        self._attr_state_class = SensorStateClass.MEASUREMENT
        self._attr_suggested_display_precision = precision

    @property
    def native_value(self) -> float | None:
        values = self.values
        return values[0] if values else None


class RennergyMeterEnergySensor(RennergyEntity, SensorEntity):
    """Energy counters (today, last 30 days, year) of a meter in Wh."""

    _attr_device_class = SensorDeviceClass.ENERGY
    _attr_native_unit_of_measurement = UnitOfEnergy.WATT_HOUR
    _attr_suggested_unit_of_measurement = UnitOfEnergy.KILO_WATT_HOUR
    _attr_suggested_display_precision = 1

    def __init__(
        self, coordinator: RennergyCoordinator, item: Item, role: str
    ) -> None:
        super().__init__(coordinator, item, role)
        self._index = _METER_ROLE_INDEX[role]
        if role == ROLE_LAST_30_DAYS:
            # Rolling window, can go down: no statistics, hidden by default.
            self._attr_state_class = None
            self._attr_entity_registry_enabled_default = False
        else:
            # Daily / yearly counters reset to zero, which total_increasing handles.
            self._attr_state_class = SensorStateClass.TOTAL_INCREASING

    @property
    def native_value(self) -> float | None:
        values = self.values
        if not values or len(values) <= self._index:
            return None
        return values[self._index]

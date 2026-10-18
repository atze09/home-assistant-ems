# Rennergy EMS für Home Assistant

Eigene Home-Assistant-Integration für das Rennergy Energiemanagement (smart1-Steuerung) mit
Wärmepumpe, Heizstab, Pufferspeicher, Heizkreisen, PV, Batterie und Wallbox. Die Verbindung
läuft lokal über Modbus TCP.

## Funktionen (v0.1)

- **Einrichtung über die Oberfläche:** IP-Adresse eingeben, danach die gewünschten Bereiche
  auswählen (Energie, Batterie, Wärmepumpe, Heizstab, Puffer, Warmwasser, Heizkreise, Kessel,
  E-Auto, System). Die Bereiche lassen sich später in den Optionen ändern.
- **Automatische Erkennung:** Die Steuerung beschreibt jedes Element selbst (Name, Einheit, Typ).
  Alle Zähler, Sensoren und Regelungen werden ohne YAML angelegt.
- **Zähler:** aktuelle Leistung sowie Energie heute, der letzten 30 Tage und des laufenden Jahres.
  Die Werte heute und Jahr sind fürs Energie-Dashboard geeignet.
- **Steuern:** Hand-Schalter werden zu `switch`, Hand-Schieberegler zu `number`. Für beide gibt
  es eine Auswahl Automatik/Hand.
- **Seitenleiste „Rennergy“:** Energiefluss, Heizung und Speicher, Statistik, Steuerung und alle Werte.
- Pro Bereich ein eigenes Gerät, alle unter dem Hauptgerät „Rennergy EMS“.

## Statistiken (v0.2)

In den Integrationseinstellungen unter **Zähler** lassen sich vorhandene HA-Sensoren zuordnen:
PV (z. B. Victron), Wärmemengenzähler der Wärmepumpe, Stromzähler der Wärmepumpe,
Wärmemengenzähler für Heizkreis 1 und 2 sowie für den Ofen mit Wassertasche.

Daraus berechnet die Integration jeweils für **heute, diese Woche, diesen Monat und dieses Jahr**:
- Energie je Zähler sowie Wärmeerzeugung gesamt (Wärmepumpe + Ofen + Heizstab)
- **Tages-, Wochen-, Monats- und Jahresarbeitszahl** der Wärmepumpe und den **COP aktuell**.
  Den COP gibt es mit Leistungssensoren sofort, sonst als Mittel der letzten 15 Minuten.
- **Heizstab:** Energie, Laufzeit und durchschnittliche Leistung
- **Autarkie** und **Eigenverbrauchsquote**

Die Statistiken zählen ab der Einrichtung und bleiben über Neustarts erhalten.

## Aktionen

- **Warmwasser Schnellladung** (Knopf): setzt das Element „Schnelladung“ für die eingestellte
  Dauer (Standard 60 min) auf Hand/Ein und danach automatisch zurück auf Automatik. Element und
  Dauer lassen sich unter **Aktionen** ändern.
- **Alles auf Automatik** (Knopf): gibt alle Hand-Eingriffe an die Regelung zurück.

## Installation

### HACS (benutzerdefiniertes Repository)
1. HACS → ⋮ → *Benutzerdefinierte Repositories* → `https://github.com/atze09/home-assistant-rennergy`, Typ *Integration*.
2. „Rennergy EMS“ installieren und Home Assistant neu starten.

### Manuell
Den Ordner `custom_components/rennergy` in das `config/custom_components/` deiner
Home-Assistant-Installation kopieren und Home Assistant neu starten.

Danach: *Einstellungen → Geräte & Dienste → Integration hinzufügen → Rennergy EMS*.

## Voraussetzungen in der Steuerung

In der smart1-Konfiguration muss unter *System → Modbus Configuration* Modbus eingeschaltet sein.
Außerdem muss das Mapping mit **Auto Address** geladen sein (Standard-Startregister 20000).

## Hinweise

- Schalten oder Verstellen setzt das Element in der Steuerung auf **Hand**. Über die Auswahl
  „… Modus“ → *Automatik* übernimmt wieder die Regelung. Die Steuerung meldet den Modus nicht
  zurück, deshalb zeigt Home Assistant den zuletzt gesetzten Modus an.
- Interne Rechenwerte der Regelung (Flags, °K-Werte, Faktoren) werden als Diagnose-Entitäten angelegt.

## Werkzeuge

`tools/scan.ps1` listet alle Elemente einer Steuerung (nur lesend):

```powershell
.\tools\scan.ps1 -Ip 192.168.x.x
```

## Unterlagen

- `CCGX-Modbus-TCP-register-list-2.90.xlsx`: Victron-GX-Registerliste
- Die Protokollbeschreibung der smart1-Steuerung ist vertraulich und deshalb nicht im Repository.

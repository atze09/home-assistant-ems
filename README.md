# Rennergy EMS für Home Assistant

Eigene Home-Assistant-Integration für das Rennergy Energiemanagement (smart1-Steuerung) mit
Wärmepumpe, Heizstab, Pufferspeicher, Heizkreisen, PV, Batterie und Wallbox. Die Verbindung
läuft lokal über Modbus TCP.

## Funktionen

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

## Statistiken

In den Integrationseinstellungen unter **Zähler** lassen sich vorhandene HA-Sensoren zuordnen.
Bitte jeweils die **durchlaufenden Gesamtzähler** wählen:
- PV, auch mehrere Anlagen, die summiert werden
- Wärmemengenzähler der Wärmepumpe, Stromzähler der Wärmepumpe
- Wärmemengenzähler für Heizkreis 1 und 2 sowie für den Ofen mit Wassertasche

Daraus berechnet die Integration jeweils für **heute, diese Woche, diesen Monat und dieses Jahr**:
- Energie je Zähler sowie Wärmeerzeugung gesamt (Wärmepumpe + Ofen + Heizstab)
- **Tages-, Wochen-, Monats- und Jahresarbeitszahl** der Wärmepumpe
- **Heizstab:** Energie, Laufzeit und durchschnittliche Leistung
- **Autarkie** und **Eigenverbrauchsquote**

Die Energiewerte stammen aus der **Langzeitstatistik von Home Assistant**. Sie stimmen also sofort,
auch rückwirkend für den laufenden Monat und das laufende Jahr.

### Wärmepumpe: Faktor, Soll-Werte, Gütegrad

Unter **Wärmepumpe** in den Einstellungen:
- **Faktor = Arbeitszahl × Hub**, wobei Hub = Vorlauf der WP − Außentemperatur. Den Faktor gibt es
  aktuell und als Mittel für Tag, Woche, Monat und Jahr.
- **Datenblatt-Werte** (z. B. `A2/W35 = 3,8`, ein Punkt pro Zeile). Daraus berechnet die
  Integration für die aktuelle Außen- und Vorlauftemperatur **COP Soll**, **Faktor Soll** und
  **Soll/Ist in %**.
- **Gütegrad**: COP im Verhältnis zum idealen Carnot-COP. Den Wert gibt es auch ohne Datenblatt.

## Anlagenschema

Die Übersichtsseite im Panel zeigt die Anlage als Schema:
- Heizkreise, Heizstab, Kamin und Wärmepumpe mit Speicher
- Vor- und Rücklauf an den Rohren, die animiert „fließen“, solange ein Kreis aktiv ist
- Speicher mit Farbverlauf nach Temperatur
- Stellung des Umschaltventils Warmwasser/Heizung

Die Sensoren dafür werden unter **Anlagenschema** in den Einstellungen gewählt.

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

## Updates

Neue Versionen erscheinen als [Release](https://github.com/atze09/home-assistant-rennergy/releases).
HACS zeigt sie als Update an. Nach dem Aktualisieren Home Assistant neu starten.

## Lizenz

[MIT](LICENSE)

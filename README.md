# EMS für Home Assistant (Rennergy smart1)

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
- **Seitenleiste „EMS“:** Übersicht, Statistik, Heizung, Steuerung und alle Werte (siehe unten).
- Pro Bereich ein eigenes Gerät, alle unter dem Hauptgerät „EMS“.

## Seitenleiste

- **Zeiträume:** Tag, Woche, Monat oder Jahr, mit ‹ › auch vergangene Zeiträume und „Jetzt“
  zurück zum laufenden. Übersicht und Statistik sehen in jedem Zeitraum gleich aus. Die Werte
  vergangener Zeiträume kommen aus der Langzeitstatistik von Home Assistant.
- **Übersicht:** Tachos für Autarkie, Eigenverbrauch, Arbeitszahl und Arbeitszahl inkl.
  Heizstab, im laufenden Zeitraum jeweils mit dem Wert von jetzt (bei der Arbeitszahl der
  COP aktuell). Energie des Zeitraums, **Energiefluss elektrisch** (PV, Netz,
  Batterie → Haus → Wärmepumpe, Heizstab, E-Autos, eigene Verbraucher) und **Energiefluss
  thermisch** (Wärmepumpe, Ofen, Heizstab → Puffer → Heizkreise, Warmwasser). Batterie und
  E-Autos zeigen den Ladezustand (Autos auch die Reichweite), die Wärmepumpe den COP, Pool und
  Whirlpool ihre Temperatur. Darunter Anlagenschema,
  E-Autos und Live-Werte inkl. Wasserdurchfluss.
- **Statistik:** Verlauf als Balkendiagramm (Strom mit PV-Anlagen einzeln, Wärmepumpe mit
  Heizstab und Arbeitszahl je Tag, Wärmeerzeugung, E-Autos, Verbraucher, Wasser), Filter für
  PV-Anlagen und E-Autos, Arbeitszahl inkl. Heizstab.
- **Heizung:** Heizkreisregler, Heizkreise, Speicher mit Heizstab-Temperatur und die Aktionen.

## Statistiken

In den Integrationseinstellungen unter **Zähler** lassen sich vorhandene HA-Sensoren zuordnen.
Bitte bei Energie jeweils die **durchlaufenden Gesamtzähler** wählen:
- **PV:** mehrere Anlagen möglich (Mehrfachauswahl). Sie werden summiert und in der Statistik
  auch einzeln gezeigt.
- **Heizstab:** Energie und Leistung, falls die Rennergy sie nicht liefert.
- **Wasser:** Wasserzähler (Gesamtzähler, Statistik in Litern) und aktueller Durchfluss.
- **Netz, Batterie, Haus:** Energie und Leistung. Gesetzte Sensoren ersetzen die Werte der
  Rennergy. Vorzeichen: Netz + Bezug / − Einspeisung, Batterie + Laden / − Entladen.
- Wärmemengenzähler der Wärmepumpe, Stromzähler der Wärmepumpe
- Wärmemengenzähler für Heizkreis 1 und 2 sowie für den Ofen mit Wassertasche

Unter **E-Autos** lassen sich bis zu drei Autos (Name, Ladezustand, Ladeleistung, geladene
Energie, Reichweite) und unter **Verbraucher** bis zu sechs weitere Verbraucher (Name,
Leistung, Energie, Temperatur, Symbol), z. B. Pool oder Whirlpool, eintragen. Die
Heizstab-Temperatur für den Speicher lässt sich unter **Anlagenschema → Speicher** wählen.

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
- **COP aktuell** wird aus den Zählern (Wärmemenge / Strom) der letzten 30 Minuten berechnet,
  passend zu den Arbeitszahlen. Nur ohne Zähler wird die Leistung verwendet. Steht die
  Wärmepumpe, zeigt der COP „–“ statt 0.
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
- **Heizstab-Boost** (Knopf): setzt den Heizstab (Standard: „Heizstab 0-100“) für die
  eingestellte Dauer auf die eingestellte Leistung (Standard 60 min, 100 %) und danach zurück
  auf Automatik.
- **Alles auf Automatik** (Knopf): gibt alle Hand-Eingriffe an die Regelung zurück.

### Services für Automationen

```yaml
# Heizstab für 30 Minuten auf 50 %
action: ems.set_manual
data:
  entity_id: number.ems_heizstab_heizstab_0_100
  value: 50
  duration: 30

# zurück auf Automatik
action: ems.set_auto
data:
  entity_id: number.ems_heizstab_heizstab_0_100
```

`set_manual` nimmt EMS-Schalter, -Schieberegler oder deren Modus-Auswahl. Bei Schaltern
ist der Wert optional (Standard: ein). Ohne `duration` bleibt das Element auf Hand.

## Installation

### HACS (benutzerdefiniertes Repository)
1. HACS → ⋮ → *Benutzerdefinierte Repositories* → `https://github.com/atze09/home-assistant-rennergy`, Typ *Integration*.
2. „EMS“ installieren und Home Assistant neu starten.

### Manuell
Den Ordner `custom_components/ems` in das `config/custom_components/` deiner
Home-Assistant-Installation kopieren und Home Assistant neu starten.

Danach: *Einstellungen → Geräte & Dienste → Integration hinzufügen → EMS*.

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

### Umstieg von Version 0.3 („Rennergy EMS“, Kennung `rennergy`)

Ab 0.4 heißt die Integration **EMS** mit der Kennung `ems`. Home Assistant sieht sie als neue
Integration:
1. Die alte Integration „Rennergy EMS“ unter *Geräte & Dienste* löschen und den Ordner
   `custom_components/rennergy` entfernen (bzw. in HACS deinstallieren).
2. Die neue Version installieren, Home Assistant neu starten und „EMS“ neu einrichten.
3. Entitäts-IDs beginnen jetzt mit `ems_`, Services heißen `ems.set_manual` / `ems.set_auto`.
   Automationen und Dashboards entsprechend anpassen. Die Langzeitstatistik der alten
   Entitäten wird nicht übernommen. Die Werte externer Zähler bleiben aber erhalten, weil sie
   aus deren eigener Statistik kommen.

## Updates

Neue Versionen erscheinen als [Release](https://github.com/atze09/home-assistant-rennergy/releases).
HACS zeigt sie als Update an. Nach dem Aktualisieren Home Assistant neu starten.

## Lizenz

[MIT](LICENSE)

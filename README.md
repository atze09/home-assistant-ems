# EMS für Home Assistant

Energiemanagement für Home Assistant: Energiefluss, Statistiken, Arbeitszahlen und Kennzahlen
für PV, Netz, Batterie, Wärmepumpe, Heizstab, E-Autos und eigene Verbraucher. Das EMS braucht
keine bestimmte Hardware, es arbeitet mit vorhandenen Home-Assistant-Entitäten.

Optional lässt sich eine **Rennergy smart1** Steuerung lokal per Modbus TCP verbinden. Sie
liefert Puffer, Heizkreise, Heizstab und Warmwasser und ermöglicht das Steuern.

## Seitenleiste „EMS“

- **Übersicht:** ganz oben **Energiefluss elektrisch** (PV, Netz, Batterie → Haus →
  Wärmepumpe, Heizstab, E-Autos, eigene Verbraucher) und **thermisch** (Wärmepumpe, Ofen,
  Heizstab → Puffer → Heizkreise, Warmwasser). Batterie und Autos zeigen den Ladezustand
  (Autos auch die Reichweite), die Wärmepumpe den COP, Pool und Whirlpool ihre Temperatur.
  Darunter Tachos für Autarkie, Eigenverbrauch, Arbeitszahl und Arbeitszahl inkl. Heizstab
  (im laufenden Zeitraum mit dem Wert von jetzt), Energie des Zeitraums, Anlagenschema,
  E-Autos und Live-Werte.
- **Statistik:** dieselben Tachos, Verlauf als Balkendiagramm (Strom mit PV-Anlagen einzeln,
  Wärmepumpe mit Heizstab und Arbeitszahl je Tag, Wärmeerzeugung, E-Autos, Verbraucher,
  Wasser), Filter für PV-Anlagen und E-Autos.
- **Zeiträume:** Tag, Woche, Monat, Jahr; mit ‹ › auch vergangene Zeiträume, „Jetzt“ springt
  zurück. Werte vergangener Zeiträume kommen aus der Langzeitstatistik von Home Assistant.
- **Heizung, Steuerung, Alle Werte:** nur mit verbundener Rennergy.
- **Einstellungen** (nur für Administratoren): alles zuordnen, siehe unten.

## Einstellungen

Alle Zuordnungen passieren im Panel unter **EMS → Einstellungen**:

- **Rennergy smart1:** IP-Adresse, Verbindung testen, Bereiche wählen, oder wieder entfernen.
- **PV-Anlagen:** beliebig viele, je Anlage Name, Leistung und Gesamtzähler.
- **Netz, Batterie, Haus:** Gesamtzähler (Energie) und Leistung, Ladezustand der Batterie.
  Für die Leistung von Netz und Batterie gibt es „Vorzeichen umkehren“. Die Vorschau zeigt,
  wie der aktuelle Wert verstanden wird, z. B. „jetzt −850 W → wird als Einspeisung gezeigt“.
- **E-Autos:** beliebig viele, mit Ladezustand, Ladeleistung, geladener Energie, Reichweite.
- **Verbraucher:** z. B. Pool, Whirlpool, Sauna, mit Leistung, Energie, Temperatur und Symbol.
- **Wärmepumpe:** Wärmemenge, Strom, Leistungen, Vor-/Rücklauf, Außentemperatur, Datenblatt.
- **Heizstab, Heizkreise und Ofen, Speicher, Wasser** sowie die **Aktionen** der Rennergy.

Jedes Feld zeigt live den aktuellen Wert und warnt bei Auffälligkeiten, z. B. falsche Einheit
oder ein Tageszähler statt eines Gesamtzählers. Leere Felder nehmen, wo möglich, den Wert der
Rennergy. Nach dem Speichern lädt das EMS kurz neu.

**Geräte:** Jedes E-Auto und jeder Verbraucher wird ein eigenes Gerät (z. B. „Pool“) mit seiner
Energie heute, diese Woche, diesen Monat und dieses Jahr. Gelöschte Autos und Verbraucher
verschwinden auch als Gerät.

## Statistiken

Für **heute, diese Woche, diesen Monat und dieses Jahr** legt das EMS Sensoren an:
- Energie je Zähler sowie Wärmeerzeugung gesamt (Wärmepumpe + Ofen + Heizstab)
- **Tages-, Wochen-, Monats- und Jahresarbeitszahl** der Wärmepumpe
- **Heizstab:** Energie, Laufzeit und durchschnittliche Leistung
- **Autarkie** und **Eigenverbrauchsquote**, **Wasserverbrauch** in Litern

Die Energiewerte stammen aus der **Langzeitstatistik von Home Assistant** und stimmen sofort,
auch rückwirkend.

### Wärmepumpe: COP, Faktor, Soll-Werte, Gütegrad

- **COP aktuell** aus den Zählern (Wärmemenge / Strom) der letzten 30 Minuten, passend zu den
  Arbeitszahlen. Steht die Wärmepumpe, zeigt er „–“ statt 0.
- **Faktor = Arbeitszahl × Hub** (Hub = Vorlauf − Außentemperatur), aktuell und als Mittel.
- **Datenblatt-Werte** (z. B. `A2/W35 = 3,8`, ein Punkt pro Zeile) ergeben **COP Soll**,
  **Faktor Soll** und **Soll/Ist in %**.
- **Gütegrad:** COP im Verhältnis zum idealen Carnot-COP.

## Rennergy smart1

- **Automatische Erkennung:** Die Steuerung beschreibt jedes Element selbst. Zähler, Sensoren,
  Hand-Schalter (`switch`) und Hand-Schieberegler (`number`) mit Auswahl Automatik/Hand werden
  ohne YAML angelegt, pro Bereich ein Gerät unter „Rennergy smart1“.
- **Warmwasser Schnellladung** und **Heizstab-Boost** (Knöpfe): Hand für die eingestellte
  Dauer, danach automatisch zurück auf Automatik (übersteht Neustarts).
- **Alles auf Automatik** (Knopf): gibt alle Hand-Eingriffe an die Regelung zurück.
- Ist die Rennergy nicht erreichbar, läuft das EMS ohne Heizungswerte weiter und versucht es
  alle 2 Minuten erneut.

Voraussetzung: In der smart1-Konfiguration unter *System → Modbus Configuration* Modbus
einschalten und das Mapping mit **Auto Address** laden (Standard-Startregister 20000).

### Services für Automationen

```yaml
# Heizstab für 30 Minuten auf 50 %
action: ems.set_manual
data:
  entity_id: number.rennergy_heizstab_heizstab_0_100
  value: 50
  duration: 30

# zurück auf Automatik
action: ems.set_auto
data:
  entity_id: number.rennergy_heizstab_heizstab_0_100
```

`set_manual` nimmt Rennergy-Schalter, -Schieberegler oder deren Modus-Auswahl. Bei Schaltern
ist der Wert optional (Standard: ein). Ohne `duration` bleibt das Element auf Hand. Die
Entitäts-IDs oben sind Beispiele.

### Hinweise

- Schalten oder Verstellen setzt das Element in der Steuerung auf **Hand**. Über „… Modus“ →
  *Automatik* übernimmt wieder die Regelung. Die Steuerung meldet den Modus nicht zurück,
  deshalb zeigt Home Assistant den zuletzt gesetzten Modus an.
- Interne Rechenwerte der Regelung (Flags, °K-Werte, Faktoren) sind Diagnose-Entitäten.
- `tools/scan.ps1 -Ip 192.168.x.x` listet alle Elemente einer Steuerung (nur lesend).

## Installation

### HACS (benutzerdefiniertes Repository)
1. HACS → ⋮ → *Benutzerdefinierte Repositories* → `https://github.com/atze09/home-assistant-rennergy`, Typ *Integration*.
2. „EMS“ installieren und Home Assistant neu starten.

### Manuell
Den Ordner `custom_components/ems` nach `config/custom_components/` kopieren und Home
Assistant neu starten.

Danach *Einstellungen → Geräte & Dienste → Integration hinzufügen → EMS*. Die IP-Adresse der
Rennergy ist optional. Alles Weitere in der Seitenleiste unter **EMS → Einstellungen**.

### Umstieg von älteren Versionen

Version 0.5 richtet sich neu ein (neue Kennung `ems`, neue Einstellungen im Panel):
1. Eine vorhandene Integration „Rennergy EMS“ (0.3) oder „EMS“ (0.4) unter *Geräte & Dienste*
   löschen und deren Ordner `custom_components/rennergy` bzw. alten Stand entfernen.
2. Version 0.5 installieren, Home Assistant neu starten, „EMS“ hinzufügen.
3. In **EMS → Einstellungen** alles zuordnen. Automationen und Dashboards an die neuen
   Entitäts-IDs und Services (`ems.set_manual`, `ems.set_auto`) anpassen. Die Historie externer
   Zähler bleibt erhalten, weil sie aus deren eigener Statistik kommt.

## Updates

Neue Versionen erscheinen als [Release](https://github.com/atze09/home-assistant-rennergy/releases).
HACS zeigt sie als Update an. Nach dem Aktualisieren Home Assistant neu starten.

## Lizenz

[MIT](LICENSE)

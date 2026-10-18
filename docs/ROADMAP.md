# Roadmap und Konzept

## Stufe 1: Anzeigen und Steuern (v0.1, umgesetzt)
- Einrichtung per IP-Adresse, Bereiche wählbar, automatische Erkennung aller Elemente
- Sensoren, Zähler, Hand-Schalter, Hand-Schieberegler, Auswahl Automatik/Hand
- Seitenleisten-Panel: Energiefluss, Heizung/Speicher, Steuerung, alle Werte

## Stufe 2: Komfortfunktionen und Statistiken (v0.2, teilweise umgesetzt)

Umgesetzt:
- Externe Zähler in den Optionen: PV (Victron), Wärmepumpe (Wärme und Strom), HK1, HK2, Ofen
- Energie je Zeitraum, Wärmeerzeugung gesamt, Tages-/Wochen-/Monats-/Jahresarbeitszahl, COP aktuell
- Heizstab: Energie, Laufzeit, Ø Leistung; Autarkie, Eigenverbrauchsquote
- Knöpfe „Warmwasser Schnellladung“ (mit Timer) und „Alles auf Automatik“
- Statistik-Seite im Panel

Noch offen: Heizstab-Boost, Puffer-Energie, WP-Takte, Ersparnis €, Diagramme über die Zeit,
Übernahme der Historie aus den Langzeitstatistiken von HA.

### Aktionen auf Knopfdruck (Buttons und Services)
- **Warmwasser jetzt laden:** setzt das passende Regelungselement für eine einstellbare Dauer auf
  Hand und gibt danach automatisch an die Automatik zurück (Timer läuft in HA und übersteht
  Neustarts). Welches Element das auslöst, muss noch bestimmt werden. Kandidaten:
  `WW Schnelladung Wärmepumpe` (30600), `Schnelladung 10h` (34400), `WP 0/1` (30200).
- **Heizstab-Boost** für X Minuten mit Y %
- **Alles auf Automatik:** gibt alle Hand-Eingriffe wieder an die Regelung zurück
- Services `rennergy.set_manual` / `rennergy.set_auto` mit Dauer, für eigene Automationen

### Berechnete Werte (eigene Sensoren der Integration)
| Wert | Berechnung | Quelle |
|---|---|---|
| COP aktuell | Wärmeleistung / elektrische Leistung WP | **externe Sensoren nötig** |
| Arbeitszahl Tag/Woche/Monat/Jahr | Σ Wärme / Σ Strom WP pro Zeitraum | externe Zähler, Statistik-DB von HA |
| Autarkiegrad heute/Monat/Jahr | 1 − Netzbezug / Gesamtverbrauch | Rennergy-Zähler |
| Eigenverbrauchsquote | 1 − Einspeisung / PV-Erzeugung | Rennergy-Zähler (PV fehlt aktuell, siehe unten) |
| PV-Anteil Heizung | Heizstab-Energie aus Überschuss / Heizstab gesamt | Rennergy-Zähler |
| Speicherenergie Puffer | m · c · (T_mittel − T_Rücklauf) in kWh | Puffertemperaturen + Volumen (Option) |
| Warmwasser-Ladezeit und -Häufigkeit | Zeit mit aktivem WW-Ventil | WW-Umschaltventil |
| Wärmepumpen-Takte, Laufzeit | Starts/h, Laufzeit/Tag | WP-Anforderung aktiv |
| Batteriezyklen | Σ Entladung / Kapazität | Batteriezähler + Kapazität (Option) |
| Ersparnis € | eingesparter Netzbezug × Tarif − entgangene Einspeisevergütung | Tarif (Option oder Sensor) |

### Statistik-Seite im Panel (im EVCC-Stil)
- Zeitraum Tag / Woche / Monat / Jahr / Gesamt
- Kacheln: Autarkie, Eigenverbrauch, JAZ, Ersparnis
- gestapelte Balken für Energie je Quelle und Verbraucher, Liniendiagramm Puffertemperaturen
- Datenbasis: Langzeitstatistiken von HA (`recorder/statistics_during_period`), keine eigene DB

## Stufe 3: Automatisierte Steuerung (Gerüst)

Regel-Engine in der Integration, im Panel bearbeitbar. Jede Regel ist einzeln schaltbar
(`switch.rennergy_strategie_*`) und protokolliert ihre Entscheidungen.

- **Eingänge:** beliebige HA-Entitäten, z. B. EVCC (Ladepunkt aktiv, Ladeleistung, Tarif,
  CO₂-Prognose), Wetter- und PV-Prognose (Forecast.Solar / Solcast), dynamischer Strompreis
  (Tibber, aWATTar), Präsenz, Victron-Batterie
- **Ausgänge:** Rennergy-Elemente (Hand/Automatik, Wert) und beliebige HA-Aktoren
- **Strategien (Startvorschläge):**
  1. *PV-Überschuss-Kaskade:* Batterie → E-Auto (EVCC) → Warmwasser → Puffer, mit
     Mindest-SOC und Hysterese, damit EVCC und Rennergy sich nicht gegenseitig
     den Überschuss wegnehmen
  2. *Günstiger Strom:* bei dynamischem Tarif Puffer und Warmwasser im günstigsten Zeitfenster laden
  3. *Prognose-Vorrang:* bei guter PV-Prognose für morgen Warmwasser nachts nicht laden
  4. *Legionellenschutz:* wöchentlich auf 60 °C, bevorzugt bei Überschuss
  5. *Sperrzeit-/SG-Ready-Sicht:* EVU-Sperre berücksichtigen
- Sicherheitsrahmen: Mindest- und Maximaltemperaturen, maximale Hand-Dauer,
  automatische Rückkehr zur Automatik bei Verbindungsverlust

## Offene Datenfragen
- **Wärmepumpe Strom:** Der Zähler `WP Bezug` (20700) liefert 0, ist also nicht belegt. Für
  COP und JAZ braucht es einen Stromzähler der WP, z. B. Shelly oder die Integration der Wärmepumpe.
- **Wärmemenge:** Die Steuerung hat keinen Wärmemengenzähler (`Durchfluss WP` ist nur eine Regelung
  in %). Für COP und JAZ braucht es einen Wärmemengenzähler oder die Herstellerintegration der Wärmepumpe.
- **PV-Erzeugung:** Der Zähler `PV Erzeugung` (20100) zeigt auch tagsüber 0 (noch prüfen). PV
  kommt evtl. vom Victron GX (Registerliste liegt bei) oder von EVCC.
- In den Optionen werden dafür externe Sensoren auswählbar (Entity-Selector).

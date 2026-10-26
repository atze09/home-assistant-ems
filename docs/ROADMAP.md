# Roadmap und Konzept

## Stufe 1: Anzeigen und Steuern (v0.1, umgesetzt)
- Einrichtung per IP-Adresse, Bereiche wählbar, automatische Erkennung aller Elemente
- Sensoren, Zähler, Hand-Schalter, Hand-Schieberegler, Auswahl Automatik/Hand
- Seitenleisten-Panel: Energiefluss, Heizung/Speicher, Steuerung, alle Werte

## Stufe 2: Komfortfunktionen und Statistiken (v0.2–v0.4)

Umgesetzt:
- Externe Zähler in den Optionen: PV (mehrere Anlagen), Netz, Batterie, Haus, Wärmepumpe
  (Wärme und Strom), HK1, HK2, Ofen. Gesetzte Zähler ersetzen die Rennergy-Werte.
- E-Autos (bis zu 3, mit SoC, Ladeleistung, Energie, Reichweite) und weitere Verbraucher
  (bis zu 6, z. B. Pool, Whirlpool)
- Energie je Zeitraum aus der Langzeitstatistik von HA (stimmt sofort, auch rückwirkend)
- Wärmeerzeugung gesamt, Tages-/Wochen-/Monats-/Jahresarbeitszahl, COP aktuell (aus den
  Zählern der letzten 30 min), Faktor, Soll/Ist nach Datenblatt, Gütegrad
- Heizstab: Energie, Laufzeit, Ø Leistung; Autarkie, Eigenverbrauchsquote
- Knöpfe „Warmwasser Schnellladung“ und „Heizstab-Boost“ (mit Timer, übersteht Neustarts)
  sowie „Alles auf Automatik“
- Services `ems.set_manual` (mit Wert und optionaler Dauer) und `ems.set_auto`
- Panel: Übersicht mit Kennzahlen (Autarkie, Eigenverbrauch, Arbeitszahl, COP),
  Energie je Zeitraum, Energiefluss elektrisch und thermisch, Anlagenschema, E-Autos
- Umbenennung in **EMS** (Kennung `ems`, Seitenleiste „EMS“)
- Panel: vergangene Zeiträume blättern, alle Zeiträume mit denselben Kennzahlen
  (Autarkie, Eigenverbrauch, Arbeitszahl, inkl. Heizstab) und Jetzt-Werten
- Panel: Statistik mit Verlauf (Strom, Wärmepumpe mit Arbeitszahl je Tag, Wärmeerzeugung,
  E-Autos), PV-Anlagen einzeln

Noch offen:
- Puffer-Energie in kWh (Volumen als Option)
- Wärmepumpen-Takte und Laufzeit pro Tag
- Warmwasser-Ladezeit und -Häufigkeit
- Batteriezyklen (Kapazität als Option)
- Ersparnis € (Tarif und Einspeisevergütung als Option oder Sensor)
- Statistik: Puffertemperaturen als Linie
- Automatische Prüfung (hassfest, HACS) als GitHub Action

### Berechnete Werte (Stand)
| Wert | Berechnung | Status |
|---|---|---|
| COP aktuell | Δ Wärme / Δ Strom der letzten 30 min, sonst Wärme- / el. Leistung | umgesetzt |
| Arbeitszahl Tag/Woche/Monat/Jahr | Σ Wärme / Σ Strom WP pro Zeitraum | umgesetzt |
| Autarkiegrad | 1 − Netzbezug / Gesamtverbrauch | umgesetzt |
| Eigenverbrauchsquote | 1 − Einspeisung / PV-Erzeugung | umgesetzt |
| PV-Anteil Heizung | Heizstab-Energie aus Überschuss / Heizstab gesamt | offen |
| Speicherenergie Puffer | m · c · (T_mittel − T_Rücklauf) in kWh | offen |
| Warmwasser-Ladezeit und -Häufigkeit | Zeit mit aktivem WW-Ventil | offen |
| Wärmepumpen-Takte, Laufzeit | Starts/h, Laufzeit/Tag | offen |
| Batteriezyklen | Σ Entladung / Kapazität | offen |
| Ersparnis € | eingesparter Netzbezug × Tarif − entgangene Einspeisevergütung | offen |

## Stufe 3: Automatisierte Steuerung (Gerüst)

Regel-Engine in der Integration, im Panel bearbeitbar. Jede Regel ist einzeln schaltbar
(`switch.ems_strategie_*`) und protokolliert ihre Entscheidungen. Bausteine dafür sind
die Services `ems.set_manual` / `ems.set_auto` mit Dauer.

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
- **PV-Erzeugung:** Der Zähler `PV Erzeugung` (20100) zeigt auch tagsüber 0. PV kommt deshalb
  über die externen PV-Zähler (Victron GX, Wechselrichter oder EVCC).

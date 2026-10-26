// Rennergy EMS sidebar panel (vanilla web component, no build step).

const I18N = {
  de: {
    overview: "Übersicht",
    heating: "Heizung",
    control: "Steuerung",
    values: "Alle Werte",
    sources: "Quellen",
    consumers: "Verbraucher",
    pv: "PV",
    grid_import: "Netzbezug",
    grid_export: "Einspeisung",
    battery: "Batterie",
    battery_charge: "Batterie laden",
    battery_discharge: "Batterie entladen",
    house: "Haus",
    heating_rod: "Heizstab",
    heat_pump: "Wärmepumpe",
    ecar: "E-Auto",
    grid: "Netz",
    outdoor: "Außen",
    hot_water: "Warmwasser",
    today: "Heute",
    controller: "Heizkreisregler",
    hk1: "Heizkreis 1",
    hk2: "Heizkreis 2",
    flow: "Vorlauf Ist",
    flow_target: "Vorlauf Soll",
    pump: "Pumpe",
    mixer_open: "Mischer auf",
    mixer_close: "Mischer zu",
    ww_target: "Warmwasser Soll",
    ww_valve: "WW-Ventil",
    tank_top: "Puffer oben",
    tank_middle: "Puffer Mitte",
    tank_bottom: "Puffer unten",
    auto: "Automatik",
    manual: "Hand",
    search: "Suchen …",
    loading: "Lade EMS …",
    no_system: "Keine EMS-Anlage eingerichtet. Füge die Integration unter Einstellungen → Geräte & Dienste hinzu.",
    no_controls: "Keine schaltbaren Elemente in den gewählten Bereichen.",
    mode_hint: "Schalten oder Verstellen setzt das Element auf Hand. Mit „Automatik“ übernimmt wieder die Regelung.",
    idle: "Ruht",
    plant: "Anlage",
    flow_actual_target: "Vorlauf Ist / Soll",
    mixer: "Mischer",
    modulation: "Modulation",
    temperature: "Temperatur",
    thermal: "Wärme",
    electric: "Strom",
    factor: "Faktor",
    demand: "Anforderung",
    lift: "Hub",
    on: "Ein",
    off: "Aus",
    opening: "öffnet",
    closing: "schließt",
    holding: "steht",
    of_target: "v. Soll",
    stats: "Statistik",
    day: "Tag",
    week: "Woche",
    month: "Monat",
    year: "Jahr",
    autarky: "Autarkie",
    self_consumption: "Eigenverbrauch",
    work_ratio: "Arbeitszahl",
    cop: "COP aktuell",
    heat_generation: "Wärmeerzeugung",
    heat_distribution: "Wärmeverteilung",
    electricity: "Strom",
    stove: "Ofen",
    hc1: "Heizkreis 1",
    hc2: "Heizkreis 2",
    hp_electric: "Wärmepumpe Strom",
    consumption: "Gesamtverbrauch",
    runtime: "Laufzeit",
    avg_power: "Ø Leistung",
    energy: "Energie",
    no_meters: "Für Wärme-Statistiken, Arbeitszahlen und PV in den Integrationseinstellungen unter „Zähler“ die Wärmemengen-, Strom- und PV-Sensoren auswählen.",
    since_note: "Die Statistiken zählen ab der Einrichtung.",
    quick_load: "Warmwasser Schnellladung",
    active_until: "aktiv bis",
    start: "Starten",
    all_auto: "Alles auf Automatik",
    rod_boost: "Heizstab-Boost",
    energy_period: "Energie",
    live: "Jetzt",
    cars: "E-Autos",
    soc: "Ladezustand",
    charging: "Lädt",
    range: "Reichweite",
    charged: "Geladen",
    history: "Verlauf",
    hp_heat: "Wärmepumpe Wärme",
    pv_systems: "PV-Anlagen",
    battery_charged: "Batterie geladen",
    battery_discharged: "Batterie entladen",
    no_history: "Für diesen Zeitraum gibt es noch keine Daten.",
    loading_history: "Lade Verlauf …",
    target_ratio: "Soll/Ist",
    factor_target: "Faktor Soll",
    lift_avg: "Ø Hub",
    net_grid: "Netto Netz",
    flow_el: "Energiefluss elektrisch",
    flow_th: "Energiefluss thermisch",
    other: "Sonstiges",
    tank: "Puffer",
    water: "Wasser",
    water_flow: "Wasser Durchfluss",
    work_ratio_rod: "Arbeitszahl inkl. Heizstab",
    now: "Jetzt",
    previous: "Vorheriger Zeitraum",
    next: "Nächster Zeitraum",
    cw: "KW",
  },
  en: {
    overview: "Overview",
    heating: "Heating",
    control: "Control",
    values: "All values",
    sources: "Sources",
    consumers: "Consumers",
    pv: "PV",
    grid_import: "Grid import",
    grid_export: "Grid export",
    battery: "Battery",
    battery_charge: "Battery charging",
    battery_discharge: "Battery discharging",
    house: "House",
    heating_rod: "Heating rod",
    heat_pump: "Heat pump",
    ecar: "Car",
    grid: "Grid",
    outdoor: "Outdoor",
    hot_water: "Hot water",
    today: "Today",
    controller: "Heating controller",
    hk1: "Heating circuit 1",
    hk2: "Heating circuit 2",
    flow: "Flow actual",
    flow_target: "Flow target",
    pump: "Pump",
    mixer_open: "Mixer open",
    mixer_close: "Mixer close",
    ww_target: "Hot water target",
    ww_valve: "Hot water valve",
    tank_top: "Tank top",
    tank_middle: "Tank middle",
    tank_bottom: "Tank bottom",
    auto: "Automatic",
    manual: "Manual",
    search: "Search …",
    loading: "Loading EMS …",
    no_system: "No EMS system configured. Add the integration under Settings → Devices & services.",
    no_controls: "No switchable items in the selected areas.",
    mode_hint: "Switching or changing a value puts the item into manual mode. Choose “Automatic” to hand control back.",
    idle: "Idle",
    plant: "Plant",
    flow_actual_target: "Flow actual / target",
    mixer: "Mixer",
    modulation: "Modulation",
    temperature: "Temperature",
    thermal: "Heat",
    electric: "Power",
    factor: "Factor",
    demand: "Demand",
    lift: "Lift",
    on: "On",
    off: "Off",
    opening: "opening",
    closing: "closing",
    holding: "holding",
    of_target: "of target",
    stats: "Statistics",
    day: "Day",
    week: "Week",
    month: "Month",
    year: "Year",
    autarky: "Self-sufficiency",
    self_consumption: "Self-consumption",
    work_ratio: "Performance factor",
    cop: "COP now",
    heat_generation: "Heat generation",
    heat_distribution: "Heat distribution",
    electricity: "Electricity",
    stove: "Stove",
    hc1: "Heating circuit 1",
    hc2: "Heating circuit 2",
    hp_electric: "Heat pump electricity",
    consumption: "Total consumption",
    runtime: "Runtime",
    avg_power: "Avg. power",
    energy: "Energy",
    no_meters: "For heat statistics, performance factors and PV, select the heat, electricity and PV sensors in the integration settings under “Meters”.",
    since_note: "Statistics count from the time of setup.",
    quick_load: "Hot water quick load",
    active_until: "active until",
    start: "Start",
    all_auto: "Everything to automatic",
    rod_boost: "Heating rod boost",
    energy_period: "Energy",
    live: "Now",
    cars: "Cars",
    soc: "State of charge",
    charging: "Charging",
    range: "Range",
    charged: "Charged",
    history: "History",
    hp_heat: "Heat pump heat",
    pv_systems: "PV systems",
    battery_charged: "Battery charged",
    battery_discharged: "Battery discharged",
    no_history: "No data for this period yet.",
    loading_history: "Loading history …",
    target_ratio: "Actual vs. target",
    factor_target: "Target factor",
    lift_avg: "Avg. lift",
    net_grid: "Net grid",
    flow_el: "Electric energy flow",
    flow_th: "Thermal energy flow",
    other: "Other",
    tank: "Buffer tank",
    water: "Water",
    water_flow: "Water flow",
    work_ratio_rod: "Performance factor incl. heating rod",
    now: "Now",
    previous: "Previous period",
    next: "Next period",
    cw: "CW",
  },
};

const COLORS = {
  pv: "var(--rn-pv)",
  battery: "var(--rn-battery)",
  grid: "var(--rn-grid)",
  export: "var(--rn-export)",
  house: "var(--rn-house)",
  heat: "var(--rn-heat)",
  heatpump: "var(--rn-heatpump)",
  ecar: "var(--rn-ecar)",
};

const STYLE = `
  :host {
    --rn-pv: #f2b705;
    --rn-battery: #3fb37f;
    --rn-grid: #8c8c99;
    --rn-export: #7cc242;
    --rn-house: #4a7ff0;
    --rn-heat: #e5533d;
    --rn-heatpump: #e08a2c;
    --rn-ecar: #9b6bf2;
    --rn-radius: 16px;
    display: block;
    min-height: 100vh;
    background: var(--primary-background-color);
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  header {
    display: flex; align-items: center; gap: 8px;
    height: var(--header-height, 56px); padding: 0 12px;
    background: var(--app-header-background-color, var(--primary-color));
    color: var(--app-header-text-color, #fff);
    border-bottom: var(--app-header-border-bottom, none);
  }
  header h1 { font-size: 20px; font-weight: 400; margin: 0; flex: 1; }
  header select { background: transparent; color: inherit; border: 1px solid currentColor; border-radius: 8px; padding: 4px 8px; }
  header select option { color: #000; }
  nav { display: flex; gap: 4px; padding: 12px 16px 0; overflow-x: auto; }
  nav button {
    border: none; background: none; color: var(--secondary-text-color);
    font-size: 15px; padding: 8px 14px; border-radius: 999px; cursor: pointer; white-space: nowrap;
  }
  nav button.active { background: var(--primary-color); color: var(--text-primary-color, #fff); }
  main { padding: 16px; max-width: 1200px; margin: 0 auto; box-sizing: border-box; }
  .card {
    background: var(--card-background-color); border-radius: var(--rn-radius);
    box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0,0,0,.12)); padding: 16px; margin-bottom: 16px;
  }
  .card h2 { font-size: 16px; font-weight: 500; margin: 0 0 12px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .04em; }
  .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .tile { display: flex; flex-direction: column; gap: 6px; cursor: pointer; }
  .tile .head { display: flex; align-items: center; gap: 8px; color: var(--secondary-text-color); font-size: 14px; }
  .tile .head ha-icon { --mdc-icon-size: 22px; }
  .tile .big { font-size: 28px; font-weight: 300; font-variant-numeric: tabular-nums; }
  .tile .sub { font-size: 13px; color: var(--secondary-text-color); }
  .flow-label { display: flex; justify-content: space-between; font-size: 13px; color: var(--secondary-text-color); margin: 10px 0 4px; }
  .bar { display: flex; height: 34px; border-radius: 10px; overflow: hidden; background: var(--divider-color, rgba(127,127,127,.2)); }
  .bar .seg { display: flex; align-items: center; justify-content: center; gap: 4px; color: #fff; font-size: 12px; font-weight: 500;
              min-width: 0; overflow: hidden; white-space: nowrap; transition: flex-grow .6s ease; }
  .bar .seg ha-icon { --mdc-icon-size: 18px; }
  .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 10px; font-size: 13px; }
  .legend span { display: inline-flex; align-items: center; gap: 6px; }
  .legend i { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .soc { height: 8px; border-radius: 4px; background: var(--divider-color, rgba(127,127,127,.2)); overflow: hidden; }
  .soc div { height: 100%; background: var(--rn-battery); transition: width .6s ease; }
  .rows { display: grid; gap: 2px; }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 7px 4px; border-radius: 8px; cursor: pointer; }
  .row:hover { background: var(--secondary-background-color); }
  .row .name { overflow: hidden; text-overflow: ellipsis; }
  .row .val { font-variant-numeric: tabular-nums; white-space: nowrap; color: var(--primary-text-color); }
  .heating { display: grid; gap: 16px; grid-template-columns: minmax(260px, 1fr) minmax(220px, 300px); align-items: start; }
  .tank-wrap { display: flex; justify-content: center; }
  .tank { position: relative; width: 220px; height: 420px; border-radius: 110px; border: 3px solid var(--divider-color, #888);
          display: flex; flex-direction: column; justify-content: space-around; align-items: center; padding: 40px 0; box-sizing: border-box;
          transition: background .8s ease; }
  .tank .lbl { background: rgba(0,0,0,.55); color: #fff; border-radius: 10px; padding: 6px 12px; text-align: center; min-width: 110px; cursor: pointer; }
  .tank .lbl small { display: block; opacity: .8; font-size: 12px; }
  .tank .lbl b { font-weight: 500; font-size: 17px; }
  .ctrl { display: grid; grid-template-columns: 1fr auto; gap: 8px 16px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--divider-color, rgba(127,127,127,.2)); }
  .ctrl:last-child { border-bottom: none; }
  .ctrl .name { cursor: pointer; }
  .ctrl .inputs { display: flex; align-items: center; gap: 10px; }
  .ctrl input[type=range] { width: 160px; accent-color: var(--primary-color); }
  .ctrl select { padding: 4px 8px; border-radius: 8px; background: var(--card-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color, #888); }
  .ctrl .num { min-width: 64px; text-align: right; font-variant-numeric: tabular-nums; }
  .ctrl.manual .name::after { content: " ✋"; }
  .toggle { position: relative; width: 44px; height: 24px; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle span { position: absolute; inset: 0; border-radius: 12px; background: var(--divider-color, #888); cursor: pointer; transition: .2s; }
  .toggle span::before { content: ""; position: absolute; width: 18px; height: 18px; left: 3px; top: 3px; border-radius: 50%; background: #fff; transition: .2s; }
  .toggle input:checked + span { background: var(--primary-color); }
  .toggle input:checked + span::before { transform: translateX(20px); }
  .hint { font-size: 13px; color: var(--secondary-text-color); margin: 0 0 12px; }
  .search { width: 100%; box-sizing: border-box; padding: 10px 14px; border-radius: 12px; border: 1px solid var(--divider-color, #888);
            background: var(--card-background-color); color: var(--primary-text-color); font-size: 15px; margin-bottom: 16px; }
  .empty { padding: 32px; text-align: center; color: var(--secondary-text-color); }
  .segmented { display: inline-flex; background: var(--card-background-color); border-radius: 999px; padding: 4px; gap: 2px;
               box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0,0,0,.12)); margin-bottom: 16px; }
  .segmented button { border: none; background: none; color: var(--secondary-text-color); padding: 6px 16px; border-radius: 999px;
                      font-size: 14px; cursor: pointer; }
  .segmented button.active { background: var(--primary-color); color: var(--text-primary-color, #fff); }
  .stats-cols { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
  .action { display: flex; align-items: center; gap: 14px; }
  .action ha-icon { --mdc-icon-size: 28px; flex: none; }
  .action .grow { flex: 1; min-width: 0; }
  .action .sub { font-size: 13px; color: var(--secondary-text-color); }
  .action.running { outline: 2px solid var(--rn-heat); }
  .pill { border: none; border-radius: 999px; padding: 8px 18px; background: var(--primary-color); color: var(--text-primary-color, #fff);
          font-size: 14px; cursor: pointer; white-space: nowrap; }
  .pill:active { transform: scale(.97); }

  /* ----- plant schema ----- */
  .plant-grid { display: grid; grid-template-columns: minmax(0, 1fr) clamp(56px, 14vw, 150px) clamp(96px, 18vw, 170px);
                grid-auto-rows: minmax(120px, auto); row-gap: 14px; align-items: center; }
  .unit { grid-column: 1; position: relative; border-radius: 14px; padding: 12px 14px; cursor: pointer;
          background: var(--secondary-background-color); border: 1px solid transparent; transition: border-color .4s, box-shadow .4s; }
  .unit.active { border-color: var(--rn-heat); box-shadow: 0 0 0 3px color-mix(in srgb, var(--rn-heat) 18%, transparent); }
  .unit.hp.active { border-color: var(--rn-heatpump); }
  .uhead { display: flex; align-items: center; gap: 8px; font-weight: 500; margin-bottom: 4px; }
  .uhead ha-icon { --mdc-icon-size: 22px; color: var(--secondary-text-color); }
  .unit.active .uhead ha-icon { color: var(--rn-heat); }
  .unit.hp.active .uhead ha-icon { color: var(--rn-heatpump); animation: rn-spin 3s linear infinite; }
  .uhead span { flex: 1; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--divider-color, #888); }
  .unit.active .dot { background: var(--rn-battery); box-shadow: 0 0 8px var(--rn-battery); }
  .unit .big { font-size: 24px; font-weight: 300; margin-bottom: 4px; font-variant-numeric: tabular-nums; }
  .kv { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; color: var(--secondary-text-color); padding: 2px 0; }
  .kv b { color: var(--primary-text-color); font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .hpgrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 12px; margin: 4px 0 6px; }
  .hpgrid small { display: block; font-size: 12px; color: var(--secondary-text-color); }
  .hpgrid b { font-size: 18px; font-weight: 400; font-variant-numeric: tabular-nums; }
  .valve { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
  .valve span { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 3px 10px; border-radius: 999px;
                background: var(--card-background-color); color: var(--secondary-text-color); }
  .valve span ha-icon { --mdc-icon-size: 16px; }
  .valve span.on { background: var(--rn-heatpump); color: #fff; }
  .pipe { grid-column: 2; display: flex; flex-direction: column; justify-content: center; gap: 5px; height: 100%; }
  .pipe small { font-size: 11px; color: var(--secondary-text-color); text-align: center; white-space: nowrap; min-height: 14px; }
  .pipe .line { height: 7px; border-radius: 4px; background: var(--c, var(--divider-color, #888)); opacity: .35; position: relative; overflow: hidden; }
  .pipe.active .line { opacity: 1; }
  .pipe.active .line::after { content: ""; position: absolute; inset: 0 0 0 -22px;
      background: repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 8px, transparent 8px 22px);
      animation: rn-flow 1.2s linear infinite; }
  /* consumers: supply flows from the tank (right) to the left */
  .pipe.out.active .flow::after, .pipe.in.active .ret::after { animation-direction: reverse; }
  .pipe.cable { justify-content: center; }
  .pipe.cable .line { height: 4px; background: var(--rn-pv); opacity: .3; }
  .pipe.cable.active .line { opacity: 1; box-shadow: 0 0 8px var(--rn-pv); }
  .ptank { grid-column: 3; align-self: stretch; border-radius: 80px; border: 3px solid var(--divider-color, #888);
           display: flex; flex-direction: column; justify-content: space-around; align-items: center; padding: 48px 8px;
           background: var(--secondary-background-color); transition: background 1s ease; min-height: 300px; }
  .tlbl { background: rgba(0,0,0,.55); color: #fff; border-radius: 10px; padding: 5px 10px; text-align: center; cursor: pointer; max-width: 92%; }
  .tlbl small { display: block; font-size: 11px; opacity: .85; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .tlbl b { font-size: 16px; font-weight: 500; }
  /* ----- overview: gauges, energy chips, cars ----- */
  .gauges { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-bottom: 16px; }
  .gauge { display: flex; flex-direction: column; align-items: center; cursor: pointer; margin-bottom: 0; padding-bottom: 12px; }
  .gauge svg { width: 100%; max-width: 180px; }
  .gauge path { fill: none; stroke-width: 12; stroke-linecap: round; }
  .gauge .track { stroke: var(--divider-color, rgba(127,127,127,.25)); }
  .gauge .value { stroke-dasharray: 0 100; transition: stroke-dasharray .8s ease; }
  .gauge .gval { font-size: 26px; font-weight: 300; margin-top: -26px; font-variant-numeric: tabular-nums; }
  .gauge .glbl { font-size: 14px; color: var(--secondary-text-color); margin-top: 4px; text-align: center; }
  .gauge .gnow { font-size: 12px; color: var(--secondary-text-color); min-height: 16px; margin-top: 2px; }
  .periodbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; margin-bottom: 16px; }
  .periodbar .segmented { margin-bottom: 0; }
  .pnav { display: flex; align-items: center; gap: 4px; background: var(--card-background-color); border-radius: 999px; padding: 4px;
          box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0,0,0,.12)); }
  .pnav span { min-width: 150px; text-align: center; font-size: 14px; padding: 0 6px; font-variant-numeric: tabular-nums; }
  .pnav button { border: none; background: none; color: var(--primary-text-color); font-size: 18px; width: 32px; height: 32px;
                 border-radius: 50%; cursor: pointer; }
  .pnav button:disabled { opacity: .3; cursor: default; }
  .pnav button.now { width: auto; font-size: 13px; padding: 0 12px; border-radius: 999px; color: var(--primary-color); }
  .pnav button.now.active { background: color-mix(in srgb, var(--primary-color) 18%, transparent); }
  .chips { display: grid; gap: 8px 16px; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
  .chip { display: flex; align-items: center; gap: 10px; padding: 6px; border-radius: 10px; cursor: pointer; }
  .chip:hover { background: var(--secondary-background-color); }
  .chip ha-icon { --mdc-icon-size: 24px; flex: none; }
  .chip small { display: block; font-size: 12px; color: var(--secondary-text-color); }
  .chip b { font-weight: 500; font-variant-numeric: tabular-nums; }
  .cars { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .car { cursor: pointer; }
  .car .uhead small { font-weight: 400; color: var(--secondary-text-color); }
  .car-soc { margin: 8px 0; }

  /* ----- energy flow diagrams ----- */
  .flows { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
  .flows .card { margin-bottom: 16px; }
  .fwrap { position: relative; width: 100%; max-width: 620px; margin: 0 auto 26px; }
  .fwrap svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .fwrap path { fill: none; stroke-width: 1.5; opacity: .25; vector-effect: non-scaling-stroke; transition: stroke-width .6s ease, opacity .4s; }
  .fwrap path.active { opacity: .9; stroke-dasharray: 6 10; animation: rn-dash 1s linear infinite; }
  .fwrap path.active.reverse { animation-direction: reverse; }
  .fnode { position: absolute; transform: translate(-50%, -50%); width: clamp(62px, 13vw, 84px); aspect-ratio: 1; border-radius: 50%;
           border: 3px solid var(--c); background: var(--card-background-color); box-sizing: border-box; cursor: pointer;
           display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; opacity: .55;
           transition: opacity .4s, box-shadow .4s; }
  .fnode.active { opacity: 1; box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 18%, transparent); }
  .fnode ha-icon { --mdc-icon-size: 20px; color: var(--c); }
  .fnode b { font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .fnode small { font-size: 10px; color: var(--secondary-text-color); white-space: nowrap; }
  .fnode .flbl { position: absolute; top: calc(100% + 3px); left: 50%; transform: translateX(-50%); font-size: 11px;
                 color: var(--secondary-text-color); white-space: nowrap; max-width: 110px; overflow: hidden; text-overflow: ellipsis; }
  .fnode small:empty { display: none; }
  .fpill { position: absolute; right: 0; transform: translateY(-50%); height: 48px; box-sizing: border-box; cursor: pointer;
           display: flex; align-items: center; gap: 8px; padding: 0 10px 0 4px; border-radius: 24px; opacity: .5;
           border: 1.5px solid color-mix(in srgb, var(--c) 60%, transparent); background: var(--card-background-color);
           transition: opacity .4s, box-shadow .4s; }
  .fpill.active { opacity: 1; box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 15%, transparent); }
  .fpill .ic { flex: none; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
               background: color-mix(in srgb, var(--c) 18%, transparent); }
  .fpill .ic ha-icon { --mdc-icon-size: 20px; color: var(--c); }
  .fpill .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.2; }
  .fpill .nm { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fpill small { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fpill b { font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap; }

  .filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .filters button { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--divider-color, #888); border-radius: 999px;
                    background: var(--card-background-color); color: var(--primary-text-color); padding: 6px 12px; font-size: 13px; cursor: pointer; }
  .filters button i { width: 10px; height: 10px; border-radius: 50%; }
  .filters button.off { opacity: .45; text-decoration: line-through; }

  /* ----- history charts ----- */
  .chart { min-height: 60px; color: var(--secondary-text-color); font-size: 13px; }
  .barchart { width: 100%; height: auto; display: block; }
  .barchart text { font-size: 10px; fill: var(--secondary-text-color); }
  .barchart .gridline { stroke: var(--divider-color, rgba(127,127,127,.2)); stroke-width: .5; }
  .barchart .zero { stroke: var(--secondary-text-color); stroke-width: .8; }
  .barchart .line { fill: none; stroke-width: 1.6; }
  .barchart .hit { fill: transparent; }
  .barchart .hit:hover { fill: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }

  @keyframes rn-dash { from { stroke-dashoffset: 16; } to { stroke-dashoffset: 0; } }
  @keyframes rn-flow { from { transform: translateX(-22px); } to { transform: translateX(0); } }
  @keyframes rn-spin { to { transform: rotate(360deg); } }
  @media (max-width: 600px) {
    .unit { padding: 10px; }
    .unit .big { font-size: 20px; }
    .hpgrid b { font-size: 15px; }
    .pipe small { font-size: 10px; white-space: normal; }
    .tlbl { padding: 4px 6px; }
    .tlbl b { font-size: 14px; }
    .ptank { padding: 36px 4px; border-radius: 60px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pipe.active .line::after, .unit.hp.active .uhead ha-icon, .fwrap path.active { animation: none; }
  }
  @media (max-width: 700px) {
    main { padding: 12px; }
    .heating { grid-template-columns: 1fr; }
    .tank { width: 180px; height: 360px; }
    .ctrl input[type=range] { width: 110px; }
  }
`;

// ISO 8601 calendar week of a date.
const isoWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil(((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7);
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

class RennergyPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._tab = "overview";
    this._period = "day";
    // 0 = running period, −1 = the one before, …
    this._offset = 0;
    // PV systems and cars hidden in the statistics charts.
    this._hidden = new Set();
    this._systemIndex = 0;
    this._config = null;
    this._loading = false;
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (this._menuButton) this._menuButton.hass = hass;
    if (first) this._renderShell();
    if (!this._config && !this._loading) this._loadConfig();
    else this._update();
  }

  set narrow(narrow) {
    this._narrow = narrow;
    if (this._menuButton) this._menuButton.narrow = narrow;
  }

  set panel(panel) {
    this._panel = panel;
  }

  get _t() {
    const lang = (this._hass?.language || "en").split("-")[0];
    return I18N[lang] || I18N.en;
  }

  get _system() {
    return this._config?.systems?.[this._systemIndex];
  }

  async _loadConfig() {
    this._loading = true;
    try {
      this._config = await this._hass.callWS({ type: "ems/config" });
    } catch (err) {
      console.error("EMS: loading config failed", err);
      this._config = { systems: [] };
    }
    this._loading = false;
    this._renderShell();
  }

  // ---------- helpers ----------

  _state(eid) {
    const s = eid && this._hass.states[eid];
    return s && s.state !== "unavailable" && s.state !== "unknown" ? s : null;
  }

  _num(eid) {
    const s = this._state(eid);
    if (!s) return null;
    const n = parseFloat(s.state);
    return Number.isFinite(n) ? n : null;
  }

  _fmt(eid) {
    const s = this._state(eid);
    if (!s) return "–";
    if (this._hass.formatEntityState) return this._hass.formatEntityState(s);
    const unit = s.attributes.unit_of_measurement;
    return unit ? `${s.state} ${unit}` : s.state;
  }

  _fmtNumber(value, digits) {
    return value.toLocaleString(this._hass.locale?.language || this._hass.language, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }

  _fmtPower(watts) {
    if (watts == null) return "–";
    const abs = Math.abs(watts);
    return abs >= 1000 ? `${this._fmtNumber(watts / 1000, 1)} kW` : `${this._fmtNumber(watts, 0)} W`;
  }

  // All entities behind a role. External meters chosen in the settings win
  // over the Rennergy items (PV may consist of several systems).
  _ids(role) {
    if (role === "battery_soc" && this._system?.battery_soc) return [this._system.battery_soc];
    const external = {
      pv_power: "pv",
      heat_pump_power: "hp_electric",
      grid_power: "grid",
      battery_power: "battery",
      house_power: "house",
      heating_rod_power: "heating_rod",
    }[role];
    const list = external && this._system?.power_sensors?.[external];
    if (list && list.length) return list;
    const own = this._system?.roles?.[role];
    return own ? [own] : [];
  }

  _role(role) {
    return this._ids(role)[0];
  }

  // Sum of power entities in W (handles kW).
  _sumW(ids) {
    let total = null;
    for (const eid of ids || []) {
      const s = this._state(eid);
      const n = s ? parseFloat(s.state) : NaN;
      if (!Number.isFinite(n)) continue;
      const unit = s.attributes.unit_of_measurement;
      total = (total ?? 0) + n * (unit === "kW" ? 1000 : unit === "MW" ? 1e6 : 1);
    }
    return total;
  }

  _powerW(role) {
    return this._sumW(this._ids(role));
  }

  _stat(key) {
    return this._system?.stats?.[key];
  }

  _itemByEntity(eid) {
    return this._system?.items.find((i) => i.entities.value === eid);
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  // ---------- rendering ----------

  _renderShell() {
    const t = this._t;
    const root = this.shadowRoot;
    root.innerHTML = `<style>${STYLE}</style>
      <header><span class="menu"></span><h1>EMS</h1><span class="systems"></span></header>
      <nav></nav><main></main>`;

    this._menuButton = document.createElement("ha-menu-button");
    this._menuButton.hass = this._hass;
    this._menuButton.narrow = this._narrow;
    root.querySelector(".menu").appendChild(this._menuButton);

    const main = root.querySelector("main");
    if (!this._config) {
      main.innerHTML = `<div class="empty">${t.loading}</div>`;
      return;
    }
    if (!this._system) {
      main.innerHTML = `<div class="empty">${t.no_system}</div>`;
      return;
    }

    if (this._config.systems.length > 1) {
      const select = document.createElement("select");
      this._config.systems.forEach((s, i) => select.add(new Option(s.title, i, false, i === this._systemIndex)));
      select.addEventListener("change", () => {
        this._systemIndex = Number(select.value);
        this._renderShell();
      });
      root.querySelector(".systems").appendChild(select);
    }

    const nav = root.querySelector("nav");
    for (const tab of ["overview", "stats", "heating", "control", "values"]) {
      const btn = document.createElement("button");
      btn.textContent = t[tab];
      btn.classList.toggle("active", tab === this._tab);
      btn.addEventListener("click", () => {
        this._tab = tab;
        this._renderShell();
      });
      nav.appendChild(btn);
    }

    // Fresh DOM: charts have to be drawn again.
    if (this._history) this._history.drawn = false;
    main.innerHTML = this[`_render_${this._tab}`]();
    this._bind(main);
    this._update();
  }

  _tile(icon, color, label, role, sub = "") {
    const ids = this._ids(role);
    if (!ids.length) return "";
    // Several entities (e.g. PV systems) are shown as their sum.
    const value =
      ids.length > 1
        ? `<div class="big" data-power-role="${esc(role)}">–</div>`
        : `<div class="big" data-fmt-eid="${esc(ids[0])}">–</div>`;
    return `<div class="card tile" data-more="${esc(ids[0])}">
      <div class="head"><ha-icon icon="${icon}" style="color:${color}"></ha-icon>${esc(label)}</div>
      ${value}
      ${sub}
    </div>`;
  }

  // ---------- plant schema ----------

  _schema(field) {
    return this._system?.schema?.[field];
  }

  // Heating rod temperature: chosen in the settings, else the Rennergy item.
  _rodTempId() {
    return this._schema("rod_temp") || this._role("heating_rod_temp");
  }

  // Tank sensors from top to bottom, the heating rod sits at the very top.
  _tankIds() {
    const configured = this._schema("tank_sensors");
    const list =
      configured && configured.length
        ? [...configured]
        : ["hot_water_temp", "tank_top", "tank_middle", "tank_bottom"].map((r) => this._role(r)).filter(Boolean);
    const rod = this._rodTempId();
    return rod && !list.includes(rod) ? [rod, ...list] : list;
  }

  _pv(key, label, cls = "") {
    return `<div class="kv ${cls}"><span>${esc(label)}</span><b data-pv="${key}">–</b></div>`;
  }

  _pipe(id, kind) {
    // kind: "out" = water flows from the tank to a consumer, "in" = a generator
    // feeds the tank, "cable" = electric heating rod.
    if (kind === "cable") {
      return `<div class="pipe cable" data-pa="${id}"><div class="line"></div></div>`;
    }
    return `<div class="pipe ${kind}" data-pa="${id}">
        <small data-pv="${id}_flow_lbl"></small>
        <div class="line flow" data-pc="${id}_flow"></div>
        <div class="line ret" data-pc="${id}_ret"></div>
        <small data-pv="${id}_ret_lbl"></small>
      </div>`;
  }

  _plant() {
    const t = this._t;
    const r = (role) => !!this._role(role);
    const s = (field) => !!this._schema(field);
    const rows = [];

    for (const hk of ["hk1", "hk2"]) {
      const n = hk.slice(2);
      if (!r(`${hk}_flow`) && !s(`hc${n}_heat_power`)) continue;
      rows.push(`
        <div class="unit" data-pa="${hk}" data-more="${esc(this._role(`${hk}_flow`) || this._schema(`hc${n}_heat_power`))}">
          <div class="uhead"><ha-icon icon="mdi:radiator"></ha-icon><span>${t[hk]}</span><i class="dot"></i></div>
          <div class="big" data-pv="${hk}_power">–</div>
          ${this._pv(`${hk}_vl`, t.flow_actual_target)}
          ${this._pv(`${hk}_mixer`, t.mixer)}
        </div>
        ${this._pipe(hk, "out")}`);
    }

    if (r("heating_rod_power") || r("heating_rod_percent")) {
      rows.push(`
        <div class="unit small" data-pa="rod" data-more="${esc(this._role("heating_rod_power") || this._role("heating_rod_percent"))}">
          <div class="uhead"><ha-icon icon="mdi:heating-coil"></ha-icon><span>${t.heating_rod}</span><i class="dot"></i></div>
          <div class="big" data-pv="rod_power">–</div>
          ${this._pv("rod_percent", t.modulation)}
        </div>
        ${this._pipe("rod", "cable")}`);
    }

    if (r("stove_temp") || s("stove_temp") || s("stove_status")) {
      rows.push(`
        <div class="unit" data-pa="stove" data-more="${esc(this._schema("stove_temp") || this._role("stove_temp") || this._schema("stove_status"))}">
          <div class="uhead"><ha-icon icon="mdi:fireplace"></ha-icon><span>${t.stove}</span><i class="dot"></i></div>
          <div class="big" data-pv="stove_power">–</div>
          ${this._pv("stove_temp", t.temperature)}
        </div>
        ${this._pipe("stove", "in")}`);
    }

    const hasHp = (this._system.power_sensors?.hp_electric || []).length || r("heat_pump_demand") || s("hp_flow_temp");
    if (hasHp) {
      rows.push(`
        <div class="unit hp" data-pa="hp" data-more="${esc((this._system.power_sensors?.hp_electric || [])[0] || this._role("heat_pump_demand") || "")}">
          <div class="uhead"><ha-icon icon="mdi:heat-pump"></ha-icon><span>${t.heat_pump}</span><i class="dot"></i></div>
          <div class="hpgrid">
            <div><small>${t.thermal}</small><b data-pv="hp_heat">–</b></div>
            <div><small>${t.electric}</small><b data-pv="hp_el">–</b></div>
            <div><small>COP</small><b data-pv="hp_cop">–</b></div>
            <div><small>${t.factor}</small><b data-pv="hp_factor">–</b></div>
          </div>
          ${this._pv("hp_demand", t.demand)}
          ${this._pv("hp_lift", t.lift)}
          <div class="valve">
            <span data-valve="ww"><ha-icon icon="mdi:shower-head"></ha-icon>${t.hot_water}</span>
            <span data-valve="heat"><ha-icon icon="mdi:radiator"></ha-icon>${t.heating}</span>
          </div>
        </div>
        ${this._pipe("hp", "in")}`);
    }

    if (!rows.length) return "";
    const tank = this._tankIds()
      .map((eid) => {
        const st = this._hass.states[eid];
        const name =
          eid === this._rodTempId() ? t.heating_rod : (st?.attributes.friendly_name || eid).replace(/^EMS [^ ]+ /, "");
        return `<div class="tlbl" data-more="${esc(eid)}"><small>${esc(name)}</small><b data-fmt="${esc(eid)}">–</b></div>`;
      })
      .join("");

    return `<div class="card plant">
        <h2>${t.plant}</h2>
        <div class="plant-grid" style="--rows:${rows.length}">
          ${rows.join("")}
          <div class="ptank" data-ptank style="grid-row: 1 / span ${rows.length}">${tank}</div>
        </div>
      </div>`;
  }

  _tempColor(temp) {
    if (temp == null) return "var(--divider-color, #888)";
    const ratio = Math.max(0, Math.min(1, (temp - 20) / 45));
    return `hsl(${Math.round(220 - ratio * 220)}, 75%, 50%)`;
  }

  _fmtTemp(value) {
    return value == null ? "–" : `${this._fmtNumber(value, 1)} °C`;
  }

  _updatePlant(main) {
    const plant = main.querySelector(".plant");
    if (!plant) return;
    const t = this._t;
    const num = (eid) => (eid ? this._num(eid) : null);
    const role = (r) => this._num(this._role(r));
    const sch = (f) => num(this._schema(f));
    const V = {};
    const C = {};
    const A = {};

    for (const hk of ["hk1", "hk2"]) {
      const n = hk.slice(2);
      const power = this._sumW([this._schema(`hc${n}_heat_power`)].filter(Boolean));
      const pump = role(`${hk}_pump`);
      const open = role(`${hk}_mixer_open`);
      const close = role(`${hk}_mixer_close`);
      const flow = sch(`hc${n}_flow_temp`);
      const ret = sch(`hc${n}_return_temp`);
      V[`${hk}_power`] = power != null ? this._fmtPower(power) : pump ? t.on : t.off;
      V[`${hk}_vl`] = `${this._fmtTemp(role(`${hk}_flow`))} / ${this._fmtTemp(role(`${hk}_target`))}`;
      V[`${hk}_mixer`] = open > 0 ? `▲ ${t.opening}` : close > 0 ? `▼ ${t.closing}` : t.holding;
      V[`${hk}_flow_lbl`] = flow != null ? `VL ${this._fmtTemp(flow)}` : "";
      V[`${hk}_ret_lbl`] = ret != null ? `RL ${this._fmtTemp(ret)}` : "";
      C[`${hk}_flow`] = this._tempColor(flow ?? role(`${hk}_flow`));
      C[`${hk}_ret`] = this._tempColor(ret);
      A[hk] = (pump ?? 0) >= 1 || (power ?? 0) > 50;
    }

    const rodW = this._powerW("heating_rod_power");
    V.rod_power = this._fmtPower(rodW ?? 0);
    const rodPct = role("heating_rod_percent");
    V.rod_percent = rodPct != null ? `${this._fmtNumber(rodPct, 0)} %` : "–";
    A.rod = (rodW ?? 0) > 20;

    const stoveW = this._sumW(this._system.power_sensors?.stove_heat);
    const stoveStatus = this._state(this._schema("stove_status"));
    const stoveTemp = sch("stove_temp") ?? role("stove_temp");
    V.stove_power = stoveW != null ? this._fmtPower(stoveW) : stoveStatus ? (stoveStatus.state === "on" ? t.on : t.off) : "–";
    V.stove_temp = this._fmtTemp(stoveTemp);
    const sFlow = sch("stove_flow_temp");
    const sRet = sch("stove_return_temp");
    V.stove_flow_lbl = sFlow != null ? `VL ${this._fmtTemp(sFlow)}` : "";
    V.stove_ret_lbl = sRet != null ? `RL ${this._fmtTemp(sRet)}` : "";
    C.stove_flow = this._tempColor(sFlow ?? stoveTemp);
    C.stove_ret = this._tempColor(sRet);
    A.stove = stoveStatus?.state === "on" || (stoveW ?? 0) > 100;

    const hpHeat = this._sumW(this._system.power_sensors?.hp_heat);
    const hpEl = this._sumW(this._system.power_sensors?.hp_electric);
    V.hp_heat = hpHeat != null ? this._fmtPower(hpHeat) : "–";
    V.hp_el = hpEl != null ? this._fmtPower(hpEl) : "–";
    V.hp_cop = this._fmtStat("cop", 2);
    V.hp_factor = this._fmtStat("factor_now", 0);
    const ratio = this._num(this._stat("target_ratio_now"));
    if (ratio != null) V.hp_factor += ` · ${this._fmtNumber(ratio, 0)} % ${t.of_target}`;
    const demand = role("heat_pump_demand");
    V.hp_demand = demand != null ? `${this._fmtNumber(demand, 0)} %` : "–";
    V.hp_lift = this._fmtStat("lift", 1);
    const hFlow = sch("hp_flow_temp");
    const hRet = sch("hp_return_temp");
    V.hp_flow_lbl = hFlow != null ? `VL ${this._fmtTemp(hFlow)}` : "";
    V.hp_ret_lbl = hRet != null ? `RL ${this._fmtTemp(hRet)}` : "";
    C.hp_flow = this._tempColor(hFlow);
    C.hp_ret = this._tempColor(hRet);
    A.hp = (hpEl ?? 0) > 300 || (hpHeat ?? 0) > 100;
    const valve = role("hot_water_valve");
    plant.querySelectorAll("[data-valve]").forEach((el) => {
      const ww = el.dataset.valve === "ww";
      el.classList.toggle("on", valve != null && (ww ? valve > 0 : valve <= 0));
    });

    plant.querySelectorAll("[data-pv]").forEach((el) => (el.textContent = V[el.dataset.pv] ?? "–"));
    plant.querySelectorAll("[data-pc]").forEach((el) => el.style.setProperty("--c", C[el.dataset.pc]));
    plant.querySelectorAll("[data-pa]").forEach((el) => el.classList.toggle("active", !!A[el.dataset.pa]));

    const temps = this._tankIds().map((eid) => this._num(eid)).filter((v) => v != null);
    const tank = plant.querySelector("[data-ptank]");
    if (tank && temps.length) {
      const stops = temps.map((v, i) => `${this._tempColor(v)} ${Math.round((i / Math.max(temps.length - 1, 1)) * 100)}%`);
      tank.style.background = `linear-gradient(to bottom, ${stops.join(", ")})`;
    }
  }

  _fmtStat(key, digits) {
    const n = this._num(this._stat(key));
    return n == null ? "–" : this._fmtNumber(n, digits) + (key === "lift" ? " K" : "");
  }

  _render_overview() {
    const t = this._t;
    const soc = this._role("battery_soc");
    const tiles = [
      this._tile("mdi:solar-power-variant", COLORS.pv, t.pv, "pv_power"),
      this._tile("mdi:home", COLORS.house, t.house, "house_power"),
      this._tile("mdi:transmission-tower", COLORS.grid, t.grid, this._role("grid_power") ? "grid_power" : "grid_import"),
      soc
        ? `<div class="card tile" data-more="${esc(soc)}">
            <div class="head"><ha-icon icon="mdi:home-battery" style="color:${COLORS.battery}"></ha-icon>${t.battery}</div>
            <div class="big" data-fmt="${esc(soc)}">–</div>
            <div class="soc"><div data-soc="${esc(soc)}" style="width:0"></div></div>
            <div class="sub" data-battery-sub></div>
          </div>`
        : "",
      this._tile("mdi:heating-coil", COLORS.heat, t.heating_rod, "heating_rod_power"),
      this._tile("mdi:heat-pump", COLORS.heatpump, t.heat_pump, "heat_pump_power"),
      this._tile("mdi:car-electric", COLORS.ecar, t.ecar, "ecar_power"),
      this._tile("mdi:thermometer", COLORS.grid, t.outdoor, "outdoor_temp"),
      this._tile("mdi:water-boiler", COLORS.heat, t.hot_water, "hot_water_temp"),
      this._system.water_flow
        ? `<div class="card tile" data-more="${esc(this._system.water_flow)}">
            <div class="head"><ha-icon icon="mdi:water-pump" style="color:#29b6f6"></ha-icon>${t.water_flow}</div>
            <div class="big" data-fmt="${esc(this._system.water_flow)}">–</div>
          </div>`
        : "",
    ].join("");

    const chips = this._sources()
      .map(
        ({ key, label, color, icon }) => `<div class="chip" ${this._moreFor(key)}>
          <ha-icon icon="${icon}" style="color:${color}"></ha-icon>
          <div><small>${esc(label)}</small><b data-total="${esc(key)}">–</b></div></div>`
      )
      .join("");

    return `
      ${this._periodSwitch()}
      ${this._gauges()}
      ${chips ? `<div class="card"><h2>${t.energy_period} · <span data-period-label></span></h2><div class="chips">${chips}</div></div>` : ""}
      <div class="flows">
        <div class="card"><h2>${t.flow_el}</h2><div class="flowchart" data-flow="el"></div></div>
        <div class="card"><h2>${t.flow_th}</h2><div class="flowchart" data-flow="th"></div></div>
      </div>
      ${this._plant()}
      ${this._carCards()}
      <div class="grid">${tiles}</div>`;
  }

  // Day / week / month / year plus navigation to past periods, like the
  // date picker of the Home Assistant energy dashboard.
  _periodSwitch() {
    const t = this._t;
    const buttons = ["day", "week", "month", "year"]
      .map((x) => `<button class="${x === this._period ? "active" : ""}" data-period="${x}">${t[x]}</button>`)
      .join("");
    const now = this._offset === 0;
    return `<div class="periodbar">
        <div class="segmented">${buttons}</div>
        <div class="pnav">
          <button data-shift="-1" title="${t.previous}">‹</button>
          <span data-period-label></span>
          <button data-shift="1" title="${t.next}" ${now ? "disabled" : ""}>›</button>
          <button class="now ${now ? "active" : ""}" data-shift="0">${t.now}</button>
        </div>
      </div>`;
  }

  _periodLabel() {
    const { start, end } = this._periodRange();
    const lang = this._hass.language;
    const p = this._period;
    if (p === "day") return start.toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    if (p === "week") {
      const last = new Date(end.getTime() - 86400000);
      const fmt = (d) => d.toLocaleDateString(lang, { day: "numeric", month: "short" });
      return `${this._t.cw} ${isoWeek(start)} · ${fmt(start)} – ${fmt(last)}`;
    }
    if (p === "month") return start.toLocaleDateString(lang, { month: "long", year: "numeric" });
    return String(start.getFullYear());
  }

  // Energy sources with a counter, in display order.
  _sources() {
    const t = this._t;
    const meters = this._system.energy_meters || {};
    return [
      ["pv", t.pv, COLORS.pv, "mdi:solar-power-variant"],
      ["grid_import", t.grid_import, COLORS.grid, "mdi:transmission-tower-import"],
      ["grid_export", t.grid_export, COLORS.export, "mdi:transmission-tower-export"],
      ["battery_charge", t.battery_charged, COLORS.battery, "mdi:battery-arrow-up"],
      ["battery_discharge", t.battery_discharged, COLORS.battery, "mdi:battery-arrow-down"],
      ["consumption", t.consumption, COLORS.house, "mdi:home-lightning-bolt"],
      ["hp_electric", t.hp_electric, COLORS.heatpump, "mdi:heat-pump"],
      ["hp_heat", t.hp_heat, COLORS.heat, "mdi:fire"],
      ["heating_rod", t.heating_rod, COLORS.heat, "mdi:heating-coil"],
      ["stove_heat", t.stove, COLORS.heat, "mdi:fireplace"],
      ...(this._system.cars || []).map((c) => [c.id, c.name, COLORS.ecar, "mdi:car-electric"]),
      ...(this._system.loads || []).map((l) => [l.id, l.name, COLORS.house, l.icon || "mdi:power-plug"]),
      ["water", t.water, "#29b6f6", "mdi:water"],
    ]
      .filter(([key]) => meters[key])
      .map(([key, label, color, icon]) => ({ key, label, color, icon }));
  }

  _moreFor(key) {
    const eid = this._system.energy_meters?.[key]?.[0];
    return eid ? `data-more="${esc(eid)}"` : "";
  }

  // Totals of the selected period per source. For the running period the
  // integration's own sensors are used (they include the current hour).
  _totals() {
    const h = this._history?.key === this._historyKey() ? this._history.data : null;
    const live = this._offset === 0;
    const result = {};
    for (const key of Object.keys(this._system.energy_meters || {})) {
      const own = live ? this._num(this._stat(`${key}_${this._period}`)) : null;
      if (own != null) result[key] = own;
      else if (h?.series[key]) result[key] = h.series[key].reduce((a, v) => a + v, 0);
    }
    return result;
  }

  _periodKpis(tot) {
    const ratio = (a, b) => (a != null && b != null && b > 0.05 ? a / b : null);
    const pct = (v) => (v == null ? null : Math.max(0, Math.min(100, v * 100)));
    const generated = (tot.pv ?? 0) + (tot.grid_import ?? 0) + (tot.battery_discharge ?? 0);
    const consumption =
      tot.consumption ?? (generated > 0 ? generated - (tot.grid_export ?? 0) - (tot.battery_charge ?? 0) : null);
    const rod = tot.heating_rod ?? 0;
    return {
      autarky: tot.grid_import != null && consumption > 0.05 ? pct(1 - tot.grid_import / consumption) : null,
      self_consumption: tot.grid_export != null && tot.pv > 0.05 ? pct(1 - tot.grid_export / tot.pv) : null,
      work_ratio: ratio(tot.hp_heat, tot.hp_electric),
      work_ratio_rod: tot.hp_heat != null && tot.hp_electric != null && rod > 0 ? ratio(tot.hp_heat + rod, tot.hp_electric + rod) : null,
    };
  }

  // Live values for the small "now" line of the gauges.
  _liveKpis() {
    const pv = this._powerW("pv_power");
    const grid = this._gridSigned();
    const bat = this._batterySigned() ?? 0;
    const consumption = (pv ?? 0) + Math.max(grid ?? 0, 0) + Math.max(-bat, 0) - Math.max(-(grid ?? 0), 0) - Math.max(bat, 0);
    return {
      autarky: grid != null && consumption > 50 ? Math.max(0, Math.min(100, (1 - Math.max(grid, 0) / consumption) * 100)) : null,
      self_consumption: grid != null && pv > 50 ? Math.max(0, Math.min(100, (1 - Math.max(-grid, 0) / pv) * 100)) : null,
      work_ratio: this._num(this._stat("cop")),
    };
  }

  // The same gauges for every period, each with its live value.
  _gauges() {
    const t = this._t;
    const m = this._system.energy_meters || {};
    const gauges = [
      m.grid_import ? this._gauge("autarky", t.autarky, 100, "%", 0, COLORS.battery) : "",
      m.pv && m.grid_export ? this._gauge("self_consumption", t.self_consumption, 100, "%", 0, COLORS.pv) : "",
      m.hp_heat && m.hp_electric ? this._gauge("work_ratio", t.work_ratio, 6, "", 2, COLORS.heatpump, t.cop) : "",
      m.hp_heat && m.hp_electric && m.heating_rod ? this._gauge("work_ratio_rod", t.work_ratio_rod, 6, "", 2, COLORS.heat) : "",
    ].join("");
    return gauges ? `<div class="gauges">${gauges}</div>` : "";
  }

  // Semicircle gauge, like the gauges of the Home Assistant energy dashboard.
  _gauge(key, label, max, unit, digits, color, nowLabel) {
    const arc = "M 10 60 A 50 50 0 0 1 110 60";
    return `<div class="card gauge">
      <svg viewBox="0 0 120 68" aria-hidden="true">
        <path d="${arc}" class="track" pathLength="100"></path>
        <path d="${arc}" class="value" pathLength="100" style="stroke:${color}" data-kpi-arc="${key}" data-max="${max}"></path>
      </svg>
      <div class="gval" data-kpi="${key}" data-digits="${digits}" data-unit="${esc(unit)}">–</div>
      <div class="glbl">${esc(label)}</div>
      <div class="gnow" data-kpi-now="${key}" data-digits="${digits}" data-unit="${esc(unit)}" data-label="${esc(nowLabel || this._t.now)}"></div>
    </div>`;
  }

  _carCards() {
    const t = this._t;
    const cards = (this._system.cars || [])
      .map(
        (c) => `<div class="card car" data-more="${esc(c.soc || c.power || c.energy)}">
          <div class="uhead"><ha-icon icon="mdi:car-electric" style="color:${COLORS.ecar}"></ha-icon><span>${esc(c.name)}</span>
            <small data-car-state="${esc(c.id)}"></small></div>
          ${c.soc ? `<div class="soc car-soc"><div data-soc="${esc(c.soc)}" style="width:0;background:${COLORS.ecar}"></div></div>` : ""}
          <div class="hpgrid">
            ${c.soc ? `<div><small>${t.soc}</small><b data-fmt="${esc(c.soc)}">–</b></div>` : ""}
            ${c.power ? `<div><small>${t.charging}</small><b data-fmt-eid="${esc(c.power)}">–</b></div>` : ""}
            ${c.range ? `<div><small>${t.range}</small><b data-fmt="${esc(c.range)}">–</b></div>` : ""}
            ${this._system.energy_meters?.[c.id] ? `<div><small>${t.charged} · ${t[this._period]}</small><b data-total="${esc(c.id)}">–</b></div>` : ""}
          </div>
        </div>`
      )
      .join("");
    return cards ? `<div class="cars">${cards}</div>` : "";
  }

  _row(label, eid) {
    return `<div class="row" data-more="${esc(eid)}"><span class="name">${esc(label)}</span><span class="val" data-fmt="${esc(eid)}">–</span></div>`;
  }

  _box(title, rows) {
    const html = rows
      .map(([label, role]) => (this._role(role) ? this._row(label, this._role(role)) : ""))
      .join("");
    return html ? `<div class="card"><h2>${esc(title)}</h2><div class="rows">${html}</div></div>` : "";
  }

  _render_heating() {
    const t = this._t;
    const boxes = [
      this._box(t.controller, [
        [t.outdoor, "outdoor_temp"],
        [t.ww_target, "hot_water_target"],
        [t.ww_valve, "hot_water_valve"],
        [t.heating_rod, "heating_rod_percent"],
        [t.heat_pump, "heat_pump_percent"],
      ]),
      ...["hk1", "hk2"].map((hk) =>
        this._box(t[hk], [
          [t.flow, `${hk}_flow`],
          [t.flow_target, `${hk}_target`],
          [t.pump, `${hk}_pump`],
          [t.mixer_open, `${hk}_mixer_open`],
          [t.mixer_close, `${hk}_mixer_close`],
        ])
      ),
    ].join("");

    const label = (key, role) => {
      const eid = role === "heating_rod_temp" ? this._rodTempId() : this._role(role);
      return eid
        ? `<div class="lbl" data-more="${esc(eid)}"><small>${esc(t[key])}</small><b data-fmt="${esc(eid)}">–</b></div>`
        : "";
    };
    const tank = `<div class="tank" data-tank>
        ${label("heating_rod", "heating_rod_temp")}
        ${label("hot_water", "hot_water_temp")}
        ${label("tank_top", "tank_top")}
        ${label("tank_middle", "tank_middle")}
        ${label("tank_bottom", "tank_bottom")}
      </div>`;

    const action = (key, icon, label) => {
      const eid = this._system.buttons?.[key];
      return eid
        ? `<div class="card action">
            <ha-icon icon="${icon}" style="color:${COLORS.heat}"></ha-icon>
            <div class="grow"><b>${label}</b><div class="sub" data-quick-status="${esc(eid)}"></div></div>
            <button class="pill" data-press="${esc(eid)}">${t.start}</button>
          </div>`
        : "";
    };
    const actions =
      action("hot_water_quick_load", "mdi:water-boiler-alert", t.quick_load) +
      action("heating_rod_boost", "mdi:heating-coil", t.rod_boost);

    return `<div class="heating"><div>${actions}${boxes}</div><div class="card tank-wrap">${tank}</div></div>`;
  }

  _stack(id, label) {
    return `<div class="flow-label"><span>${esc(label)}</span><span data-stack-sum="${id}"></span></div>
      <div class="bar" data-stack="${id}"></div><div class="legend" data-stack-legend="${id}"></div>`;
  }

  _totalRow(label, key) {
    return `<div class="row" ${this._moreFor(key)}><span class="name">${esc(label)}</span><span class="val" data-total="${esc(key)}">–</span></div>`;
  }

  _kpiRow(label, key) {
    return `<div class="row"><span class="name">${esc(label)}</span><span class="val" data-kpi="${key}" data-digits="2" data-unit="">–</span></div>`;
  }

  _render_stats() {
    const t = this._t;
    const p = this._period;
    // Values the integration only integrates for the running periods.
    const live = this._offset === 0;

    const meters = this._system.energy_meters || {};
    const heat = ["hp_heat", "stove_heat", "heating_rod", "hc1_heat", "hc2_heat"].some((k) => meters[k]);
    const has = (...keys) => keys.some((k) => meters[k]);
    const chart = (id, title) => `<div class="card"><h2>${esc(title)} · ${t.history}</h2><div class="chart" data-chart="${id}">${t.loading_history}</div></div>`;
    const charts = [
      has("pv", "grid_import", "grid_export", "consumption") ? chart("power", t.electricity) : "",
      has("hp_heat", "hp_electric") ? chart("hp", t.heat_pump) : "",
      has("stove_heat", "heating_rod") && has("hp_heat") ? chart("heat", t.heat_generation) : "",
      (this._system.cars || []).some((c) => meters[c.id]) ? chart("cars", t.cars) : "",
      (this._system.loads || []).some((l) => meters[l.id]) ? chart("loads", t.consumers) : "",
      has("water") ? chart("water", t.water) : "",
    ].join("");

    // Filter chips: single PV systems and cars can be hidden in the charts.
    const filterItems = [
      ...((meters.pv || []).length > 1
        ? meters.pv.map((eid) => [eid, this._hass.states[eid]?.attributes.friendly_name || eid, COLORS.pv])
        : []),
      ...(this._system.cars || []).filter((c) => meters[c.id]).map((c) => [c.id, c.name, COLORS.ecar]),
    ];
    const filters = filterItems.length
      ? `<div class="filters">${filterItems
          .map(
            ([id, label, color]) =>
              `<button class="${this._hidden.has(id) ? "off" : ""}" data-toggle="${esc(id)}"><i style="background:${color}"></i>${esc(label)}</button>`
          )
          .join("")}</div>`
      : "";

    const heatKeys = ["hp_heat", "hp_electric", "heating_rod", "stove_heat"];
    const elecRows = this._sources()
      .filter((s) => !heatKeys.includes(s.key) || s.key === "hp_electric")
      .map((s) => this._totalRow(s.label, s.key))
      .join("");

    const hpRows = [
      ...[
        [t.hp_heat, "hp_heat"],
        [t.hp_electric, "hp_electric"],
        [t.heating_rod, "heating_rod"],
      ]
        .filter(([, key]) => meters[key])
        .map(([label, key]) => this._totalRow(label, key)),
      meters.hp_heat && meters.hp_electric ? this._kpiRow(t.work_ratio, "work_ratio") : "",
      meters.hp_heat && meters.hp_electric && meters.heating_rod ? this._kpiRow(t.work_ratio_rod, "work_ratio_rod") : "",
      // Lift, factor and datasheet comparison are integrated live, so only for running periods.
      ...(live
        ? [
            [t.lift_avg, `lift_${p}`],
            [t.factor, `factor_${p}`],
            [t.factor_target, `factor_target_${p}`],
            [t.target_ratio, `target_ratio_${p}`],
          ]
            .filter(([, key]) => this._stat(key))
            .map(([label, key]) => this._row(label, this._stat(key)))
        : []),
    ].join("");
    const hpCard = hpRows
      ? `<div class="card"><h2>${t.heat_pump} + ${t.heating_rod}</h2><div class="rows">${hpRows}</div></div>`
      : "";
    const pvCard =
      (meters.pv || []).length > 1
        ? `<div class="card"><h2>${t.pv_systems}</h2><div class="rows" data-pv-systems></div></div>`
        : "";

    const runtime = live && this._stat(`heating_rod_runtime_${p}`);
    const rodCard =
      meters.heating_rod && runtime
        ? `<div class="card"><h2>${t.heating_rod}</h2><div class="rows">
            ${this._totalRow(t.energy, "heating_rod")}
            ${this._row(t.runtime, runtime)}
            <div class="row"><span class="name">${t.avg_power}</span><span class="val" data-rod-avg></span></div></div></div>`
        : "";

    const hasMeters = Object.keys(meters).some((k) => /^(pv|hp_|hc\d|stove)/.test(k));
    return `
      ${this._periodSwitch()}
      ${this._gauges()}
      ${filters}
      ${charts}
      ${heat ? `<div class="card"><h2>${t.heat_generation} / ${t.heat_distribution}</h2>
          ${this._stack("heat_gen", t.heat_generation)}${this._stack("heat_dist", t.heat_distribution)}</div>` : ""}
      <div class="stats-cols">
        ${elecRows ? `<div class="card"><h2>${t.electricity}</h2><div class="rows">${elecRows}</div></div>` : ""}
        ${hpCard}
        ${pvCard}
        ${rodCard}
      </div>
      ${hasMeters ? "" : `<p class="hint">${t.no_meters}</p>`}
      <p class="hint">${t.since_note}</p>`;
  }

  _render_control() {
    const t = this._t;
    const sys = this._system;
    const groups = sys.modules
      .map((mod) => {
        const items = sys.items.filter((i) => i.module === mod.id && (i.switch || i.slider) && i.entities.value);
        if (!items.length) return "";
        const rows = items
          .map((i) => {
            const eid = i.entities.value;
            const mode = i.entities.mode;
            const input = i.switch
              ? `<label class="toggle"><input type="checkbox" data-switch="${esc(eid)}"><span></span></label>`
              : i.unit === "W"
                ? `<span class="num" data-fmt="${esc(eid)}">–</span>`
                : `<input type="range" min="0" max="100" step="1" data-range="${esc(eid)}"><span class="num" data-fmt="${esc(eid)}">–</span>`;
            const modeSel = mode
              ? `<select data-mode="${esc(mode)}"><option value="auto">${t.auto}</option><option value="manual">${t.manual}</option></select>`
              : "";
            return `<div class="ctrl" data-ctrl-mode="${esc(mode || "")}">
                <span class="name" data-more="${esc(eid)}">${esc(i.name)}</span>
                <span class="inputs">${input}${modeSel}</span>
              </div>`;
          })
          .join("");
        return `<div class="card"><h2>${esc(mod.name)}</h2>${rows}</div>`;
      })
      .join("");
    const allAuto = sys.buttons?.all_automatic;
    const head = `<div class="card action">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <div class="grow sub">${t.mode_hint}</div>
        ${allAuto ? `<button class="pill" data-press="${esc(allAuto)}">${t.all_auto}</button>` : ""}
      </div>`;
    return groups ? `${head}${groups}` : `<div class="empty">${t.no_controls}</div>`;
  }

  _render_values() {
    const sys = this._system;
    const groups = sys.modules
      .map((mod) => {
        const rows = sys.items
          .filter((i) => i.module === mod.id)
          .flatMap((i) =>
            Object.entries(i.entities)
              .filter(([role]) => role !== "mode")
              .map(([, eid]) => {
                const s = this._hass.states[eid];
                const prefix = `EMS ${mod.name} `;
                const friendly = s?.attributes.friendly_name || i.name;
                const name = friendly.startsWith(prefix) ? friendly.slice(prefix.length) : friendly;
                return `<div class="row" data-more="${esc(eid)}" data-search="${esc((name + " " + eid).toLowerCase())}">
                    <span class="name">${esc(name)}</span><span class="val" data-fmt="${esc(eid)}">–</span></div>`;
              })
          )
          .join("");
        return rows ? `<div class="card" data-group><h2>${esc(mod.name)}</h2><div class="rows">${rows}</div></div>` : "";
      })
      .join("");
    return `<input class="search" type="search" placeholder="${this._t.search}" data-filter>${groups}`;
  }

  _bind(main) {
    main.querySelectorAll("[data-more]").forEach((el) =>
      el.addEventListener("click", (ev) => {
        if (ev.target.closest("input, select, label")) return;
        ev.stopPropagation();
        this._moreInfo(el.dataset.more);
      })
    );
    main.querySelectorAll("[data-switch]").forEach((el) =>
      el.addEventListener("change", () =>
        this._hass.callService("switch", el.checked ? "turn_on" : "turn_off", { entity_id: el.dataset.switch })
      )
    );
    main.querySelectorAll("[data-range]").forEach((el) =>
      el.addEventListener("change", () =>
        this._hass.callService("number", "set_value", { entity_id: el.dataset.range, value: Number(el.value) })
      )
    );
    main.querySelectorAll("[data-mode]").forEach((el) =>
      el.addEventListener("change", () =>
        this._hass.callService("select", "select_option", { entity_id: el.dataset.mode, option: el.value })
      )
    );
    main.querySelectorAll("[data-period]").forEach((el) =>
      el.addEventListener("click", () => {
        this._period = el.dataset.period;
        this._offset = 0;
        this._renderShell();
      })
    );
    main.querySelectorAll("[data-shift]").forEach((el) =>
      el.addEventListener("click", () => {
        const step = Number(el.dataset.shift);
        this._offset = step === 0 ? 0 : Math.min(0, this._offset + step);
        this._renderShell();
      })
    );
    main.querySelectorAll("[data-toggle]").forEach((el) =>
      el.addEventListener("click", () => {
        const id = el.dataset.toggle;
        if (this._hidden.has(id)) this._hidden.delete(id);
        else this._hidden.add(id);
        el.classList.toggle("off", this._hidden.has(id));
        this._drawCharts(this.shadowRoot.querySelector("main"));
      })
    );
    main.querySelectorAll("[data-press]").forEach((el) =>
      el.addEventListener("click", () =>
        this._hass.callService("button", "press", { entity_id: el.dataset.press })
      )
    );
    const filter = main.querySelector("[data-filter]");
    if (filter) {
      filter.addEventListener("input", () => {
        const q = filter.value.trim().toLowerCase();
        main.querySelectorAll("[data-group]").forEach((group) => {
          let visible = 0;
          group.querySelectorAll("[data-search]").forEach((row) => {
            const show = !q || row.dataset.search.includes(q);
            row.style.display = show ? "" : "none";
            if (show) visible++;
          });
          group.style.display = visible ? "" : "none";
        });
      });
    }
  }

  // ---------- live updates ----------

  _update() {
    const main = this.shadowRoot?.querySelector("main");
    if (!main || !this._system || !this._hass) return;
    const active = this.shadowRoot.activeElement;

    main.querySelectorAll("[data-fmt]").forEach((el) => (el.textContent = this._fmt(el.dataset.fmt)));
    main.querySelectorAll("[data-fmt-eid]").forEach((el) => {
      const s = this._state(el.dataset.fmtEid);
      el.textContent =
        s && s.attributes.unit_of_measurement === "W" ? this._fmtPower(parseFloat(s.state)) : this._fmt(el.dataset.fmtEid);
    });
    main.querySelectorAll("[data-soc]").forEach((el) => (el.style.width = `${Math.max(0, Math.min(100, this._num(el.dataset.soc) ?? 0))}%`));
    main.querySelectorAll("[data-switch]").forEach((el) => {
      const s = this._state(el.dataset.switch);
      el.checked = s?.state === "on";
      el.disabled = !s;
    });
    main.querySelectorAll("[data-range]").forEach((el) => {
      if (el === active) return;
      const n = this._num(el.dataset.range);
      if (n != null) el.value = n;
      el.disabled = n == null;
    });
    main.querySelectorAll("[data-mode]").forEach((el) => {
      if (el === active) return;
      const s = this._state(el.dataset.mode);
      if (s) el.value = s.state;
      el.closest(".ctrl")?.classList.toggle("manual", s?.state === "manual");
    });

    this._updateFlow(main);
    this._updateBattery(main);
    this._updateTank(main);
    this._updatePlant(main);
    main.querySelectorAll("[data-power-role]").forEach((el) => (el.textContent = this._fmtPower(this._powerW(el.dataset.powerRole))));
    this._updateStats(main);
    this._updateQuickLoad(main);
    this._updatePeriodValues(main);
    this._updateHistory(main);
    this._updateFlowCharts(main);
  }

  // Totals, gauges and period label of the selected period.
  _updatePeriodValues(main) {
    const tot = this._totals();
    const kpis = this._periodKpis(tot);
    const now = this._offset === 0 ? this._liveKpis() : {};
    const fmt = (n, el) =>
      n == null ? "–" : `${this._fmtNumber(n, Number(el.dataset.digits))}${el.dataset.unit ? ` ${el.dataset.unit}` : ""}`;

    main.querySelectorAll("[data-period-label]").forEach((el) => (el.textContent = this._periodLabel()));
    main.querySelectorAll("[data-total]").forEach((el) => {
      const v = tot[el.dataset.total];
      const water = el.dataset.total === "water";
      el.textContent = v == null ? "–" : `${this._fmtNumber(v, water ? 0 : 1)} ${water ? "L" : "kWh"}`;
    });
    main.querySelectorAll("[data-kpi]").forEach((el) => (el.textContent = fmt(kpis[el.dataset.kpi], el)));
    main.querySelectorAll("[data-kpi-arc]").forEach((el) => {
      const n = kpis[el.dataset.kpiArc];
      const ratio = n == null ? 0 : Math.max(0, Math.min(1, n / Number(el.dataset.max)));
      el.style.strokeDasharray = `${ratio * 100} 100`;
    });
    main.querySelectorAll("[data-kpi-now]").forEach((el) => {
      const n = now[el.dataset.kpiNow];
      el.textContent = n == null ? "" : `${el.dataset.label} ${fmt(n, el)}`;
    });
  }

  // ---------- energy flow diagrams ----------

  // Signed grid power in W (+ import, − export).
  _gridSigned() {
    if (this._system.power_sensors?.grid?.length) return this._powerW("grid_power");
    const signed = this._num(this._role("grid_power"));
    if (signed != null) return signed;
    const imp = this._powerW("grid_import");
    const exp = this._powerW("grid_export");
    return imp == null && exp == null ? null : (imp ?? 0) - (exp ?? 0);
  }

  // Signed battery power in W (+ charging, − discharging).
  _batterySigned() {
    if (this._system.power_sensors?.battery?.length) return this._powerW("battery_power");
    const charge = this._powerW("battery_charge");
    const discharge = this._powerW("battery_discharge");
    if (charge != null || discharge != null) return (charge ?? 0) - (discharge ?? 0);
    return this._num(this._role("battery_power"));
  }

  _pct(eid) {
    const n = this._num(eid);
    return n == null ? "" : `${this._fmtNumber(n, 0)} %`;
  }

  // Nodes of a diagram. dir: +1 = energy flows towards the hub, −1 = away.
  _flowSpec(kind) {
    const t = this._t;
    const sys = this._system;
    const node = (id, label, icon, color, w, extra = {}) => ({ id, label, icon, color, w, ...extra });
    const copText = () => {
      const cop = this._num(this._stat("cop"));
      return cop == null ? "" : `COP ${this._fmtNumber(cop, 2)}`;
    };

    if (kind === "el") {
      const left = [];
      if (this._ids("pv_power").length) left.push(node("pv", t.pv, "mdi:solar-power-variant", COLORS.pv, this._powerW("pv_power"), { dir: 1 }));
      const grid = this._gridSigned();
      if (grid != null)
        left.push(node("grid", t.grid, "mdi:transmission-tower", COLORS.grid, Math.abs(grid), {
          dir: grid >= 0 ? 1 : -1,
          sub: Math.abs(grid) > 20 ? (grid > 0 ? t.grid_import : t.grid_export) : "",
        }));
      const bat = this._batterySigned();
      const soc = this._role("battery_soc");
      if (bat != null || soc)
        left.push(node("bat", t.battery, "mdi:home-battery", COLORS.battery, Math.abs(bat ?? 0), { dir: (bat ?? 0) > 0 ? -1 : 1, sub: this._pct(soc), more: soc }));

      // Consumers, grouped: heat, cars, further consumers, rest.
      const right = [];
      if (this._ids("heat_pump_power").length)
        right.push(node("hp", t.heat_pump, "mdi:heat-pump", COLORS.heatpump, this._powerW("heat_pump_power"), { sub: copText() }));
      const rod = this._rodNode(node, COLORS.heat);
      if (rod) right.push(rod);
      const cars = sys.cars || [];
      cars.forEach((c) =>
        right.push(node(c.id, c.name, "mdi:car-electric", COLORS.ecar, c.power ? this._sumW([c.power]) : null, {
          sub: [this._pct(c.soc), this._fmtState(c.range)].filter(Boolean).join(" · "),
          more: c.soc || c.power,
        }))
      );
      if (!cars.length && this._ids("ecar_power").length)
        right.push(node("car", t.ecar, "mdi:car-electric", COLORS.ecar, this._powerW("ecar_power")));
      (sys.loads || []).forEach((l) =>
        right.push(node(l.id, l.name, l.icon || "mdi:power-plug", COLORS.house, l.power ? this._sumW([l.power]) : null, {
          sub: this._fmtTempOpt(this._num(l.temp)),
          more: l.power || l.temp,
        }))
      );

      const inflow = left.reduce((a, n) => a + (n.dir > 0 ? n.w ?? 0 : 0), 0);
      const outflow = left.reduce((a, n) => a + (n.dir < 0 ? n.w ?? 0 : 0), 0);
      const consumption = Math.max(0, inflow - outflow);
      const known = right.reduce((a, n) => a + Math.max(0, n.w ?? 0), 0);
      right.push(node("other", t.other, "mdi:home-outline", COLORS.house, Math.max(0, consumption - known)));
      const hub = node("house", t.house, "mdi:home", COLORS.house, consumption, { more: this._role("house_power") });
      return { left, hub, right };
    }

    const ps = sys.power_sensors || {};
    const left = [];
    if (ps.hp_heat?.length) left.push(node("hp", t.heat_pump, "mdi:heat-pump", COLORS.heatpump, this._sumW(ps.hp_heat), { dir: 1, sub: copText(), more: ps.hp_heat[0] }));
    if (ps.stove_heat?.length || this._schema("stove_temp"))
      left.push(node("stove", t.stove, "mdi:fireplace", COLORS.heat, this._sumW(ps.stove_heat), { dir: 1, sub: this._fmtTempOpt(this._num(this._schema("stove_temp") || this._role("stove_temp"))) }));
    const rod = this._rodNode(node, COLORS.pv);
    if (rod) left.push({ ...rod, dir: 1 });

    const right = [];
    for (const n of [1, 2]) {
      const eid = this._schema(`hc${n}_heat_power`);
      if (eid || this._role(`hk${n}_flow`))
        right.push(node(`hc${n}`, t[`hk${n}`], "mdi:radiator", COLORS.house, eid ? this._sumW([eid]) : null, {
          sub: this._fmtTempOpt(this._num(this._schema(`hc${n}_flow_temp`) || this._role(`hk${n}_flow`))),
          more: eid || this._role(`hk${n}_flow`),
        }));
    }
    if (this._role("hot_water_temp")) {
      const valve = this._num(this._role("hot_water_valve"));
      right.push(node("ww", t.hot_water, "mdi:shower-head", COLORS.heat, null, {
        sub: this._fmtTempOpt(this._num(this._role("hot_water_temp"))),
        active: valve != null && valve > 0,
        more: this._role("hot_water_temp"),
      }));
    }
    const tank = this._tankIds();
    const heatIn = left.reduce((a, n) => a + Math.max(0, n.w ?? 0), 0);
    const hub = node("tank", t.tank, "mdi:storage-tank", COLORS.heat, heatIn, {
      sub: this._fmtTempOpt(this._num(tank[0])),
      more: tank[0],
    });
    return { left, hub, right };
  }

  _fmtTempOpt(value) {
    return value == null ? "" : `${this._fmtNumber(value, 1)} °C`;
  }

  _fmtState(eid) {
    return eid && this._state(eid) ? this._fmt(eid) : "";
  }

  // Heating rod: power from the meter (external or Rennergy), else its 0-100 %.
  _rodNode(node, color) {
    const t = this._t;
    const hasPower = this._ids("heating_rod_power").length;
    const pctEid = this._role("heating_rod_percent");
    if (!hasPower && !pctEid) return null;
    const pct = this._num(pctEid);
    return node("rod", t.heating_rod, "mdi:heating-coil", color, hasPower ? this._powerW("heating_rod_power") : null, {
      sub: pct != null && pct > 0 ? `${this._fmtNumber(pct, 0)} %` : "",
      active: hasPower ? undefined : (pct ?? 0) > 0,
      more: this._role("heating_rod_power") || pctEid,
    });
  }

  _updateFlowCharts(main) {
    main.querySelectorAll("[data-flow]").forEach((el) => {
      const spec = this._flowSpec(el.dataset.flow);
      if (!spec.left.length && !spec.right.length) {
        el.closest(".card").style.display = "none";
        return;
      }
      const sig = [...spec.left, spec.hub, ...spec.right].map((n) => n.id).join(",");
      if (el.dataset.sig !== sig) {
        el.dataset.sig = sig;
        el.innerHTML = this._flowLayout(spec);
        this._bind(el);
      }
      const all = [...spec.left, ...spec.right];
      const max = Math.max(1000, ...all.map((n) => n.w ?? 0));
      for (const n of [...all, spec.hub]) {
        const box = el.querySelector(`[data-fn="${n.id}"]`);
        if (!box) continue;
        const w = n.w ?? null;
        const active = n.active ?? (w ?? 0) > 20;
        box.classList.toggle("active", active || n === spec.hub);
        box.querySelector("b").textContent = w == null ? "" : this._fmtPower(w);
        box.querySelector("small").textContent = n.sub || "";
        const line = el.querySelector(`[data-fl="${n.id}"]`);
        if (line) {
          line.classList.toggle("active", active);
          // Flow direction: left nodes feed the hub unless dir is −1.
          const reverse = spec.left.includes(n) ? n.dir < 0 : false;
          line.classList.toggle("reverse", reverse);
          line.style.strokeWidth = active ? 1.5 + 5 * Math.min(1, (w ?? 0) / max) : 1.5;
        }
      }
    });
  }

  // Sources (left) and hub are circles, consumers (right) a compact list.
  // Heights are in px, so nothing overlaps; only the width scales.
  _flowLayout(spec) {
    const W = 600;
    const CIRCLE_ROW = 118;
    const LIST_ROW = 58;
    const H = Math.max(spec.left.length * CIRCLE_ROW, spec.right.length * LIST_ROW, 2 * CIRCLE_ROW) + 8;
    const xs = { left: 58, hub: 190, list: 290 };
    const hubY = H / 2;
    const listTop = (H - spec.right.length * LIST_ROW) / 2;
    const paths = [];
    const nodes = [];
    const more = (n) => (n.more ? `data-more="${esc(n.more)}"` : "");
    const circle = (n, x, y) =>
      nodes.push(`<div class="fnode" data-fn="${esc(n.id)}" ${more(n)}
        style="left:${(x / W) * 100}%;top:${y}px;--c:${n.color}">
        <small></small><ha-icon icon="${esc(n.icon)}"></ha-icon><b>–</b><span class="flbl">${esc(n.label)}</span></div>`);
    spec.left.forEach((n, i) => {
      const y = ((i + 0.5) * H) / spec.left.length;
      const mx = (xs.left + xs.hub) / 2;
      paths.push(`<path data-fl="${esc(n.id)}" d="M ${xs.left} ${y} C ${mx} ${y}, ${mx} ${hubY}, ${xs.hub} ${hubY}" style="stroke:${n.color}"/>`);
      circle(n, xs.left, y);
    });
    spec.right.forEach((n, i) => {
      const y = listTop + (i + 0.5) * LIST_ROW;
      const mx = (xs.hub + xs.list) / 2;
      paths.push(`<path data-fl="${esc(n.id)}" d="M ${xs.hub} ${hubY} C ${mx} ${hubY}, ${mx} ${y}, ${xs.list} ${y}" style="stroke:${n.color}"/>`);
      nodes.push(`<div class="fpill" data-fn="${esc(n.id)}" ${more(n)} style="left:${(xs.list / W) * 100}%;top:${y}px;--c:${n.color}">
          <span class="ic"><ha-icon icon="${esc(n.icon)}"></ha-icon></span>
          <span class="txt"><span class="nm">${esc(n.label)}</span><small></small></span><b>–</b></div>`);
    });
    circle(spec.hub, xs.hub, hubY);
    return `<div class="fwrap" style="height:${H}px">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${paths.join("")}</svg>${nodes.join("")}</div>`;
  }

  // ---------- history charts (long-term statistics of Home Assistant) ----------

  _periodRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const p = this._period;
    if (p === "week") start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    if (p === "month") start.setDate(1);
    if (p === "year") start.setMonth(0, 1);
    // Past periods: this._offset is 0 for the running one, −1 for the one before, …
    const o = this._offset;
    if (p === "day") start.setDate(start.getDate() + o);
    if (p === "week") start.setDate(start.getDate() + 7 * o);
    if (p === "month") start.setMonth(start.getMonth() + o);
    if (p === "year") start.setFullYear(start.getFullYear() + o);
    const end = new Date(start);
    if (p === "day") end.setDate(end.getDate() + 1);
    if (p === "week") end.setDate(end.getDate() + 7);
    if (p === "month") end.setMonth(end.getMonth() + 1);
    if (p === "year") end.setFullYear(end.getFullYear() + 1);
    const unit = { day: "hour", week: "day", month: "day", year: "month" }[p];
    const buckets = [];
    for (const d = new Date(start); d < end; ) {
      buckets.push(new Date(d));
      if (unit === "hour") d.setHours(d.getHours() + 1);
      else if (unit === "day") d.setDate(d.getDate() + 1);
      else d.setMonth(d.getMonth() + 1);
    }
    return { start, end, unit, buckets };
  }

  _bucketKey(date, unit) {
    const d = new Date(date);
    if (unit === "hour") return `${d.getDate()}-${d.getHours()}`;
    if (unit === "day") return `${d.getMonth()}-${d.getDate()}`;
    return `${d.getFullYear()}-${d.getMonth()}`;
  }

  _historyKey() {
    return `${this._systemIndex}-${this._period}-${this._offset}`;
  }

  _updateHistory(main) {
    if (!main.querySelector("[data-chart], [data-pv-systems], [data-total], [data-kpi]")) return;
    const key = this._historyKey();
    // Past periods do not change any more; the running one is reloaded every 5 minutes.
    const maxAge = this._offset === 0 ? 5 * 60 * 1000 : Infinity;
    const fresh = this._history && this._history.key === key && Date.now() - this._history.at < maxAge;
    if (fresh) {
      if (this._history.data && !this._history.drawn) this._drawCharts(main);
      return;
    }
    if (this._historyLoading === key) return;
    this._historyLoading = key;
    this._loadHistory(key).then(() => {
      this._historyLoading = null;
      const m = this.shadowRoot?.querySelector("main");
      if (m && key === this._historyKey()) {
        this._drawCharts(m);
        this._updatePeriodValues(m);
        this._updateStats(m);
      }
    });
  }

  async _loadHistory(key) {
    const meters = this._system.energy_meters || {};
    const ids = [...new Set(Object.values(meters).flat())];
    const range = this._periodRange();
    let result = {};
    if (ids.length) {
      try {
        result = await this._hass.callWS({
          type: "recorder/statistics_during_period",
          start_time: range.start.toISOString(),
          end_time: range.end.toISOString(),
          statistic_ids: ids,
          period: range.unit,
          types: ["change"],
          units: { energy: "kWh", volume: "L" },
        });
      } catch (err) {
        console.error("EMS: loading statistics failed", err);
      }
    }
    // Per entity: values per bucket.
    const index = new Map(range.buckets.map((b, i) => [this._bucketKey(b, range.unit), i]));
    const byEntity = {};
    for (const [eid, rows] of Object.entries(result || {})) {
      const values = range.buckets.map(() => 0);
      for (const row of rows) {
        const i = index.get(this._bucketKey(row.start, range.unit));
        if (i != null && row.change > 0) values[i] += row.change;
      }
      byEntity[eid] = values;
    }
    const series = {};
    for (const [source, list] of Object.entries(meters)) {
      const values = range.buckets.map(() => 0);
      let found = false;
      for (const eid of list) {
        if (!byEntity[eid]) continue;
        found = true;
        byEntity[eid].forEach((v, i) => (values[i] += v));
      }
      if (found) series[source] = values;
    }
    this._history = { key, at: Date.now(), data: { range, series, byEntity }, drawn: false };
  }

  _drawCharts(main) {
    const h = this._history?.key === this._historyKey() ? this._history.data : null;
    if (!h) return;
    this._history.drawn = true;
    const t = this._t;
    const s = h.series;
    const neg = (v) => v && v.map((x) => -x);
    const meters = this._system.energy_meters || {};
    const shown = (id) => !this._hidden.has(id);
    // Several PV systems are stacked one by one, each in its own shade.
    const pvIds = meters.pv || [];
    const pvShades = [COLORS.pv, "#d99a00", "#f7d154", "#b37f00", "#ffe08a"];
    const pv =
      pvIds.length > 1
        ? pvIds.filter(shown).map((eid, i) => ({
            label: this._hass.states[eid]?.attributes.friendly_name || eid,
            color: pvShades[pvIds.indexOf(eid) % pvShades.length],
            values: h.byEntity[eid],
          }))
        : [{ label: t.pv, color: COLORS.pv, values: s.pv }];
    const palette = [COLORS.ecar, "#d36bd1", "#6b8ef2", "#4fc3b0", "#e57373", "#90a4ae"];
    const sets = {
      power: [
        ...pv,
        { label: t.battery_discharged, color: COLORS.battery, values: s.battery_discharge },
        { label: t.grid_import, color: COLORS.grid, values: s.grid_import },
        { label: t.grid_export, color: COLORS.export, values: neg(s.grid_export) },
        { label: t.battery_charged, color: "color-mix(in srgb, var(--rn-battery) 55%, transparent)", values: neg(s.battery_charge) },
      ],
      hp: [
        { label: t.thermal, color: COLORS.heat, values: s.hp_heat, group: 0 },
        { label: t.electric, color: COLORS.heatpump, values: s.hp_electric, group: 1 },
        // The heating rod stacks on the electricity of the heat pump.
        { label: t.heating_rod, color: COLORS.pv, values: s.heating_rod, group: 1 },
        {
          label: t.work_ratio,
          color: "var(--primary-text-color)",
          line: true,
          values: s.hp_heat && s.hp_electric ? s.hp_heat.map((v, i) => (s.hp_electric[i] > 0.05 ? v / s.hp_electric[i] : null)) : null,
        },
      ],
      heat: [
        { label: t.heat_pump, color: COLORS.heatpump, values: s.hp_heat },
        { label: t.stove, color: COLORS.heat, values: s.stove_heat },
        { label: t.heating_rod, color: COLORS.pv, values: s.heating_rod },
      ],
      cars: (this._system.cars || [])
        .map((c, i) => ({ id: c.id, label: c.name, color: palette[i % palette.length], values: s[c.id] }))
        .filter((c) => shown(c.id)),
      loads: (this._system.loads || []).map((l, i) => ({
        label: l.name,
        color: palette[(i + 3) % palette.length],
        values: s[l.id],
      })),
      water: [{ label: t.water, color: "#29b6f6", values: s.water }],
    };
    main.querySelectorAll("[data-chart]").forEach((el) => {
      const series = (sets[el.dataset.chart] || []).filter((x) => x.values);
      el.innerHTML = this._barChart(series, h.range, el.dataset.chart === "water" ? "L" : "kWh");
    });

    const pvEl = main.querySelector("[data-pv-systems]");
    if (pvEl) {
      pvEl.innerHTML = (this._system.energy_meters?.pv || [])
        .map((eid) => {
          const sum = (h.byEntity[eid] || []).reduce((a, v) => a + v, 0);
          const name = this._hass.states[eid]?.attributes.friendly_name || eid;
          return `<div class="row" data-more="${esc(eid)}"><span class="name">${esc(name)}</span>
            <span class="val">${this._fmtNumber(sum, 1)} kWh</span></div>`;
        })
        .join("");
      this._bind(pvEl);
    }
  }

  // Bar chart as inline SVG: positive values stack upwards, negative ones
  // downwards, "group" draws bars side by side, "line" uses a second axis.
  _barChart(series, range, unit = "kWh") {
    const digits = unit === "L" ? 0 : 1;
    const t = this._t;
    const bars = series.filter((x) => !x.line);
    const lines = series.filter((x) => x.line);
    const n = range.buckets.length;
    const total = bars.reduce((a, x) => a + x.values.reduce((b, v) => b + Math.abs(v), 0), 0);
    if (!n || total < 0.01) return `<p class="hint">${t.no_history}</p>`;

    const groups = [...new Set(bars.map((x) => x.group ?? 0))];
    let maxPos = 0;
    let maxNeg = 0;
    for (let i = 0; i < n; i++) {
      for (const g of groups) {
        const inGroup = bars.filter((x) => (x.group ?? 0) === g);
        maxPos = Math.max(maxPos, inGroup.reduce((a, x) => a + Math.max(0, x.values[i]), 0));
        maxNeg = Math.max(maxNeg, inGroup.reduce((a, x) => a + Math.max(0, -x.values[i]), 0));
      }
    }
    const nice = (v) => {
      if (v <= 0) return 0;
      const exp = Math.pow(10, Math.floor(Math.log10(v)));
      return [1, 2, 2.5, 5, 10].map((m) => m * exp).find((m) => m >= v);
    };
    const step = nice((maxPos + maxNeg) / 4) || 1;
    const top = Math.ceil(maxPos / step) * step;
    const bottom = Math.ceil(maxNeg / step) * step;

    const W = 640, H = 220, L = 40, R = lines.length ? 34 : 8, T = 8, B = 22;
    const pw = W - L - R, ph = H - T - B;
    const y = (v) => T + ((top - v) / (top + bottom || 1)) * ph;
    const slot = pw / n;
    const bw = (slot * 0.72) / groups.length;
    const parts = [];

    for (let v = -bottom; v <= top + 1e-9; v += step) {
      const yy = y(v);
      parts.push(`<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" class="${Math.abs(v) < 1e-9 ? "zero" : "gridline"}"/>`);
      parts.push(`<text x="${L - 6}" y="${yy + 4}" text-anchor="end">${this._fmtNumber(Math.abs(v) < 1e-9 ? 0 : v, step < 1 ? 1 : 0)}</text>`);
    }

    for (let i = 0; i < n; i++) {
      groups.forEach((g, gi) => {
        let pos = 0;
        let negSum = 0;
        const x = L + i * slot + slot * 0.14 + gi * bw;
        for (const s of bars.filter((b) => (b.group ?? 0) === g)) {
          const v = s.values[i];
          if (!v) continue;
          const from = v > 0 ? pos : -negSum;
          const to = v > 0 ? pos + v : -negSum + v;
          if (v > 0) pos += v;
          else negSum -= v;
          const y1 = y(Math.max(from, to));
          const hgt = Math.max(0.5, Math.abs(y(from) - y(to)));
          parts.push(`<rect x="${x.toFixed(1)}" y="${y1.toFixed(1)}" width="${Math.max(1, bw - 1).toFixed(1)}" height="${hgt.toFixed(1)}" rx="2" style="fill:${s.color}"/>`);
        }
      });
    }

    for (const line of lines) {
      const max = Math.max(...line.values.filter((v) => v != null), 1);
      const lmax = Math.ceil(max);
      const ly = (v) => T + (1 - v / lmax) * ph;
      const pts = line.values
        .map((v, i) => (v == null ? null : [L + i * slot + slot / 2, ly(Math.min(v, lmax))]))
        .filter(Boolean);
      parts.push(`<polyline points="${pts.map((p) => p.join(",")).join(" ")}" class="line" style="stroke:${line.color}"/>`);
      pts.forEach(([px, py]) => parts.push(`<circle cx="${px}" cy="${py}" r="2.6" style="fill:${line.color}"/>`));
      parts.push(`<text x="${W - R + 4}" y="${T + 8}">${lmax}</text><text x="${W - R + 4}" y="${H - B}">0</text>`);
    }

    const labelEvery = Math.ceil(n / 12);
    const fmtLabel = (d) =>
      range.unit === "hour"
        ? `${d.getHours()}`
        : range.unit === "day"
          ? d.toLocaleDateString(this._hass.language, n > 7 ? { day: "numeric" } : { weekday: "short" })
          : d.toLocaleDateString(this._hass.language, { month: "short" });
    range.buckets.forEach((d, i) => {
      // Invisible hit area with a tooltip of all values of this bucket.
      const tip = [fmtLabel(d), ...series.map((s) => {
        const v = s.values[i];
        return v == null || v === 0 ? null : `${s.label}: ${this._fmtNumber(Math.abs(v), s.line ? 2 : digits)}${s.line ? "" : ` ${unit}`}`;
      })].filter(Boolean).join("\n");
      parts.push(`<rect x="${L + i * slot}" y="${T}" width="${slot}" height="${ph}" class="hit"><title>${esc(tip)}</title></rect>`);
      if (i % labelEvery === 0) parts.push(`<text x="${L + i * slot + slot / 2}" y="${H - 6}" text-anchor="middle">${esc(fmtLabel(d))}</text>`);
    });

    const legend = series
      .map((s) => {
        const sum = s.line ? null : s.values.reduce((a, v) => a + Math.abs(v || 0), 0);
        return `<span><i style="background:${s.color}"></i>${esc(s.label)}${sum != null ? ` ${this._fmtNumber(sum, digits)} ${unit}` : ""}</span>`;
      })
      .join("");
    return `<svg viewBox="0 0 ${W} ${H}" class="barchart" role="img">${parts.join("")}</svg><div class="legend">${legend}</div>`;
  }

  _renderStack(bar, entries, unit, digits) {
    const main = bar.closest("main");
    const id = bar.dataset.stack;
    const visible = entries.filter((e) => e[1] > 0);
    const sum = visible.reduce((a, e) => a + e[1], 0);
    const fmt = (v) => `${this._fmtNumber(v, digits)} ${unit}`;
    bar.innerHTML =
      visible
        .map(
          ([label, value, color]) =>
            `<div class="seg" title="${esc(label)}: ${fmt(value)}" style="flex-grow:${value};background:${color}">
              ${value / (sum || 1) > 0.15 ? `${Math.round((value / sum) * 100)} %` : ""}</div>`
        )
        .join("") || `<div class="seg" style="flex-grow:1;color:var(--secondary-text-color)">–</div>`;
    main.querySelector(`[data-stack-sum="${id}"]`).textContent = sum ? fmt(sum) : "";
    main.querySelector(`[data-stack-legend="${id}"]`).innerHTML = visible
      .map(([label, value, color]) => `<span><i style="background:${color}"></i>${esc(label)} ${fmt(value)}</span>`)
      .join("");
  }

  _updateStats(main) {
    const p = this._period;
    const t = this._t;
    const tot = this._totals();
    const val = (key) => tot[key] ?? 0;
    const gen = main.querySelector('[data-stack="heat_gen"]');
    if (gen) {
      this._renderStack(
        gen,
        [
          [t.heat_pump, val("hp_heat"), COLORS.heatpump],
          [t.stove, val("stove_heat"), COLORS.heat],
          [t.heating_rod, val("heating_rod"), COLORS.pv],
        ],
        "kWh",
        1
      );
      this._renderStack(
        main.querySelector('[data-stack="heat_dist"]'),
        [
          [t.hc1, val("hc1_heat"), COLORS.house],
          [t.hc2, val("hc2_heat"), COLORS.ecar],
        ],
        "kWh",
        1
      );
    }
    const avg = main.querySelector("[data-rod-avg]");
    if (avg) {
      const kwh = val("heating_rod");
      const hours = this._num(this._stat(`heating_rod_runtime_${p}`)) ?? 0;
      avg.textContent = hours > 0.01 ? this._fmtPower((kwh / hours) * 1000) : "–";
    }
  }

  _updateQuickLoad(main) {
    main.querySelectorAll("[data-quick-status]").forEach((el) => {
      const s = this._hass.states[el.dataset.quickStatus];
      const until = s?.attributes.active_until;
      const active = until && new Date(until) > new Date();
      el.textContent = active
        ? `${this._t.active_until} ${new Date(until).toLocaleTimeString(this._hass.language, { hour: "2-digit", minute: "2-digit" })}`
        : s?.attributes.item
          ? `${s.attributes.item} · ${s.attributes.duration_minutes} min`
          : "";
      el.closest(".action")?.classList.toggle("running", !!active);
    });
  }

  _updateFlow(main) {
    const barIn = main.querySelector('[data-bar="in"]');
    if (!barIn) return;
    const t = this._t;
    const p = (role) => Math.max(0, this._powerW(role) ?? 0);

    let gridImport = p("grid_import");
    let gridExport = p("grid_export");
    const gridSigned = this._num(this._role("grid_power"));
    if (!this._role("grid_import") && gridSigned != null) {
      gridImport = Math.max(0, gridSigned);
      gridExport = Math.max(0, -gridSigned);
    }

    const sources = [
      ["pv", t.pv, p("pv_power"), COLORS.pv, "mdi:solar-power-variant"],
      ["bat", t.battery_discharge, p("battery_discharge"), COLORS.battery, "mdi:battery-arrow-down"],
      ["grid", t.grid_import, gridImport, COLORS.grid, "mdi:transmission-tower-import"],
    ];
    const consumers = [
      ["house", t.house, p("house_power"), COLORS.house, "mdi:home"],
      ["rod", t.heating_rod, p("heating_rod_power"), COLORS.heat, "mdi:heating-coil"],
      ["hp", t.heat_pump, p("heat_pump_power"), COLORS.heatpump, "mdi:heat-pump"],
      ["car", t.ecar, p("ecar_power"), COLORS.ecar, "mdi:car-electric"],
      ["batc", t.battery_charge, p("battery_charge"), COLORS.battery, "mdi:battery-arrow-up"],
      ["exp", t.grid_export, gridExport, COLORS.export, "mdi:transmission-tower-export"],
    ];

    const sumIn = sources.reduce((a, s) => a + s[2], 0);
    const sumOut = consumers.reduce((a, s) => a + s[2], 0);
    const total = Math.max(sumIn, sumOut, 1);
    const render = (bar, list, sum) => {
      const segs = list
        .filter((s) => s[2] > 0)
        .map(
          ([, label, w, color, icon]) =>
            `<div class="seg" title="${esc(label)}: ${this._fmtPower(w)}" style="flex-grow:${w};background:${color}">
              ${w / total > 0.12 ? `<ha-icon icon="${icon}"></ha-icon>${this._fmtPower(w)}` : ""}</div>`
        );
      const rest = total - sum;
      if (rest > 0) segs.push(`<div class="seg" style="flex-grow:${rest};background:transparent"></div>`);
      bar.innerHTML = segs.join("") || `<div class="seg" style="flex-grow:1;color:var(--secondary-text-color)">${t.idle}</div>`;
    };
    render(barIn, sources, sumIn);
    render(main.querySelector('[data-bar="out"]'), consumers, sumOut);
    main.querySelector('[data-sum="in"]').textContent = this._fmtPower(sumIn);
    main.querySelector('[data-sum="out"]').textContent = this._fmtPower(sumOut);
    main.querySelector("[data-legend]").innerHTML = [...sources, ...consumers]
      .filter((s) => s[2] > 0)
      .map(([, label, w, color]) => `<span><i style="background:${color}"></i>${esc(label)} ${this._fmtPower(w)}</span>`)
      .join("");
  }

  _updateBattery(main) {
    const sub = main.querySelector("[data-battery-sub]");
    if (!sub) return;
    const charge = this._num(this._role("battery_charge")) ?? 0;
    const discharge = this._num(this._role("battery_discharge")) ?? 0;
    const signed = this._num(this._role("battery_power"));
    const power = signed != null && !charge && !discharge ? signed : charge - discharge;
    sub.textContent =
      power > 0
        ? `${this._t.battery_charge}: ${this._fmtPower(power)}`
        : power < 0
          ? `${this._t.battery_discharge}: ${this._fmtPower(-power)}`
          : this._t.idle;
  }

  _updateTank(main) {
    const tank = main.querySelector("[data-tank]");
    if (!tank) return;
    const color = (temp) => {
      if (temp == null) return "var(--divider-color, #888)";
      const ratio = Math.max(0, Math.min(1, (temp - 20) / 45));
      return `hsl(${Math.round(230 - ratio * 230)}, 70%, 45%)`;
    };
    const top = this._num(this._rodTempId()) ?? this._num(this._role("tank_top"));
    const mid = this._num(this._role("tank_middle"));
    const bottom = this._num(this._role("tank_bottom"));
    tank.style.background = `linear-gradient(to bottom, ${color(top)}, ${color(mid ?? top)}, ${color(bottom)})`;
  }
}

if (!customElements.get("ems-panel")) {
  customElements.define("ems-panel", RennergyPanel);
}

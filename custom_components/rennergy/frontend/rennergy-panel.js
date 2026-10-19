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
    loading: "Lade Rennergy …",
    no_system: "Keine Rennergy-Anlage eingerichtet. Füge die Integration unter Einstellungen → Geräte & Dienste hinzu.",
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
    loading: "Loading Rennergy …",
    no_system: "No Rennergy system configured. Add the integration under Settings → Devices & services.",
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
    .pipe.active .line::after, .unit.hp.active .uhead ha-icon { animation: none; }
  }
  @media (max-width: 700px) {
    main { padding: 12px; }
    .heating { grid-template-columns: 1fr; }
    .tank { width: 180px; height: 360px; }
    .ctrl input[type=range] { width: 110px; }
  }
`;

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

class RennergyPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._tab = "overview";
    this._period = "day";
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
      this._config = await this._hass.callWS({ type: "rennergy/config" });
    } catch (err) {
      console.error("Rennergy: loading config failed", err);
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
    const external = { pv_power: "pv", heat_pump_power: "hp_electric" }[role];
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
      <header><span class="menu"></span><h1>Rennergy</h1><span class="systems"></span></header>
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
    for (const tab of ["overview", "heating", "stats", "control", "values"]) {
      const btn = document.createElement("button");
      btn.textContent = t[tab];
      btn.classList.toggle("active", tab === this._tab);
      btn.addEventListener("click", () => {
        this._tab = tab;
        this._renderShell();
      });
      nav.appendChild(btn);
    }

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

  _tankIds() {
    const configured = this._schema("tank_sensors");
    if (configured && configured.length) return configured;
    return ["hot_water_temp", "tank_top", "tank_middle", "tank_bottom"].map((r) => this._role(r)).filter(Boolean);
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
        const name = (st?.attributes.friendly_name || eid).replace(/^Rennergy [^ ]+ /, "");
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
    ].join("");

    const todayRows = [
      ["pv_power", t.pv],
      ["grid_import", t.grid_import],
      ["grid_export", t.grid_export],
      ["battery_charge", t.battery_charge],
      ["battery_discharge", t.battery_discharge],
      ["house_power", t.house],
      ["heating_rod_power", t.heating_rod],
      ["heat_pump_power", t.heat_pump],
      ["ecar_power", t.ecar],
    ]
      .map(([role, label]) => {
        const item = this._itemByEntity(this._role(role));
        const statKey = { pv_power: "pv_day", heat_pump_power: "hp_electric_day" }[role];
        const eid = item?.entities.today || (statKey && this._stat(statKey));
        return eid ? this._row(label, eid) : "";
      })
      .join("");

    return `
      ${this._plant()}
      <div class="card">
        <h2>${t.sources} → ${t.consumers}</h2>
        <div class="flow-label"><span>${t.sources}</span><span data-sum="in"></span></div>
        <div class="bar" data-bar="in"></div>
        <div class="flow-label"><span>${t.consumers}</span><span data-sum="out"></span></div>
        <div class="bar" data-bar="out"></div>
        <div class="legend" data-legend></div>
      </div>
      <div class="grid">${tiles}</div>
      ${todayRows ? `<div class="card" style="margin-top:16px"><h2>${t.today}</h2><div class="rows">${todayRows}</div></div>` : ""}`;
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
      const eid = this._role(role);
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

    const quick = this._system.buttons?.hot_water_quick_load;
    const quickCard = quick
      ? `<div class="card action">
          <ha-icon icon="mdi:water-boiler-alert" style="color:${COLORS.heat}"></ha-icon>
          <div class="grow"><b>${t.quick_load}</b><div class="sub" data-quick-status="${esc(quick)}"></div></div>
          <button class="pill" data-press="${esc(quick)}">${t.start}</button>
        </div>`
      : "";

    return `<div class="heating"><div>${quickCard}${boxes}</div><div class="card tank-wrap">${tank}</div></div>`;
  }

  _stack(id, label) {
    return `<div class="flow-label"><span>${esc(label)}</span><span data-stack-sum="${id}"></span></div>
      <div class="bar" data-stack="${id}"></div><div class="legend" data-stack-legend="${id}"></div>`;
  }

  _kpi(label, key, icon, color) {
    const eid = this._stat(key);
    if (!eid) return "";
    return `<div class="card tile" data-more="${esc(eid)}">
      <div class="head"><ha-icon icon="${icon}" style="color:${color}"></ha-icon>${esc(label)}</div>
      <div class="big" data-fmt="${esc(eid)}">–</div>
    </div>`;
  }

  _render_stats() {
    const t = this._t;
    const p = this._period;
    const periods = ["day", "week", "month", "year"]
      .map((x) => `<button class="${x === p ? "active" : ""}" data-period="${x}">${t[x]}</button>`)
      .join("");

    const kpis = [
      this._kpi(t.autarky, `autarky_${p}`, "mdi:home-lightning-bolt", COLORS.battery),
      this._kpi(t.self_consumption, `self_consumption_${p}`, "mdi:solar-power-variant", COLORS.pv),
      this._kpi(t.work_ratio, `work_ratio_${p}`, "mdi:heat-pump", COLORS.heatpump),
      this._kpi(t.cop, "cop", "mdi:heat-pump-outline", COLORS.heatpump),
    ].join("");

    const heat = ["hp_heat", "stove_heat", "heating_rod", "hc1_heat", "hc2_heat"].some((k) => this._stat(`${k}_${p}`));
    const elecRows = [
      [t.pv, `pv_${p}`],
      [t.grid_import, `grid_import_${p}`],
      [t.grid_export, `grid_export_${p}`],
      [t.consumption, `consumption_${p}`],
      [t.hp_electric, `hp_electric_${p}`],
    ]
      .filter(([, key]) => this._stat(key))
      .map(([label, key]) => this._row(label, this._stat(key)))
      .join("");

    const rodRows = [
      [t.energy, `heating_rod_${p}`],
      [t.runtime, `heating_rod_runtime_${p}`],
    ]
      .filter(([, key]) => this._stat(key))
      .map(([label, key]) => this._row(label, this._stat(key)))
      .join("");
    const rodCard = rodRows
      ? `<div class="card"><h2>${t.heating_rod}</h2><div class="rows">${rodRows}
          <div class="row"><span class="name">${t.avg_power}</span><span class="val" data-rod-avg></span></div></div></div>`
      : "";

    const hasMeters = Object.keys(this._system.stats || {}).some((k) => /^(pv|hp_|hc\d|stove)/.test(k));
    return `
      <div class="segmented">${periods}</div>
      ${kpis ? `<div class="grid">${kpis}</div>` : ""}
      ${heat ? `<div class="card" style="margin-top:16px"><h2>${t.heat_generation} / ${t.heat_distribution}</h2>
          ${this._stack("heat_gen", t.heat_generation)}${this._stack("heat_dist", t.heat_distribution)}</div>` : ""}
      <div class="stats-cols">
        ${elecRows ? `<div class="card"><h2>${t.electricity}</h2><div class="rows">${elecRows}</div></div>` : ""}
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
                const prefix = `Rennergy ${mod.name} `;
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
        this._renderShell();
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
    const val = (key) => this._num(this._stat(`${key}_${p}`)) ?? 0;
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
      const hours = val("heating_rod_runtime");
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
    const top = this._num(this._role("heating_rod_temp")) ?? this._num(this._role("tank_top"));
    const mid = this._num(this._role("tank_middle"));
    const bottom = this._num(this._role("tank_bottom"));
    tank.style.background = `linear-gradient(to bottom, ${color(top)}, ${color(mid ?? top)}, ${color(bottom)})`;
  }
}

if (!customElements.get("rennergy-panel")) {
  customElements.define("rennergy-panel", RennergyPanel);
}

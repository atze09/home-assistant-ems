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

  _role(role) {
    // External meters chosen in the settings win over the Rennergy items.
    const external = { pv_power: "pv", heat_pump_power: "hp_electric" }[role];
    return (external && this._system?.power_sensors?.[external]) || this._system?.roles?.[role];
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
    const eid = this._role(role);
    if (!eid) return "";
    return `<div class="card tile" data-more="${esc(eid)}">
      <div class="head"><ha-icon icon="${icon}" style="color:${color}"></ha-icon>${esc(label)}</div>
      <div class="big" data-power="${esc(eid)}" data-fmt-eid="${esc(eid)}">–</div>
      ${sub}
    </div>`;
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
    const p = (role) => Math.max(0, this._num(this._role(role)) ?? 0);

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

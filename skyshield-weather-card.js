/*!
 * SkyShield Weather Card
 * An animated sky for Home Assistant that carries its severe-weather warnings
 * inside the card. Vanilla HTMLElement, no Lit runtime, no dependencies.
 *
 * type: custom:skyshield-weather-card
 * entity: weather.home
 */
const TAG = "skyshield-weather-card";
const EDITOR_TAG = TAG + "-editor";
const VERSION = "0.1.0";

/* ------------------------------------------------------------------ strings */
const STRINGS = {
  en: {
    feels_like: "Feels like",
    pressure: "Pressure",
    dew_point: "Dew point",
    clouds: "Clouds",
    uv: "UV",
    sunrise: "Sunrise",
    sunset: "Sunset",
    zoom_in: "Expand",
    zoom_out: "Close",
    details: "Details",
    humidity: "Humidity",
    wind: "Wind",
    rain_chance: "Rain",
    next_rain: "Rain from",
    next_snow: "Snow from",
    next_precip: "Precipitation from",
    level_1: "Level 1 · Yellow",
    level_2: "Level 2 · Orange",
    level_3: "Level 3 · Red",
    until: "until",
    from: "from",
    now: "Now",
    no_entity: "No weather entity configured",
    editor_entity: "Weather entity",
    editor_entity_help: "The weather entity that drives the sky and the forecast.",
    editor_warnings: "Warning entities",
    editor_warnings_help: "DWD, MeteoAlarm, CAP alerts, Environment Canada or any sensor carrying a warning level.",
    editor_sun: "Sun entity",
    editor_sun_help: "Used for day, night, sun and moon. Defaults to sun.sun.",
    editor_name: "Name",
    editor_name_help: "Shown above the temperature. Defaults to the entity name.",
    editor_hours: "Hours in the strip",
    editor_days: "Days in the forecast",
    editor_animate: "Animate",
    editor_compact: "Compact",
    editor_show_warnings: "Show warnings",
    editor_show_warnings_help: "Off: the card never shows a warning band, even when one is active.",
    editor_show_warning_text: "Always show the full warning text",
    editor_show_warning_text_help: "The short alert text is always visible. The advice below it opens on tap — switch this on to keep it open too.",
    editor_font_scale: "Font size",
    editor_font_scale_help: "1 = default. Raise it on laptops and small screens, lower it on a wall tablet.",
    editor_zoom: "Full-screen zoom",
    editor_zoom_help: "auto: zoom on tap only on wide screens (the small expand icon shows up). off: never.",
    editor_show_rain_bars: "Precipitation bars",
    editor_show_rain_bars_help: "A bar per hour under the strip, scaled to the wettest hour shown.",
    editor_show_curve: "Temperature curve",
    editor_show_curve_help: "Line through the hourly temperatures.",
    editor_show_next: "Next precipitation",
    editor_show_next_help: "A line under the condition: when the next rain or snow starts.",
    editor_compact_help: "Hides the hour strip and the daily forecast.",
    section_card: "Card",
    section_data: "Warnings and forecast",
  },
  de: {
    feels_like: "Gefühlt",
    pressure: "Luftdruck",
    dew_point: "Taupunkt",
    clouds: "Bewölkung",
    uv: "UV",
    sunrise: "Aufgang",
    sunset: "Untergang",
    zoom_in: "Vergrößern",
    zoom_out: "Schließen",
    details: "Details",
    humidity: "Feuchte",
    wind: "Wind",
    rain_chance: "Regen",
    next_rain: "Regen ab",
    next_snow: "Schnee ab",
    next_precip: "Niederschlag ab",
    level_1: "Stufe 1 · Gelb",
    level_2: "Stufe 2 · Orange",
    level_3: "Stufe 3 · Rot",
    until: "bis",
    from: "ab",
    now: "Jetzt",
    no_entity: "Keine Wetter-Entität konfiguriert",
    editor_entity: "Wetter-Entität",
    editor_entity_help: "Die Wetter-Entität für Himmel und Vorhersage.",
    editor_warnings: "Warn-Entitäten",
    editor_warnings_help: "DWD, MeteoAlarm, CAP-Alerts, Environment Canada oder jeder Sensor mit Warnstufe.",
    editor_sun: "Sonnen-Entität",
    editor_sun_help: "Für Tag, Nacht, Sonne und Mond. Standard: sun.sun.",
    editor_name: "Name",
    editor_name_help: "Steht über der Temperatur. Standard: Name der Entität.",
    editor_hours: "Stunden im Streifen",
    editor_days: "Tage in der Vorhersage",
    editor_animate: "Animieren",
    editor_compact: "Kompakt",
    editor_show_warnings: "Warnungen anzeigen",
    editor_show_warnings_help: "Aus: Die Karte zeigt nie ein Warnband, auch wenn eine Warnung aktiv ist.",
    editor_show_warning_text: "Vollen Warntext immer anzeigen",
    editor_show_warning_text_help: "Der kurze Warntext steht immer da. Die Handlungsempfehlung darunter öffnet sich beim Antippen — dieser Schalter hält sie offen.",
    editor_font_scale: "Schriftgröße",
    editor_font_scale_help: "1 = Standard. Auf Laptop/kleinen Bildschirmen höher, auf dem Wandrahmen niedriger.",
    editor_zoom: "Vollbild-Zoom",
    editor_zoom_help: "auto: Zoom per Tipp nur auf großen Bildschirmen (Pfeil-Symbol erscheint). aus: nie.",
    editor_show_rain_bars: "Regenmengen-Säulen",
    editor_show_rain_bars_help: "Ein Balken je Stunde unter dem Streifen, skaliert auf die nasseste Stunde.",
    editor_show_curve: "Temperaturkurve",
    editor_show_curve_help: "Linie durch die Stundentemperaturen.",
    editor_show_next: "Nächster Niederschlag",
    editor_show_next_help: "Zeile unter dem Zustand: wann der nächste Regen oder Schnee beginnt.",
    editor_compact_help: "Blendet Stundenstreifen und Tagesvorhersage aus.",
    section_card: "Karte",
    section_data: "Warnungen und Vorhersage",
  },
};
const DEFAULTS = {
  entity: "",
  sun_entity: "sun.sun",
  warning_entities: [],
  name: "",
  hours: 6,
  days: 4,
  animate: true,
  compact: false,
  show_warnings: true,
  show_warning_text: false,
  zoom: "auto",
  font_scale: 1,
  show_curve: true,
  show_next: true,
  show_rain_bars: true,
  debug_warning: 0,
  debug_condition: "",
  debug_night: false,
};
function cardLang(hass) {
  var l = (hass && hass.locale && hass.locale.language) || (hass && hass.language) || "en";
  return String(l).toLowerCase().split("-")[0];
}
function T(hass, key) {
  var table = STRINGS[cardLang(hass)] || STRINGS.en;
  return table[key] || STRINGS.en[key] || key;
}

/* -------------------------------------------------------------------- icons */
const COND_ICON = {
  sunny: "mdi:weather-sunny",
  "clear-night": "mdi:weather-night",
  partlycloudy: "mdi:weather-partly-cloudy",
  cloudy: "mdi:weather-cloudy",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
  exceptional: "mdi:alert-circle-outline",
};
function condIcon(c) {
  return COND_ICON[c] || "mdi:weather-cloudy";
}

/* ------------------------------------------------------------------- scenes
 * day / night gradient stops (top, middle, bottom) plus the effects that run.
 */
const SCENES = {
  sunny: {
    day: [[58, 138, 206], [128, 188, 233], [204, 231, 246]],
    night: [[6, 12, 30], [12, 22, 45], [26, 38, 62]],
    clouds: 0.04, rain: 0, snow: 0, fog: 0, bolt: 0, wind: 0,
  },
  "clear-night": {
    day: [[58, 138, 206], [128, 188, 233], [204, 231, 246]],
    night: [[5, 9, 24], [10, 18, 38], [20, 30, 52]],
    clouds: 0, rain: 0, snow: 0, fog: 0, bolt: 0, wind: 0,
  },
  partlycloudy: {
    day: [[62, 130, 190], [124, 176, 219], [199, 222, 236]],
    night: [[7, 13, 32], [16, 26, 50], [30, 44, 68]],
    clouds: 0.42, rain: 0, snow: 0, fog: 0, bolt: 0, wind: 0.15,
  },
  cloudy: {
    day: [[78, 96, 114], [130, 146, 162], [186, 197, 208]],
    night: [[14, 19, 27], [24, 31, 42], [40, 49, 62]],
    clouds: 0.9, rain: 0, snow: 0, fog: 0, bolt: 0, wind: 0.1,
  },
  fog: {
    day: [[110, 122, 133], [156, 167, 176], [199, 207, 213]],
    night: [[18, 22, 28], [30, 36, 44], [46, 54, 64]],
    clouds: 0.25, rain: 0, snow: 0, fog: 0.95, bolt: 0, wind: 0,
  },
  rainy: {
    day: [[62, 82, 102], [96, 118, 138], [147, 165, 180]],
    night: [[10, 15, 22], [20, 27, 36], [34, 43, 54]],
    clouds: 0.85, rain: 0.45, snow: 0, fog: 0.05, bolt: 0, wind: 0.25,
  },
  pouring: {
    day: [[48, 64, 82], [76, 94, 112], [120, 138, 154]],
    night: [[8, 12, 19], [16, 22, 30], [28, 36, 46]],
    clouds: 0.95, rain: 1, snow: 0, fog: 0.1, bolt: 0, wind: 0.35,
  },
  lightning: {
    day: [[42, 52, 70], [68, 80, 100], [108, 120, 138]],
    night: [[7, 10, 16], [14, 19, 28], [26, 32, 44]],
    clouds: 0.95, rain: 0.7, snow: 0, fog: 0, bolt: 1, wind: 0.4,
  },
  "lightning-rainy": {
    day: [[42, 52, 70], [68, 80, 100], [108, 120, 138]],
    night: [[7, 10, 16], [14, 19, 28], [26, 32, 44]],
    clouds: 0.95, rain: 0.8, snow: 0, fog: 0, bolt: 1, wind: 0.4,
  },
  snowy: {
    day: [[104, 118, 134], [148, 160, 174], [206, 214, 222]],
    night: [[16, 21, 30], [30, 38, 50], [50, 60, 74]],
    clouds: 0.7, rain: 0, snow: 0.8, fog: 0.15, bolt: 0, wind: 0.1,
  },
  "snowy-rainy": {
    day: [[92, 106, 124], [136, 150, 166], [190, 200, 210]],
    night: [[14, 19, 28], [26, 34, 46], [44, 54, 68]],
    clouds: 0.8, rain: 0.3, snow: 0.5, fog: 0.1, bolt: 0, wind: 0.2,
  },
  hail: {
    day: [[84, 98, 116], [126, 140, 158], [178, 190, 202]],
    night: [[12, 17, 25], [24, 31, 42], [40, 49, 62]],
    clouds: 0.85, rain: 0.35, snow: 0.35, fog: 0, bolt: 0, wind: 0.3,
  },
  windy: {
    day: [[64, 128, 176], [118, 168, 204], [188, 214, 230]],
    night: [[8, 14, 30], [18, 27, 48], [32, 44, 66]],
    clouds: 0.4, rain: 0, snow: 0, fog: 0, bolt: 0, wind: 1,
  },
  "windy-variant": {
    day: [[70, 132, 178], [122, 170, 206], [190, 215, 231]],
    night: [[9, 15, 31], [19, 28, 49], [33, 45, 67]],
    clouds: 0.55, rain: 0, snow: 0, fog: 0, bolt: 0, wind: 1,
  },
  exceptional: {
    day: [[58, 138, 206], [128, 188, 233], [204, 231, 246]],
    night: [[6, 12, 30], [12, 22, 45], [26, 38, 62]],
    clouds: 0.1, rain: 0, snow: 0, fog: 0, bolt: 0, wind: 0,
  },
};
function sceneOf(condition) {
  return SCENES[condition] || SCENES.cloudy;
}

/* ------------------------------------------------------------------ helpers */
function now() {
  return (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
}
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function mixRgb(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}
function rgb(c, a) {
  return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a === undefined ? 1 : a) + ")";
}
function dayFactor(elevation) {
  if (elevation === null || elevation === undefined || isNaN(elevation)) return 1;
  return clamp((elevation + 8) / 16, 0, 1);
}
function num(v, fallback) {
  var n = parseFloat(v);
  return isFinite(n) ? n : fallback;
}
function round(v) { return Math.round(v); }
function compass(deg, hass) {
  var dirs = cardLang(hass) === "de"
    ? ["N", "NO", "O", "SO", "S", "SW", "W", "NW"]
    : ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  if (deg === null || deg === undefined || isNaN(deg)) return "";
  return dirs[Math.round(((deg % 360) / 45)) % 8];
}

/* --------------------------------------------------------------- warnings */
const LEVEL_COLORS = { 1: "#ffd23f", 2: "#ff8c1a", 3: "#e53935" };

function levelLabel(hass, level) {
  var lv = level >= 3 ? 3 : level === 2 ? 2 : 1;
  return T(hass, "level_" + lv);
}
function levelColor(level) {
  var lv = level >= 3 ? 3 : level === 2 ? 2 : 1;
  return LEVEL_COLORS[lv];
}

/* DWD style: warning_count + warning_<n>_<field> attributes. */
function tidyText(value) {
  return String(value || "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
function parseDwd(state) {
  var a = state.attributes || {};
  var count = num(a.warning_count, 0);
  var out = [];
  for (var i = 1; i <= count; i++) {
    var headline = a["warning_" + i + "_headline"];
    var name = a["warning_" + i + "_name"];
    if (!headline && !name) continue;
    out.push({
      level: num(a["warning_" + i + "_level"], 1),
      title: name || headline,
      detail: tidyText(a["warning_" + i + "_description"] || ""),
      extra: tidyText(a["warning_" + i + "_instruction"] || ""),
      start: a["warning_" + i + "_start"],
      end: a["warning_" + i + "_end"],
      entity: state.entity_id,
    });
  }
  return out;
}
/* MeteoAlarm / CAP: awareness_level "2; yellow; Moderate", awareness_type "5; high-temperature". */
function parseMeteoAlarm(state) {
  var a = state.attributes || {};
  if (state.state === "off" || state.state === "unavailable") return [];
  var raw = String(a.awareness_level || a.level || "");
  var level = 1;
  var word = raw.toLowerCase();
  if (word.indexOf("red") >= 0 || /;\s*3\b/.test(word)) level = 3;
  else if (word.indexOf("orange") >= 0 || /;\s*2\b/.test(word)) level = 2;
  else if (word.indexOf("yellow") >= 0 || /;\s*1\b/.test(word)) level = 1;
  else level = num(state.state, 1) >= 3 ? 3 : num(state.state, 1) === 2 ? 2 : 1;
  var typeRaw = String(a.awareness_type || a.event || "");
  var type = typeRaw.replace(/^\s*\d+\s*;\s*/, "").replace(/_/g, " ");
  return [{
    level: level,
    title: type || state.attributes.friendly_name || state.entity_id,
    detail: tidyText(a.description || ""),
    extra: tidyText(a.instruction || ""),
    start: a.onset || a.from,
    end: a.expires || a.until,
    entity: state.entity_id,
  }];
}
/* Environment Canada / CAP / Pirate style: alert_<n> strings or an alerts array. */
function parseAlertList(state) {
  var a = state.attributes || {};
  var list = [];
  Object.keys(a).forEach(function (k) {
    if (/^alert_\d+$/.test(k) && typeof a[k] === "string") list.push({ title: a[k], level: 1 });
  });
  if (!list.length && Array.isArray(a.alerts)) {
    a.alerts.forEach(function (al) {
      if (!al) return;
      list.push({
        title: al.title || al.event || al.headline || String(al),
        level: 1,
        detail: al.description || "",
        start: al.start || al.onset,
        end: al.end || al.expires,
      });
    });
  }
  list.forEach(function (l) { l.entity = state.entity_id; });
  return list;
}
function parseWarnings(hass, ids) {
  var out = [];
  if (!ids || !ids.length) return out;
  ids.forEach(function (id) {
    var st = hass.states[id];
    if (!st || st.state === "unavailable") return;
    var a = st.attributes || {};
    if (a.warning_count !== undefined) { out = out.concat(parseDwd(st)); return; }
    if (a.awareness_level !== undefined || a.awareness_type !== undefined) {
      out = out.concat(parseMeteoAlarm(st));
      return;
    }
    var alerts = parseAlertList(st);
    if (alerts.length) { out = out.concat(alerts); return; }
    /* last resort: a text state that is not a plain level number */
    var s = String(st.state);
    if (s && s !== "0" && s !== "off" && s !== "unknown" && !/^\d+$/.test(s)) {
      out.push({ level: 1, title: s, detail: "", entity: id });
    }
  });
  var now = Date.now();
  out = out.filter(function (w) {
    if (!w.end) return true;
    var e = new Date(w.end).getTime();
    return isNaN(e) ? true : e > now;
  });
  out.sort(function (x, y) { return y.level - x.level; });
  return out.slice(0, 3);
}

/* --------------------------------------------------------------- formatting */
function fmtTime(iso, hass) {
  if (!iso) return "";
  var d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  var lang = cardLang(hass) === "de" ? "de-DE" : "en-GB";
  var now = new Date();
  var sameDay = d.toDateString() === now.toDateString();
  try {
    if (sameDay) {
      return d.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleString(lang, {
      weekday: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch (e) {
    return d.getHours() + ":00";
  }
}
function fmtHour(iso, hass, first) {
  if (!iso) return "";
  var d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  if (first) return T(hass, "now");
  var h = d.getHours(), m = d.getMinutes();
  return m ? h + ":" + (m < 10 ? "0" + m : m) : String(h);
}
function fmtHourPadded(iso) {
  var d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  var h = d.getHours();
  return h < 10 ? "0" + h : String(h);
}
/* weekday + time for warnings: "Sa 19:00", or just "19:00" when it is today */
function fmtWhen(iso, hass) {
  if (!iso) return "";
  var d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  var lang = cardLang(hass) === "de" ? "de-DE" : "en-GB";
  var time;
  try {
    time = d.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    time = d.getHours() + ":00";
  }
  if (d.toDateString() === new Date().toDateString()) return time;
  var day;
  try {
    day = d.toLocaleDateString(lang, { weekday: "short" });
  } catch (e) {
    day = "";
  }
  return day ? day + " " + time : time;
}
function fmtDay(iso, hass, index) {
  if (!iso) return "";
  var d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  var lang = cardLang(hass) === "de" ? "de-DE" : "en-GB";
  try {
    return d.toLocaleDateString(lang, { weekday: "short" });
  } catch (e) {
    return String(index);
  }
}
function tempText(value, unit) {
  if (value === null || value === undefined || isNaN(value)) return "–";
  return round(value) + "°";
}

/* ------------------------------------------------------------------ editor */
class SkyShieldEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass = null;
    this.attachShadow({ mode: "open" });
    this._form = null;
    this._lang = "";
  }
  setConfig(config) {
    this._config = Object.assign({}, DEFAULTS, config || {});
    this._render();
  }
  set hass(hass) {
    this._hass = hass;
    var l = cardLang(hass);
    if (this._form) this._form.hass = hass;
    if (l !== this._lang) { this._lang = l; this._render(); }
  }
  get hass() { return this._hass; }
  _render() {
    if (!this._hass) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", (ev) => {
        var value = Object.assign({}, this._config, ev.detail.value);
        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: value }, bubbles: true, composed: true,
        }));
      });
      this.shadowRoot.appendChild(this._form);
    }
    this._form.computeLabel = (schema) => T(this._hass, "editor_" + schema.name);
    this._form.computeHelper = (schema) => {
      var help = T(this._hass, "editor_" + schema.name + "_help");
      return help === "editor_" + schema.name + "_help" ? undefined : help;
    };
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "entity", required: true, selector: { entity: { domain: "weather" } } },
      { name: "warning_entities", selector: { entity: { multiple: true } } },
      { name: "sun_entity", selector: { entity: { domain: "sun" } } },
      { name: "name", selector: { text: {} } },
      { type: "grid", name: "", schema: [
        { name: "hours", selector: { number: { min: 0, max: 12, mode: "box" } } },
        { name: "days", selector: { number: { min: 0, max: 7, mode: "box" } } },
      ] },
      { type: "grid", name: "", schema: [
        { name: "animate", selector: { boolean: {} } },
        { name: "compact", selector: { boolean: {} } },
      ] },
      { name: "show_warnings", selector: { boolean: {} } },
      { name: "show_warning_text", selector: { boolean: {} } },
      { name: "font_scale", selector: { number: { min: 0.8, max: 1.8, step: 0.05, mode: "box" } } },
      { name: "zoom", selector: { select: { mode: "dropdown", options: [
        { value: "auto", label: "auto" }, { value: "off", label: "off" }, { value: "always", label: "always" },
      ] } } },
      { type: "grid", name: "", schema: [
        { name: "show_curve", selector: { boolean: {} } },
        { name: "show_next", selector: { boolean: {} } },
      ] },
      { name: "show_rain_bars", selector: { boolean: {} } },
    ];
    this._form.data = this._config;
  }
}
if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, SkyShieldEditor);
}

/* -------------------------------------------------------------------- card */
class SkyShieldCard extends HTMLElement {
  constructor() {
    super();
    this._config = Object.assign({}, DEFAULTS);
    this._hass = null;
    this._shadow = this.attachShadow({ mode: "open" });
    this._built = false;
    this._refs = {};
    this._fc = { hourly: [], daily: [] };
    this._fcAt = 0;
    this._fcEntity = "";
    this._scene = null;
    this._particles = null;
    this._stars = null;
    this._clouds = null;
    this._fog = null;
    this._timer = 0;
    this._visible = true;
    this._flash = 0;
    this._nextBolt = 0;
    this._dpr = 1;
    this._w = 0;
    this._h = 0;
    this._wOld = -1;
    this._hOld = -1;
    this._reduce = false;
    this._lastFrame = 0;
    this._frameMs = 1000 / 30;
    this._openAlerts = {};
    this._zoomed = false;
    this._onKey = (ev) => { if (ev.key === "Escape" && this._zoomed) this._closeZoom(); };
  }

  static getStubConfig(hass) {
    var entity = "";
    if (hass) {
      var ids = Object.keys(hass.states).filter(function (id) { return id.indexOf("weather.") === 0; });
      if (ids.length) entity = ids[0];
    }
    return { entity: entity, sun_entity: "sun.sun" };
  }
  static getConfigElement() { return document.createElement(EDITOR_TAG); }

  setConfig(config) {
    if (!config) throw new Error("skyshield: invalid configuration");
    this._config = Object.assign({}, DEFAULTS, config);
    this._config.warning_entities = Array.isArray(config.warning_entities)
      ? config.warning_entities.slice()
      : config.warning_entities ? [config.warning_entities] : [];
    this._scene = null;
    if (this._built) { this._applyScale(); this._syncStructure(); }
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }
  get hass() { return this._hass; }

  getCardSize() { return this._config.compact ? 4 : 7; }

  connectedCallback() {
    this._reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    this._visible = true;
    this._timer = 0;
    /* a stale observer would never report again — rebuild it on every attach */
    if (this._io) { this._io.disconnect(); this._io = null; }
    this._observe();
    this._observeResize();
    this._watch();
    this._winResize = () => this._onWinResize();
    window.addEventListener("resize", this._winResize);
    window.addEventListener("orientationchange", this._winResize);
    this._render();
  }
  disconnectedCallback() {
    this._stop();
    if (this._winResize) {
      window.removeEventListener("resize", this._winResize);
      window.removeEventListener("orientationchange", this._winResize);
    }
    if (this._zoomed) {
      this._zoomed = false;
      document.body.style.overflow = "";
      window.removeEventListener("keydown", this._onKey);
    }
    if (this._io) { this._io.disconnect(); this._io = null; }
  }

  _onWinResize() {
    if (!this._built) return;
    if (this._refs.expand) {
      const allowed = this._canZoom();
      this._refs.expand.hidden = !allowed;
      this._refs.expand.style.display = allowed ? "" : "none";
    }
    if (this._zoomed && !this._canZoom()) this._closeZoom();
  }

  _watch() {
    if (this._wd) return;
    let idle = 0;
    this._wd = setInterval(() => {
      if (!this.isConnected) {
        /* keep watching for a while: Home Assistant re-attaches the element on view return */
        if (++idle > 40) this._unwatch();
        return;
      }
      idle = 0;
      this._ensureAnim();
    }, 1200);
  }

  _unwatch() {
    if (this._wd) { clearInterval(this._wd); this._wd = null; }
  }

  _observeResize() {
    const self = this;
    if (this._ro || !window.ResizeObserver) return;
    this._ro = new ResizeObserver(function () {
      if (!self._built) return;
      const before = self._w + "x" + self._h;
      self._measure();
      const after = self._w + "x" + self._h;
      if (before !== after && (self._reduce || self._config.animate === false)) self._drawOnce();
      else if (before !== after) { self._seed(); }
    });
    this._ro.observe(this);
  }

  _observe() {
    if (this._io || !window.IntersectionObserver) return;
    this._io = new IntersectionObserver((entries) => {
      this._visible = entries.some((e) => e.isIntersecting);
      if (this._visible) this._start(); else this._stop();
    }, { threshold: 0 });
    this._io.observe(this);
  }

  /* ---------------------------------------------------------------- build */
  _build() {
    this._shadow.innerHTML = `
<style>
:host{display:block}
*,*::before,*::after{box-sizing:border-box}
ha-card{
  --ss-k:1;
  display:block;
  width:100%;
  position:relative;
  overflow:hidden;
  border-radius:var(--ha-card-border-radius,12px);
  border:1px solid var(--ha-card-border-color,rgba(255,255,255,.1));
  box-shadow:var(--ha-card-box-shadow,0 2px 10px rgba(0,0,0,.35));
  background:#0d1420;
  color:#fff;
  --ss-level:#ffd23f;
}
canvas{position:absolute;left:0;top:0;width:100%;height:var(--ss-sky-h,100%);display:block;z-index:0}
.scrim{position:absolute;left:0;top:0;right:0;height:var(--ss-sky-h,100%);z-index:1;pointer-events:none;
  background:linear-gradient(180deg,rgba(0,0,0,.16) 0%,rgba(0,0,0,0) 34%,rgba(0,0,0,.42) 100%)}
.content{position:relative;z-index:2;display:flex;flex-direction:column;gap:10px;box-sizing:border-box;
  padding:14px 16px 14px;text-shadow:0 1px 3px rgba(0,0,0,.5)}
.head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;cursor:pointer}
.place{font-size:calc(12.5px * var(--ss-k));letter-spacing:.08em;text-transform:uppercase;opacity:.84;font-weight:650}
.cond{font-size:calc(17px * var(--ss-k));font-weight:600;margin-top:3px;display:flex;align-items:center;gap:7px}
.cond ha-icon{--mdc-icon-size:calc(21px * var(--ss-k));opacity:.95}
.next{font-size:calc(13px * var(--ss-k));opacity:.82;margin-top:4px;display:flex;align-items:center;gap:4px}
.temps{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:1px}
.temp{font-size:calc(52px * var(--ss-k));font-weight:300;line-height:.95;letter-spacing:-1.5px}
.hilo{font-size:calc(13px * var(--ss-k));opacity:.84;white-space:nowrap}
.alerts{display:flex;flex-direction:column;gap:6px}
.alerts[hidden]{display:none}
.alert{display:flex;gap:9px;align-items:flex-start;padding:8px 10px 8px 9px;border-radius:12px;cursor:pointer;
  background:rgba(8,11,17,.46);border:1px solid var(--ss-level);border-left-width:3px;
  -webkit-backdrop-filter:blur(10px) saturate(1.1);backdrop-filter:blur(10px) saturate(1.1);
  box-shadow:0 4px 14px rgba(0,0,0,.25);animation:ss-in .28s ease-out both}
.alert[hidden]{display:none}
.aicon{color:var(--ss-level);--mdc-icon-size:calc(19px * var(--ss-k));flex:0 0 auto;margin-top:1px;filter:drop-shadow(0 0 6px rgba(0,0,0,.45))}
.atext{display:flex;flex-direction:column;gap:2px;min-width:0}
.atitle{font-size:calc(14px * var(--ss-k));font-weight:650;line-height:1.25;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ameta{font-size:calc(12px * var(--ss-k));opacity:.8;display:flex;gap:6px;align-items:center;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis}
.dot{width:6px;height:6px;border-radius:50%;background:var(--ss-level);flex:0 0 auto}
.adesc{font-size:calc(12.5px * var(--ss-k));line-height:1.42;opacity:.88;margin-top:4px;white-space:pre-line;overflow-wrap:anywhere}
.adesc[hidden]{display:none}
.aextra{font-size:calc(12px * var(--ss-k));line-height:1.4;opacity:.74;margin-top:5px;padding-top:5px;
  border-top:1px solid rgba(255,255,255,.12);white-space:pre-line;overflow-wrap:anywhere}
.aextra[hidden]{display:none}
.achev{--mdc-icon-size:calc(19px * var(--ss-k));color:var(--ss-level);opacity:.85;flex:0 0 auto;margin-left:auto;
  margin-top:1px;transition:transform .18s ease}
.achev[hidden]{display:none}
.alert.open .achev{transform:rotate(180deg)}
.chips{display:flex;gap:16px;font-size:calc(13px * var(--ss-k));opacity:.94;flex-wrap:wrap}
.chip{display:flex;align-items:center;gap:4px}
.chip ha-icon{--mdc-icon-size:calc(16px * var(--ss-k));opacity:.85}
.stripwrap{position:relative}
.stripwrap[hidden]{display:none}
.strip{position:relative;display:flex;justify-content:space-between;gap:2px}
.strip[hidden]{display:none}
svg.curve{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible}
svg.curve path.line{fill:none;stroke:rgba(255,255,255,.62);stroke-width:1.6;stroke-linecap:round;
  stroke-linejoin:round;vector-effect:non-scaling-stroke}
.hour{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0;flex:1 1 0}
.hour .ht{font-size:calc(16px * var(--ss-k));opacity:.9;white-space:nowrap;font-variant-numeric:tabular-nums}
.hour ha-icon{--mdc-icon-size:calc(34px * var(--ss-k));margin:1px 0}
.hplot{position:relative;width:100%;height:calc(52px * var(--ss-k))}
.hplot.flat{height:calc(22px * var(--ss-k))}
.hour .hv{position:absolute;left:50%;transform:translateX(-50%);font-size:calc(18px * var(--ss-k));font-weight:700;
  white-space:nowrap;font-variant-numeric:tabular-nums;text-shadow:0 1px 3px rgba(0,0,0,.65)}
.hour .hp{font-size:calc(12.5px * var(--ss-k));opacity:.85;color:#cfe8ff;height:13px;line-height:13px}
.rain{display:flex;align-items:flex-end;justify-content:center;width:100%;
  height:calc(20px * var(--ss-k));margin-top:2px}
.rain .rbar{width:44%;min-height:0;border-radius:2px 2px 0 0;
  background:linear-gradient(180deg,#8fd6ff,rgba(143,214,255,.28))}
.strip.norain .rain{display:none}
.days.norain .rain{display:none}
.days .rain{height:calc(16px * var(--ss-k));margin-top:2px}
.days{display:grid;gap:2px;font-size:calc(12px * var(--ss-k));align-items:center}
.days[hidden]{display:none}
.day{display:flex;flex-direction:column;align-items:center;gap:2px}
.day .dt{font-size:calc(13px * var(--ss-k))}
.day ha-icon{--mdc-icon-size:calc(26px * var(--ss-k))}
.day .dv{font-weight:650;font-size:calc(14px * var(--ss-k))}
.day .dh{opacity:.72;font-size:calc(12.5px * var(--ss-k))}
.err{padding:16px;font-size:13px;opacity:.9}
.zoombg{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;background:rgba(6,9,14,.66);
  -webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);opacity:0;pointer-events:none;
  transition:opacity .26s ease}
.zoombg.on{opacity:1;pointer-events:auto}
ha-card.zoomed{position:fixed;left:3vw;top:3vh;right:3vw;bottom:3vh;width:auto;height:auto;
  z-index:2147483001;overflow:hidden;animation:ss-zoom .34s cubic-bezier(.2,.85,.25,1) both}
@keyframes ss-zoom{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:none}}
.zoomed .content{padding:22px 22px 20px;gap:14px;height:100%;max-height:100%;box-sizing:border-box;
  overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.zoomed .stripwrap{margin-top:auto}
.zoomed .temp{font-size:64px;letter-spacing:-2px}
.zoomed .place{font-size:13px}
.zoomed .cond{font-size:20px}
.zoomed .cond ha-icon{--mdc-icon-size:24px}
.zoomed .next{font-size:13px}
.zoomed .atitle{font-size:15.5px}
.zoomed .ameta{font-size:12.5px}
.zoomed .adesc{font-size:13px}
.zoomed .aextra{font-size:12px}
.zoomed .aicon{--mdc-icon-size:21px}
.zoomed .chips{font-size:13.5px;gap:20px}
.zoomed .chip ha-icon{--mdc-icon-size:17px}
.zoomed .hour .ht{font-size:17px}
.zoomed .hour ha-icon{--mdc-icon-size:40px}
.zoomed .hour .hv{font-size:19px}
.zoomed .hour .hp{font-size:12.5px}
.zoomed .day .dt{font-size:14px}
.zoomed .day ha-icon{--mdc-icon-size:30px}
.zoomed .day .dv{font-size:15.5px}
.zoomed .day .dh{font-size:12.5px}
.zoomed svg.curve path.line{stroke-width:2.2;stroke:rgba(255,255,255,.74)}
.zoomed ha-icon.closebtn{display:block}
.zoomed ha-icon.expandbtn{display:none !important}
.zoomed ha-icon.infobtn{display:block}
ha-icon.closebtn{position:absolute;top:10px;right:10px;z-index:6;--mdc-icon-size:22px;padding:6px;border-radius:50%;
  background:rgba(0,0,0,.34);cursor:pointer;display:none}
ha-icon.infobtn{position:absolute;bottom:12px;right:12px;z-index:6;--mdc-icon-size:20px;padding:6px;border-radius:50%;
  background:rgba(0,0,0,.34);cursor:pointer;display:none}
ha-icon.expandbtn{position:absolute;bottom:10px;right:10px;z-index:6;--mdc-icon-size:19px;padding:5px;border-radius:50%;
  background:rgba(0,0,0,.26);cursor:pointer;opacity:.8}
ha-icon.expandbtn[hidden]{display:none}
@keyframes ss-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){.alert{animation:none}}
</style>
<div class="zoombg"></div>
<ha-card>
  <ha-icon class="expandbtn" icon="mdi:arrow-expand" hidden></ha-icon>
  <ha-icon class="closebtn" icon="mdi:close"></ha-icon>
  <ha-icon class="infobtn" icon="mdi:information-outline"></ha-icon>
  <canvas></canvas>
  <div class="scrim"></div>
  <div class="content">
    <div class="head">
      <div>
        <div class="place"></div>
        <div class="cond"><ha-icon icon="mdi:weather-cloudy"></ha-icon><span class="condtext"></span></div>
        <div class="next"></div>
      </div>
      <div class="temps">
        <div class="temp">–</div>
        <div class="hilo"></div>
      </div>
    </div>
    <div class="alerts"></div>
    <div class="chips"></div>
    <div class="stripwrap">
      <svg class="curve" preserveAspectRatio="none"><path class="line"></path></svg>
      <div class="strip"></div>
    </div>
    <div class="days"></div>
    <div class="err" hidden></div>
  </div>
</ha-card>`;
    const q = (s) => this._shadow.querySelector(s);
    this._refs = {
      card: q("ha-card"),
      canvas: q("canvas"),
      place: q(".place"),
      condIcon: q(".cond ha-icon"),
      condText: q(".condtext"),
      temp: q(".temp"),
      hilo: q(".hilo"),
      alerts: q(".alerts"),
      chips: q(".chips"),
      stripWrap: q(".stripwrap"),
      strip: q(".strip"),
      curveSvg: q("svg.curve"),
      curveLine: q("svg.curve path.line"),
      next: q(".next"),
      zoombg: q(".zoombg"),
      expand: q(".expandbtn"),
      close: q(".closebtn"),
      info: q(".infobtn"),
      days: q(".days"),
      err: q(".err"),
      head: q(".head"),
    };
    const R0 = this._refs;
    if (R0.expand) { R0.expand.title = T(this._hass || {}, "zoom_in"); R0.expand.setAttribute("role", "button"); }
    if (R0.close) { R0.close.title = T(this._hass || {}, "zoom_out"); R0.close.setAttribute("role", "button"); }
    if (R0.info) { R0.info.title = T(this._hass || {}, "details"); R0.info.setAttribute("role", "button"); }
    this._refs.card.addEventListener("click", (ev) => {
      const t = ev.target;
      if (t && t.closest) {
        if (t.closest(".alert") || t.closest("ha-icon.closebtn") || t.closest("ha-icon.expandbtn")) return;
        if (t.closest("ha-icon.infobtn")) { this._moreInfo(); return; }
      }
      if (this._zoomed) return;
      if (this._canZoom()) this._openZoom();
      else this._moreInfo();
    });
    this._refs.zoombg.addEventListener("click", () => this._closeZoom());
    if (this._refs.close) this._refs.close.addEventListener("click", (e) => { e.stopPropagation(); this._closeZoom(); });
    if (this._refs.expand) this._refs.expand.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this._canZoom()) this._openZoom(); else this._moreInfo();
    });
    if (this._refs.info) this._refs.info.addEventListener("click", (e) => { e.stopPropagation(); this._moreInfo(); });
    this._applyScale();
    this._built = true;
    this._syncStructure();
    this._measure();
  }

  _applyScale() {
    if (!this._refs.card) return;
    const scale = num(this._config.font_scale, 1);
    this._refs.card.style.setProperty("--ss-k", String(scale > 0 ? scale : 1));
  }

  _alertRows(count) {
    const wrap = this._refs.alerts;
    while (wrap.children.length > count) wrap.removeChild(wrap.lastChild);
    while (wrap.children.length < count) {
      const row = document.createElement("div");
      row.className = "alert";
      row.innerHTML = '<ha-icon class="aicon" icon="mdi:alert-outline"></ha-icon>' +
        '<div class="atext"><div class="atitle"></div>' +
        '<div class="ameta"><span class="dot"></span><span class="mtxt"></span></div>' +
        '<div class="adesc"></div><div class="aextra"></div></div>' +
        '<ha-icon class="achev" icon="mdi:chevron-down"></ha-icon>';
      row.addEventListener("click", () => {
        const key = row.dataset.key || "";
        if (row.dataset.hasdesc === "1" && this._config.show_warning_text !== true) {
          this._openAlerts[key] = !this._openAlerts[key];
          this._syncAlertRows();
          return;
        }
        const id = row.dataset.entity;
        if (!id) return;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: id }, bubbles: true, composed: true,
        }));
      });
      wrap.appendChild(row);
    }
    return wrap.children;
  }

  /* collapsed by default, unless the config always shows the text */
  _syncAlertRows() {
    const R = this._refs;
    if (!R.alerts) return;
    const always = this._config.show_warning_text === true;
    const open = this._openAlerts || {};
    Array.prototype.forEach.call(R.alerts.children, (row) => {
      const hasDesc = row.dataset.hasdesc === "1";
      const isOpen = always || !!open[row.dataset.key || ""];
      const extra = row.querySelector(".aextra");
      const chev = row.querySelector(".achev");
      if (extra) extra.hidden = !(hasDesc && isOpen);
      if (chev) {
        chev.hidden = !hasDesc || always;
        chev.setAttribute("icon", isOpen ? "mdi:chevron-up" : "mdi:chevron-down");
      }
      row.classList.toggle("open", hasDesc && isOpen && !always);
      row.style.cursor = hasDesc || row.dataset.entity ? "pointer" : "default";
    });
  }

  _syncStructure() {
    if (!this._built) return;
    const cfg = this._config;
    const zoom = this._zoomed;
    const lowish = (window.innerHeight || 800) < 560;
    const hours = zoom
      ? (lowish ? 6 : (window.innerWidth >= 1100 ? 12 : 8))
      : (cfg.compact ? 0 : Math.max(0, Math.min(12, num(cfg.hours, 6))));
    const days = zoom
      ? (lowish ? 4 : 7)
      : (cfg.compact ? 0 : Math.max(0, Math.min(7, num(cfg.days, 4))));
    this._refs.stripWrap.hidden = hours <= 0;
    this._refs.days.hidden = days <= 0;
    this._refs.strip.classList.toggle("norain", this._config.show_rain_bars === false);
    this._refs.days.classList.toggle("norain", this._config.show_rain_bars === false);
    const strip = this._refs.strip;
    while (strip.children.length > hours) strip.removeChild(strip.lastChild);
    while (strip.children.length < hours) {
      const el = document.createElement("div");
      el.className = "hour";
      el.innerHTML = '<span class="ht"></span><ha-icon icon="mdi:weather-cloudy"></ha-icon>' +
        '<div class="hplot"><span class="hv"></span></div><span class="hp"></span>' +
        '<div class="rain"><span class="rbar"></span></div>';
      strip.appendChild(el);
    }
    const daysEl = this._refs.days;
    daysEl.style.gridTemplateColumns = "repeat(" + Math.max(1, days) + ",1fr)";
    while (daysEl.children.length > days) daysEl.removeChild(daysEl.lastChild);
    while (daysEl.children.length < days) {
      const el = document.createElement("div");
      el.className = "day";
      el.innerHTML = '<span class="dt"></span><ha-icon icon="mdi:weather-cloudy"></ha-icon>' +
        '<span class="dv"></span><span class="dh"></span>' +
        '<div class="rain"><span class="rbar"></span></div>';
      daysEl.appendChild(el);
    }
    if (!this._reduce && cfg.animate !== false) this._start(); else this._drawOnce();
  }

  /* ------------------------------------------------------------- forecast */
  _forecastNeeded() {
    const id = this._config.entity;
    if (!id || !this._hass) return false;
    if (this._fcEntity !== id) { this._fcEntity = id; this._fcAt = 0; this._fc = { hourly: [], daily: [] }; }
    return Date.now() - this._fcAt > 10 * 60 * 1000;
  }
  _ensureForecast() {
    if (!this._forecastNeeded()) return;
    const hass = this._hass, id = this._config.entity;
    this._fcAt = Date.now();
    const st = hass.states[id];
    const legacy = st && Array.isArray(st.attributes.forecast)
      ? st.attributes.forecast.map((f) => ({
        datetime: f.datetime, condition: f.condition, temperature: f.temperature,
        templow: f.templow, precipitation_probability: f.precipitation_probability,
      }))
      : null;
    if (!hass.callWS) {
      /* old integrations without the forecast service: only an hourly list is safe */
      if (legacy) this._fc = { hourly: legacy, daily: [] };
      return;
    }
    const self = this;
    const grab = (resp) => {
      const r = (resp && resp.response) ? resp.response : resp;
      if (!r) return [];
      const keys = Object.keys(r);
      if (!keys.length) return [];
      const first = r[keys[0]];
      if (first && Array.isArray(first.forecast)) return first.forecast;
      if (Array.isArray(first)) return first;
      return [];
    };
    const ask = (type) => hass.callWS({
      type: "call_service",
      domain: "weather",
      service: "get_forecasts",
      service_data: { entity_id: id, type: type },
      return_response: true,
    }).then(grab).catch(() => []);
    Promise.all([ask("hourly"), ask("daily")]).then((res) => {
      const hourly = (res[0] && res[0].length) ? res[0] : (legacy || []);
      self._fc = { hourly: hourly, daily: res[1] || [] };
      self._render();
    });
  }

  /* --------------------------------------------------------------- render */
  _render() {
    if (!this._hass) return;
    if (!this._built) this._build();
    const hass = this._hass, cfg = this._config, R = this._refs;
    const id = cfg.entity;
    const st = id ? hass.states[id] : null;

    if (!id || !st) {
      R.err.hidden = false;
      R.err.textContent = T(hass, "no_entity");
      R.alerts.innerHTML = "";
      return;
    }
    R.err.hidden = true;
    if (R.expand) {
      const can = this._canZoom();
      R.expand.hidden = !can;
      R.expand.style.display = can ? "" : "none";
      R.expand.title = T(hass, "zoom_in");
      R.expand.setAttribute("aria-label", T(hass, "zoom_in"));
    }
    if (R.close) { R.close.title = T(hass, "zoom_out"); R.close.setAttribute("aria-label", T(hass, "zoom_out")); }
    if (R.info) { R.info.title = T(hass, "details"); R.info.setAttribute("aria-label", T(hass, "details")); }

    const a = st.attributes || {};
    const cond = cfg.debug_condition ? String(cfg.debug_condition) : st.state;
    const name = cfg.name || a.friendly_name || id;
    R.place.textContent = name;
    R.condText.textContent = condLabel(cond, hass);
    R.condIcon.setAttribute("icon", condIcon(cond));
    R.temp.textContent = tempText(num(a.temperature, NaN));
    const unit = a.temperature_unit || hass.config && hass.config.unit_system && hass.config.unit_system.temperature || "°C";

    this._ensureForecast();
    const daily = this._fc.daily || [];
    const today = daily.length ? daily[0] : null;
    if (today && (today.temperature !== undefined || today.templow !== undefined)) {
      R.hilo.textContent = isFinite(num(today.templow, NaN))
        ? tempText(num(today.templow, NaN)) + " / " + tempText(num(today.temperature, NaN))
        : tempText(num(today.temperature, NaN));
    } else {
      R.hilo.textContent = a.apparent_temperature !== undefined
        ? T(hass, "feels_like") + " " + tempText(num(a.apparent_temperature, NaN)) : "";
    }

    /* --- warnings ------------------------------------------------------- */
    const warnings = cfg.show_warnings === false
      ? []
      : parseWarnings(hass, cfg.warning_entities);
    if (cfg.debug_warning) {
      warnings.unshift({
        level: num(cfg.debug_warning, 2) || 2,
        title: cardLang(hass) === "de"
          ? "Amtliche WARNUNG vor FROST"
          : "Official FROST warning",
        detail: cardLang(hass) === "de"
          ? "Es tritt leichter Frost bis -3 °C auf."
          : "Light frost down to -3 °C.",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        entity: "",
      });
    }
    R.alerts.hidden = warnings.length === 0;
    const rows = this._alertRows(warnings.length);
    warnings.forEach((w, i) => {
      const row = rows[i];
      const color = levelColor(w.level);
      row.style.setProperty("--ss-level", color);
      row.dataset.entity = w.entity || "";
      row.querySelector(".atitle").textContent = w.title || "";
      const meta = [];
      meta.push(levelLabel(hass, w.level));
      if (w.start && w.end) meta.push(fmtWhen(w.start, hass) + " – " + fmtWhen(w.end, hass));
      else if (w.end) meta.push(T(hass, "until") + " " + fmtWhen(w.end, hass));
      else if (w.start) meta.push(T(hass, "from") + " " + fmtWhen(w.start, hass));
      row.querySelector(".mtxt").textContent = meta.join(" · ");
      const key = (w.entity || "") + "|" + (w.title || "");
      row.dataset.key = key;
      row.dataset.hasdesc = w.extra ? "1" : "";
      const descEl = row.querySelector(".adesc");
      descEl.textContent = w.detail || "";
      descEl.hidden = !w.detail;
      row.querySelector(".aextra").textContent = w.extra || "";
      row.hidden = false;
    });
    this._syncAlertRows();

    /* --- next precipitation --------------------------------------------- */
    const hourly = this._fc.hourly || [];
    if (R.next) {
      var nextTxt = "";
      var curWet = ["rainy", "pouring", "snowy", "snowy-rainy", "hail", "lightning", "lightning-rainy"]
        .indexOf(cond) >= 0;
      if (cfg.show_next !== false && !curWet && hourly.length) {
        for (var hi = 0; hi < hourly.length; hi++) {
          var hf = hourly[hi];
          var hp = num(hf.precipitation_probability, 0);
          var wet = ["rainy", "pouring", "snowy", "snowy-rainy", "hail", "lightning", "lightning-rainy"]
            .indexOf(hf.condition) >= 0;
          if (wet || hp >= 50) {
            var key = hf.condition === "snowy" || hf.condition === "snowy-rainy" ? "next_snow" : "next_rain";
            nextTxt = T(hass, key) + " " + fmtHourPadded(hf.datetime);
            if (hf.condition === "snowy-rainy" || hf.condition === "hail") nextTxt = T(hass, "next_precip") + " " + fmtHourPadded(hf.datetime);
            break;
          }
        }
      }
      R.next.textContent = nextTxt;
      R.next.style.display = nextTxt ? "" : "none";
    }

    /* --- chips ---------------------------------------------------------- */
    const chips = [];
    if (a.humidity !== undefined && a.humidity !== null) {
      chips.push(["mdi:water-percent", T(hass, "humidity"), round(num(a.humidity, 0)) + " %"]);
    }
    if (a.wind_speed !== undefined && a.wind_speed !== null) {
      const wu = a.wind_speed_unit || "km/h";
      chips.push(["mdi:weather-windy", T(hass, "wind"), round(num(a.wind_speed, 0)) + " " + wu + (a.wind_bearing !== undefined ? " " + compass(num(a.wind_bearing, NaN), hass) : "")]);
    }
    const nextRain = hourly.length ? num(hourly[0].precipitation_probability, NaN) : NaN;
    if (isFinite(nextRain) && nextRain > 0) {
      chips.push(["mdi:weather-rainy", T(hass, "rain_chance"), round(nextRain) + " %"]);
    }
    if (this._zoomed) {
      if (a.apparent_temperature !== undefined) {
        chips.push(["mdi:thermometer", T(hass, "feels_like"), tempText(num(a.apparent_temperature, NaN))]);
      }
      if (a.dew_point !== undefined) {
        chips.push(["mdi:water-thermometer", T(hass, "dew_point"), tempText(num(a.dew_point, NaN))]);
      }
      if (a.pressure !== undefined) {
        chips.push(["mdi:gauge", T(hass, "pressure"), round(num(a.pressure, 0)) + " " + (a.pressure_unit || "hPa")]);
      }
      if (a.cloud_coverage !== undefined) {
        chips.push(["mdi:cloud-outline", T(hass, "clouds"), round(num(a.cloud_coverage, 0)) + " %"]);
      }
      if (a.uv_index !== undefined) {
        chips.push(["mdi:sun-wireless-outline", T(hass, "uv"), String(num(a.uv_index, 0))]);
      }
      const sunState = hass.states[this._config.sun_entity || "sun.sun"];
      if (sunState && sunState.attributes) {
        if (sunState.attributes.next_rising) chips.push(["mdi:weather-sunset-up", T(hass, "sunrise"), fmtWhen(sunState.attributes.next_rising, hass)]);
        if (sunState.attributes.next_setting) chips.push(["mdi:weather-sunset-down", T(hass, "sunset"), fmtWhen(sunState.attributes.next_setting, hass)]);
      }
    }
    R.chips.innerHTML = "";
    chips.forEach((c) => {
      const el = document.createElement("div");
      el.className = "chip";
      const ic = document.createElement("ha-icon");
      ic.setAttribute("icon", c[0]);
      const sp = document.createElement("span");
      sp.textContent = c[1] + " " + c[2];
      el.appendChild(ic); el.appendChild(sp);
      R.chips.appendChild(el);
    });

    /* --- hour strip ----------------------------------------------------- */
    if (!R.stripWrap.hidden) {
      const slots = R.strip.children;
      const list = hourly.slice(0, slots.length - 1);
      const temps = [];
      const prec = [];
      Array.prototype.forEach.call(slots, (el, i) => {
        let tempVal = NaN, prob = NaN, prob2rain = NaN, icon = condIcon(cond), label = "";
        if (i === 0) {
          /* the first slot is the live reading, not the first forecast hour */
          label = T(hass, "now");
          tempVal = num(a.temperature, NaN);
          prob = hourly.length ? num(hourly[0].precipitation_probability, NaN) : NaN;
          prob2rain = hourly.length ? num(hourly[0].precipitation, NaN) : NaN;
        } else {
          const f = list[i - 1];
          if (!f) { el.style.display = "none"; temps.push(null); prec.push(null); return; }
          label = fmtHour(f.datetime, hass, false);
          tempVal = num(f.temperature, NaN);
          prob = num(f.precipitation_probability, NaN);
          prob2rain = f.precipitation !== undefined ? num(f.precipitation, NaN) : num(f.precipitation_amount, NaN);
          icon = condIcon(f.condition);
        }
        el.style.display = "";
        el.querySelector(".ht").textContent = label;
        el.querySelector("ha-icon").setAttribute("icon", icon);
        el.querySelector(".hv").textContent = tempText(tempVal);
        el.querySelector(".hp").textContent = isFinite(prob) && prob >= 10 ? round(prob) + "%" : "";
        temps.push(isFinite(tempVal) ? tempVal : null);
        prec.push(isFinite(prob2rain) ? prob2rain : null);
      });
      this._paintCurve(temps);
      this._paintRain(prec);
    }

    /* --- daily ---------------------------------------------------------- */
    if (!R.days.hidden) {
      const list = daily.slice(0, R.days.children.length);
      const dprec = [];
      R.days.style.gridTemplateColumns = "repeat(" + Math.max(1, list.length) + ",1fr)";
      Array.prototype.forEach.call(R.days.children, (el, i) => {
        const f = list[i];
        if (!f) { el.style.display = "none"; dprec.push(null); return; }
        el.style.display = "";
        el.querySelector(".dt").textContent = fmtDay(f.datetime, hass, i);
        el.querySelector("ha-icon").setAttribute("icon", condIcon(f.condition));
        el.querySelector(".dv").textContent = tempText(num(f.temperature, NaN));
        el.querySelector(".dh").textContent = tempText(num(f.templow, NaN));
        const dv = f.precipitation !== undefined ? num(f.precipitation, NaN) : num(f.precipitation_amount, NaN);
        dprec.push(isFinite(dv) ? dv : null);
      });
      this._paintRain(dprec, R.days);
    }

    /* --- sky ------------------------------------------------------------ */
    const scene = sceneOf(cond);
    if (!this._scene || this._scene.key !== cond) {
      this._scene = { key: cond, def: scene };
      this._seed();
    }
    this._sun = this._sunData();
    if (this._zoomed) this._measure();
    this._ensureAnim();
  }

  _canZoom() {
    const mode = this._config.zoom === undefined ? "auto" : this._config.zoom;
    if (mode === "off" || mode === false) return false;
    if (typeof window === "undefined") return false;
    /* innerWidth lies on phones (layout viewport can be 980px) — take the visual viewport */
    const vv = window.visualViewport;
    const vw = (vv && vv.width) || window.innerWidth || 0;
    const vh = (vv && vv.height) || window.innerHeight || 0;
    return vw >= 700 && vh >= 320;
  }

  _moreInfo() {
    const id = this._config.entity;
    if (!id) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: id }, bubbles: true, composed: true,
    }));
  }

  _openZoom() {
    if (this._zoomed || !this._canZoom()) return;
    this._zoomed = true;
    if (this._refs.zoombg) this._refs.zoombg.classList.add("on");
    this._refs.card.classList.add("zoomed");
    document.body.style.overflow = "hidden";
    this._syncStructure();
    this._render();
    this._measure();
    window.addEventListener("keydown", this._onKey);
  }

  _closeZoom() {
    if (!this._zoomed) return;
    this._zoomed = false;
    if (this._refs.zoombg) this._refs.zoombg.classList.remove("on");
    this._refs.card.classList.remove("zoomed");
    document.body.style.overflow = "";
    window.removeEventListener("keydown", this._onKey);
    this._syncStructure();
    this._render();
    this._measure();
  }

  _paintCurve(temps) {
    const R = this._refs;
    if (!R.strip || !R.curveSvg) return;
    const show = this._config.show_curve !== false;
    const slots = R.strip.children;
    const valid = temps.filter(function (t) { return t !== null; });
    const usable = show && valid.length > 1;
    R.curveSvg.style.display = usable ? "" : "none";
    let min = 0, max = 0;
    if (usable) {
      min = Math.min.apply(null, valid);
      max = Math.max.apply(null, valid);
    }
    const k = num(this._config.font_scale, 1) || 1;
    const labelH = Math.round((this._zoomed ? 26 : 20) * k);
    const plotH = Math.round((this._zoomed ? 64 : 50) * k), pad = Math.round((this._zoomed ? 10 : 9) * k);
    const pts = [];
    Array.prototype.forEach.call(slots, (el, i) => {
      const plot = el.querySelector(".hplot");
      const hv = el.querySelector(".hv");
      if (!plot || !hv) return;
      const t = temps[i];
      /* no curve: keep the value centred in a flatter plot box */
      plot.style.height = show ? plotH + "px" : Math.round(22 * k) + "px";
      if (t === null) return;
      let y;
      if (!usable) y = show ? (plotH - 14) / 2 : 0;
      else if (max === min) y = pad + (plotH - pad * 2 - labelH) / 2;
      else y = pad + (1 - (t - min) / (max - min)) * (plotH - pad * 2 - labelH);
      hv.style.top = Math.max(0, Math.round(y)) + "px";
      pts.push({
        x: el.offsetLeft + el.offsetWidth / 2,
        y: plot.offsetTop + Math.round(y) + Math.round(labelH / 2),
        w: (hv.offsetWidth || 20) / 2 + Math.round(4 * k),
      });
    });
    if (!usable) { R.curveLine.setAttribute("d", ""); return; }
    const w = R.strip.clientWidth || 0, h = R.strip.clientHeight || 0;
    R.curveSvg.setAttribute("viewBox", "0 0 " + w + " " + h);
    /* one segment per pair, shortened at both ends so the line never runs through a value */
    let d = "";
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const t1 = a.w / len, t2 = b.w / len;
      if (t1 + t2 >= 0.96) continue;
      const x1 = a.x + dx * t1, y1 = a.y + dy * t1;
      const x2 = b.x - dx * t2, y2 = b.y - dy * t2;
      d += "M" + x1.toFixed(1) + " " + y1.toFixed(1) + "L" + x2.toFixed(1) + " " + y2.toFixed(1);
    }
    R.curveLine.setAttribute("d", d);
  }

  /* precipitation per hour as bars, scaled to the wettest hour shown */
  _paintRain(prec, root) {
    const box = root || this._refs.strip;
    if (!box) return;
    const off = this._config.show_rain_bars === false;
    const slots = box.children;
    const vals = prec.filter(function (v) { return v !== null && v > 0; });
    const max = vals.length ? Math.max.apply(null, vals) : 0;
    Array.prototype.forEach.call(slots, (el, i) => {
      const bar = el.querySelector(".rbar");
      if (!bar) return;
      if (off || !vals.length) { bar.style.height = "0px"; bar.style.opacity = "0"; return; }
      const v = prec[i];
      const pct = (v && v > 0) ? Math.max(8, Math.round((v / max) * 100)) : 0;
      bar.style.height = pct ? pct + "%" : "0px";
      bar.style.opacity = pct ? "1" : "0";
    });
  }

  _sunData() {
    const hass = this._hass;
    const id = this._config.sun_entity || "sun.sun";
    const st = hass.states[id];
    if (!st) return { elevation: 20, azimuth: 180, phase: 0.5 };
    return {
      elevation: num(st.attributes.elevation, 20),
      azimuth: num(st.attributes.azimuth, 180),
      phase: moonPhase(),
    };
  }

  /* ------------------------------------------------------------ particles */
  _seed() {
    const def = this._scene.def;
    const w = this._w || 600, h = this._h || 300;
    const windSpeed = num((this._hass.states[this._config.entity] || { attributes: {} }).attributes.wind_speed, 10);
    const windTilt = clamp(windSpeed / 60, 0, 0.6);

    this._clouds = [];
    const cloudCount = Math.round(def.clouds * 9);
    for (let i = 0; i < cloudCount; i++) {
      this._clouds.push({
        x: Math.random() * w,
        y: 8 + Math.random() * h * 0.45,
        r: 26 + Math.random() * 52,
        a: 0.1 + Math.random() * 0.26,
        v: (0.05 + Math.random() * 0.16) * (0.4 + def.wind * 2.4),
        puffs: 3 + Math.floor(Math.random() * 3),
        seed: Math.random() * 6.28,
      });
    }

    this._stars = [];
    if (def.clouds < 0.6) {
      for (let i = 0; i < 90; i++) {
        this._stars.push({
          x: Math.random() * w, y: Math.random() * h * 0.7,
          r: 0.5 + Math.random() * 1.1, ph: Math.random() * 6.28,
          sp: 0.4 + Math.random() * 1.2,
        });
      }
    }

    this._fog = [];
    if (def.fog > 0) {
      for (let i = 0; i < 4; i++) {
        this._fog.push({
          y: h * (0.35 + i * 0.16),
          h: 26 + Math.random() * 26,
          a: def.fog * (0.16 + Math.random() * 0.16),
          x: Math.random() * w,
          v: 0.06 + Math.random() * 0.12,
        });
      }
    }

    const rainCount = Math.round(def.rain * 150);
    const snowCount = Math.round(def.snow * 110);
    this._particles = { rain: [], snow: [], tilt: windTilt };
    for (let i = 0; i < rainCount; i++) {
      this._particles.rain.push({
        x: Math.random() * w, y: Math.random() * h,
        l: 8 + Math.random() * 14, v: 220 + Math.random() * 220,
        a: 0.30 + Math.random() * 0.45,
      });
    }
    for (let i = 0; i < snowCount; i++) {
      this._particles.snow.push({
        x: Math.random() * w, y: Math.random() * h,
        r: 0.9 + Math.random() * 1.8, v: 16 + Math.random() * 26,
        sw: 0.4 + Math.random() * 1.2, ph: Math.random() * 6.28,
        a: 0.35 + Math.random() * 0.4,
      });
    }
  }

  /* ------------------------------------------------------------- painting */
  _measure() {
    if (!this._built) return;
    const canvas = this._refs.canvas;
    const rect = this._refs.card.getBoundingClientRect();
    const el = this._refs.card;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    /* hard clamp: a bogus rect must never blow up the canvas (and then the card) */
    const w = Math.min(6000, Math.max(1, Math.round(rect.width)));
    const h = Math.min(2400, Math.max(1, Math.round(rect.height)));
    this._w = w; this._h = h;
    if (this._refs.expand) {
      const allowed = this._canZoom();
      this._refs.expand.hidden = !allowed;
      this._refs.expand.style.display = allowed ? "" : "none";
    }
    if (w === this._wOld && h === this._hOld && dpr === this._dpr) return;
    this._wOld = w; this._hOld = h;
    this._dpr = dpr;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    /* sizing stays in CSS (100% of the card) — inline px sizes fed back into the layout */
    this._ctx = canvas.getContext("2d");
    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this._scene) this._seed();
    this._drawOnce();
  }

  _drawOnce() {
    if (!this._built) return;
    this._measure();
    if (!this._ctx) return;
    this._paint(0);
  }

  /* the frame loop dies when the view is swapped — restart it on every render */
  _ensureAnim() {
    if (this._reduce || this._config.animate === false) { this._drawOnce(); return; }
    if (this._timer) return;
    /* do not trust the observer alone — a view swap can leave it stale */
    if (typeof this.getBoundingClientRect === "function") {
      const r = this.getBoundingClientRect();
      if (r && r.width > 0 && r.height > 0) this._visible = true;
    }
    if (this._visible) this._start();
  }

  /* a timer, not requestAnimationFrame: rAF stops delivering frames after the
     view has been swapped, and nothing brings the chain back */
  _start() {
    if (this._timer || this._reduce || this._config.animate === false) {
      if (this._reduce || this._config.animate === false) this._drawOnce();
      return;
    }
    if (!this._visible) return;
    this._timer = setInterval(() => {
      if (document.hidden) return;
      const ts = now();
      if (ts - this._lastFrame < this._frameMs) return;
      this._lastFrame = ts;
      this._paint(ts);
    }, Math.max(16, Math.round(this._frameMs)));
  }
  _stop() {
    if (this._timer) clearInterval(this._timer);
    this._timer = 0;
  }

  _paint(ts) {
    const ctx = this._ctx;
    if (!ctx || !this._scene) return;
    const w = this._w, h = this._h, def = this._scene.def;
    const t = ts / 1000;
    const sun = this._sun || { elevation: 20, azimuth: 180, phase: 0.5 };
    const nightCond = /night/i.test(this._scene.key);
    const df = dayFactor(sun.elevation);
    const day = this._config.debug_night ? 0 : (nightCond ? Math.min(df, 0.1) : df);
    /* the sky shows a sun only while it is really up (and the condition is not a night one) */
    const isNight = this._config.debug_night ? true : (nightCond || df < 0.55);

    /* sky gradient */
    const top = mixRgb(def.night[0], def.day[0], day);
    const mid = mixRgb(def.night[1], def.day[1], day);
    const low = mixRgb(def.night[2], def.day[2], day);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, rgb(top));
    g.addColorStop(0.55, rgb(mid));
    g.addColorStop(1, rgb(low));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    /* stars */
    if (this._stars && day < 0.75) {
      const alphaBase = 1 - day / 0.75;
      this._stars.forEach((s) => {
        const tw = 0.55 + 0.45 * Math.sin(t * s.sp + s.ph);
        ctx.globalAlpha = alphaBase * tw * 0.9;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.2832);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    /* sun or moon */
    const sunX = w * (0.18 + 0.64 * clamp(sun.azimuth / 360, 0, 1));
    const sunY = h * (0.30 - 0.14 * clamp((sun.elevation + 6) / 66, 0, 1));
    if (!isNight) {
      const warm = clamp(1 - sun.elevation / 22, 0, 1);
      const core = mixRgb([255, 246, 214], [255, 176, 92], warm);
      const glow = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, 96);
      glow.addColorStop(0, rgb(core, 0.85));
      glow.addColorStop(0.35, rgb(core, 0.22));
      glow.addColorStop(1, rgb(core, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 96, 0, 6.2832);
      ctx.fill();
      ctx.fillStyle = rgb(core, 0.95);
      ctx.beginPath();
      ctx.arc(sunX, sunY, 16, 0, 6.2832);
      ctx.fill();
    } else {
      /* moon with phase */
      const mx = w * 0.78, my = h * 0.2, mr = 15;
      const mg = ctx.createRadialGradient(mx, my, 2, mx, my, mr * 4);
      mg.addColorStop(0, "rgba(226,236,255,0.30)");
      mg.addColorStop(1, "rgba(226,236,255,0)");
      ctx.fillStyle = mg;
      ctx.beginPath(); ctx.arc(mx, my, mr * 4, 0, 6.2832); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.2832); ctx.clip();
      ctx.fillStyle = "rgba(233,240,255,0.92)";
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.2832); ctx.fill();
      const shadowX = mx + (sun.phase * 2 - 1) * mr * 2.05;
      ctx.fillStyle = rgb(top, 0.94);
      ctx.beginPath(); ctx.arc(shadowX, my, mr * 1.02, 0, 6.2832); ctx.fill();
      ctx.restore();
    }

    /* clouds */
    if (this._clouds) {
      const cloudColor = mixRgb([46, 56, 70], [255, 255, 255], day * 0.82);
      this._clouds.forEach((c) => {
        c.x += c.v * (ts ? 0.016 : 0);
        if (c.x - c.r * 2 > w) c.x = -c.r * 2;
        for (let p = 0; p < c.puffs; p++) {
          const ox = (p - c.puffs / 2) * c.r * 0.55 + Math.sin(c.seed + p) * 6;
          const oy = Math.cos(c.seed + p * 1.7) * c.r * 0.16;
          const rg = ctx.createRadialGradient(c.x + ox, c.y + oy, 1, c.x + ox, c.y + oy, c.r);
          rg.addColorStop(0, rgb(cloudColor, c.a));
          rg.addColorStop(1, rgb(cloudColor, 0));
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.arc(c.x + ox, c.y + oy, c.r, 0, 6.2832);
          ctx.fill();
        }
      });
    }

    /* rain */
    if (this._particles && this._particles.rain.length) {
      const tilt = this._particles.tilt;
      ctx.strokeStyle = "rgba(214,238,255,0.85)";
      ctx.lineWidth = 1.3;
      this._particles.rain.forEach((d) => {
        if (ts) {
          d.y += d.v * 0.016;
          d.x += d.v * 0.016 * tilt;
          if (d.y > h) { d.y = -12; d.x = Math.random() * w; }
          if (d.x > w) d.x -= w;
        }
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.l * tilt, d.y + d.l);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    /* snow */
    if (this._particles && this._particles.snow.length) {
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      this._particles.snow.forEach((s) => {
        if (ts) {
          s.y += s.v * 0.016;
          s.ph += 0.02;
          s.x += Math.sin(s.ph) * s.sw * 0.5;
          if (s.y > h) { s.y = -6; s.x = Math.random() * w; }
        }
        ctx.globalAlpha = s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.2832);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    /* fog bands */
    if (this._fog && this._fog.length) {
      this._fog.forEach((f) => {
        if (ts) {
          f.x += f.v;
          if (f.x > w) f.x = -w * 0.5;
        }
        const fg = ctx.createLinearGradient(f.x - w * 0.5, f.y, f.x + w * 0.9, f.y);
        fg.addColorStop(0, "rgba(226,232,238,0)");
        fg.addColorStop(0.5, "rgba(226,232,238," + f.a + ")");
        fg.addColorStop(1, "rgba(226,232,238,0)");
        ctx.fillStyle = fg;
        ctx.fillRect(0, f.y - f.h / 2, w, f.h);
      });
    }

    /* wind streaks */
    if (def.wind > 0.6 && ts) {
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1.6;
      for (let i = 0; i < 5; i++) {
        const y = h * (0.2 + i * 0.13);
        const off = (t * 90 + i * 120) % (w + 200) - 100;
        ctx.beginPath();
        ctx.moveTo(off, y);
        ctx.bezierCurveTo(off + 40, y - 8, off + 80, y + 8, off + 130, y);
        ctx.stroke();
      }
    }

    /* lightning */
    if (def.bolt && ts) {
      if (!this._nextBolt) this._nextBolt = ts + 3500 + Math.random() * 6000;
      if (ts > this._nextBolt) {
        this._flash = 1;
        this._nextBolt = ts + 4500 + Math.random() * 8000;
      }
      if (this._flash > 0.01) {
        ctx.fillStyle = "rgba(226,236,255," + (this._flash * 0.5) + ")";
        ctx.fillRect(0, 0, w, h);
        if (this._flash > 0.75) {
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          let x = w * (0.3 + Math.random() * 0.4), y = 0;
          ctx.moveTo(x, y);
          while (y < h * 0.55) {
            x += (Math.random() - 0.5) * 26;
            y += 12 + Math.random() * 16;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        this._flash *= 0.86;
      }
    }
  }
}

/* --------------------------------------------------------------- register */
if (!customElements.get(TAG)) {
  customElements.define(TAG, SkyShieldCard);
}
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === TAG)) {
  window.customCards.push({
    type: TAG,
    name: "SkyShield Weather Card",
    description: "Animated sky with severe-weather warnings inside the card.",
    preview: true,
    documentationURL: "https://github.com/Pissbirne/skyshield-weather-card",
  });
}

/* --------------------------------------------------------------- translate */
function condLabel(condition, hass) {
  const de = {
    sunny: "Sonnig", "clear-night": "Klar", partlycloudy: "Teils bewölkt",
    cloudy: "Bewölkt", fog: "Nebel", hail: "Hagel", lightning: "Gewitter",
    "lightning-rainy": "Gewitter mit Regen", pouring: "Starkregen", rainy: "Regen",
    snowy: "Schnee", "snowy-rainy": "Schnee und Regen", windy: "Windig",
    "windy-variant": "Windig", exceptional: "Unwetter",
  };
  const en = {
    sunny: "Sunny", "clear-night": "Clear", partlycloudy: "Partly cloudy",
    cloudy: "Cloudy", fog: "Fog", hail: "Hail", lightning: "Thunderstorm",
    "lightning-rainy": "Thunderstorm", pouring: "Pouring", rainy: "Rain",
    snowy: "Snow", "snowy-rainy": "Snow and rain", windy: "Windy",
    "windy-variant": "Windy", exceptional: "Exceptional",
  };
  const table = cardLang(hass) === "de" ? de : en;
  return table[condition] || String(condition).replace(/-/g, " ");
}

function moonPhase() {
  const synodic = 29.530588853;
  const newMoon = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
  const days = Date.now() / 86400000 - newMoon;
  const p = ((days % synodic) + synodic) % synodic / synodic;
  return p;
}

export { SkyShieldCard as SkyShieldCard, parseWarnings as parseWarnings, sceneOf as sceneOf, dayFactor as dayFactor };

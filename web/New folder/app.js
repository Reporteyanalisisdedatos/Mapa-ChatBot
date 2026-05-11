// ============================================================
// app.js — Mapa de Atenciones en Salud – Municipalidad de Córdoba
// ============================================================

const TIPO_CS    = "Centro de Salud";
const TIPOS_DEM  = ["DEM", "Servicio Odontológico Municipal"];
const TIPOS_HOSP = ["Hospital Municipal Cordoba", "Hospital de Pronta Atención", "Padre La Monaca"];

function esTipoCS(t)   { return t === TIPO_CS; }
function esTipoDEM(t)  { return TIPOS_DEM.includes(t); }
function esTipoHosp(t) { return TIPOS_HOSP.includes(t); }

// ── SVGs: edificios con complejidad visual progresiva ─────────
// Todos 28×36 px en el mapa para no ocupar demasiado espacio

// CS — dispensario chico: una sola planta, techo simple, puerta, cruz pequeña
const SVG_CS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="28" height="36">
  <ellipse cx="20" cy="50" rx="8" ry="2.5" fill="rgba(0,0,0,0.18)"/>
  <!-- techo -->
  <polygon points="4,22 20,8 36,22" fill="#27ae60"/>
  <polygon points="7,22 20,11 33,22" fill="#2ecc71"/>
  <!-- cuerpo -->
  <rect x="7" y="22" width="26" height="18" rx="1" fill="#2ecc71"/>
  <rect x="7" y="22" width="26" height="18" rx="1" fill="none" stroke="#27ae60" stroke-width="1.2"/>
  <!-- puerta -->
  <rect x="16" y="32" width="8" height="8" rx="1" fill="#1a6e35"/>
  <!-- cruz -->
  <rect x="18.5" y="25" width="3" height="9" rx="1" fill="white"/>
  <rect x="15.5" y="27.5" width="9" height="3" rx="1" fill="white"/>
</svg>`;

// DEM — edificio mediano: dos plantas, techo con cumbrera, ventanas, diente
const SVG_DEM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="28" height="36">
  <ellipse cx="20" cy="50" rx="8" ry="2.5" fill="rgba(0,0,0,0.18)"/>
  <!-- techo -->
  <polygon points="2,22 20,6 38,22" fill="#2471a3"/>
  <polygon points="5,22 20,9 35,22" fill="#2980b9"/>
  <!-- cuerpo -->
  <rect x="5" y="22" width="30" height="22" rx="1" fill="#2980b9"/>
  <rect x="5" y="22" width="30" height="22" rx="1" fill="none" stroke="#2471a3" stroke-width="1.2"/>
  <!-- línea piso -->
  <line x1="5" y1="33" x2="35" y2="33" stroke="#2471a3" stroke-width="1"/>
  <!-- ventanas piso 2 -->
  <rect x="9"  y="25" width="7" height="6" rx="1" fill="white" opacity="0.85"/>
  <rect x="24" y="25" width="7" height="6" rx="1" fill="white" opacity="0.85"/>
  <!-- puerta -->
  <rect x="15" y="36" width="10" height="8" rx="1" fill="#1a4f72"/>
  <!-- diente pequeño arriba de puerta -->
  <path d="M17 26.5 Q16 26.5 16 28 Q16 29.2 17 29.7 L17 31.5 Q17 32 17.5 32 Q18 32 18 31.5 L18 30.3 Q18 29.8 18.5 29.8 Q19 29.8 19 30.3 L19 31.5 Q19 32 19.5 32 Q20 32 20 31.5 L20 29.7 Q21 29.2 21 28 Q21 26.5 20 26.5 Q19.2 26.5 18.5 27.2 Q17.8 26.5 17 26.5Z" fill="white" transform="translate(2.5,0)"/>
</svg>`;

// HOSP — hospital grande: tres plantas, techo plano con parapeto, múltiples ventanas, H grande, columnas
const SVG_HOSP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="28" height="36">
  <ellipse cx="20" cy="50" rx="8" ry="2.5" fill="rgba(0,0,0,0.18)"/>
  <!-- parapeto techo -->
  <rect x="2" y="7" width="36" height="4" rx="1" fill="#922b21"/>
  <!-- cuerpo principal -->
  <rect x="2" y="11" width="36" height="33" rx="1" fill="#e74c3c"/>
  <rect x="2" y="11" width="36" height="33" rx="1" fill="none" stroke="#922b21" stroke-width="1.2"/>
  <!-- líneas piso -->
  <line x1="2" y1="22" x2="38" y2="22" stroke="#922b21" stroke-width="0.9"/>
  <line x1="2" y1="33" x2="38" y2="33" stroke="#922b21" stroke-width="0.9"/>
  <!-- ventanas piso 3 -->
  <rect x="5"  y="13" width="6" height="7" rx="1" fill="white" opacity="0.85"/>
  <rect x="17" y="13" width="6" height="7" rx="1" fill="white" opacity="0.85"/>
  <rect x="29" y="13" width="6" height="7" rx="1" fill="white" opacity="0.85"/>
  <!-- ventanas piso 2 -->
  <rect x="5"  y="24" width="6" height="7" rx="1" fill="white" opacity="0.85"/>
  <rect x="29" y="24" width="6" height="7" rx="1" fill="white" opacity="0.85"/>
  <!-- H grande piso 2 (centro) -->
  <rect x="16" y="24" width="3.5" height="8" rx="0.8" fill="white"/>
  <rect x="20.5" y="24" width="3.5" height="8" rx="0.8" fill="white"/>
  <rect x="16" y="27.2" width="8" height="2.5" rx="0.8" fill="white"/>
  <!-- entrada: escalones + columnas + puerta -->
  <rect x="1"  y="42" width="38" height="2" rx="0.5" fill="#922b21"/>
  <rect x="10" y="34" width="5"  height="10" rx="0.5" fill="#c0392b"/>
  <rect x="25" y="34" width="5"  height="10" rx="0.5" fill="#c0392b"/>
  <rect x="14" y="36" width="12" height="8"  rx="1"   fill="#7b241c"/>
</svg>`;

// ── Íconos del mapa usando imágenes reales de assets ─────────
const iconCS = L.icon({
  iconUrl: './assets/CS.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  tooltipAnchor: [0, -32]
});

const iconDEM = L.icon({
  iconUrl: './assets/DEM.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  tooltipAnchor: [0, -40]
});

const iconHosp = L.icon({
  iconUrl: './assets/hospital.png',
  iconSize: [46, 46],
  iconAnchor: [23, 46],
  tooltipAnchor: [0, -46]
});

function getIcon(tipo) {
  if (esTipoCS(tipo))   return iconCS;
  if (esTipoDEM(tipo))  return iconDEM;
  if (esTipoHosp(tipo)) return iconHosp;
  return iconCS;
}

// ── SVGs pequeños para sidebar/leyenda ────────────────────────
function svgSmall(svgStr, w, h) {
  return svgStr
    .replace(/width="\d+"/, `width="${w}"`)
    .replace(/height="\d+"/, `height="${h}"`);
}

// ── Colores zonas ─────────────────────────────────────────────
const ZONA_COLORS = [
  "#D62839",  // rojo intenso
  "#0057B8",  // azul royal
  "#FF6B00",  // naranja fuerte
  "#007A33",  // verde bosque
  "#7B2D8B",  // violeta oscuro
  "#00827F",  // teal oscuro
  "#C17B00",  // dorado oscuro
  "#1B4F72",  // azul marino
  "#8B0000",  // rojo oscuro
  "#2E7D32",  // verde oscuro
  "#4A148C",  // morado profundo
  "#BF360C"   // terracota
];

// ── Centro geográfico de referencia (Plaza San Martín, Córdoba) ──
const GEO_CENTER_LAT = -31.4135;
const GEO_CENTER_LNG = -64.1811;

// ── Puntos cardinales ─────────────────────────────────────────
const CARDINAL_COLORS = {
  Norte: "#2563eb",
  Sur:   "#dc2626",
  Este:  "#16a34a",
  Oeste: "#d97706"
};
const CARDINAL_ICONS = { Norte: "↑", Sur: "↓", Este: "→", Oeste: "←" };

function getCardinal(lat, lng) {
  const dlat = lat - GEO_CENTER_LAT;
  const dlng = lng - GEO_CENTER_LNG;
  // Usa el componente dominante para asignar un único cardinal
  if (Math.abs(dlat) >= Math.abs(dlng)) {
    return dlat >= 0 ? "Norte" : "Sur";
  } else {
    return dlng >= 0 ? "Este" : "Oeste";
  }
}

// ── Datos globales ────────────────────────────────────────────
let allRows  = [];
let zonasGeo = null;

// ── Refs UI ───────────────────────────────────────────────────
const statusEl       = document.getElementById("status");
const filterLegendEl = document.getElementById("filterLegend");

// ── Mapa ──────────────────────────────────────────────────────
const map = L.map("map").setView([-31.4201, -64.1888], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const layerCS    = L.layerGroup().addTo(map);
const layerDEM   = L.layerGroup();
const layerHosp  = L.layerGroup();
const layerZonas = L.layerGroup().addTo(map);

// ── Render marcadores ─────────────────────────────────────────
// rows: ya viene pre-filtrado (por tipo + zona + selección de centros)
function renderMarkers(layer, rows) {
  layer.clearLayers();
  let count = 0;
  rows.forEach(r => {
    const lat = parseFloat(r.Latitud);
    const lng = parseFloat(r.Longitud);
    if (!isFinite(lat) || !isFinite(lng)) return;

    let tip = `<b style="font-size:16px;color:#111">${r.Centro}</b>`;
    if (r.Tipo)      tip += `<br/><span style="color:#222;font-size:13px">${r.Tipo}</span>`;
    if (r.Direccion) tip += `<br/><span style="font-size:13px;color:#111">Dirección: ${r.Direccion}</span>`;
    if (r.Horario)   tip += `<br/><span style="font-size:13px;color:#111">Horario: ${r.Horario}</span>`;
    if (r.servicios) tip += `<br/><span style="font-size:13px;color:#222">Servicios: ${r.servicios}</span>`;
    if (esTipoCS(r.Tipo)) tip += `<br/><hr style="margin:5px 0;border:none;border-top:1px solid #ddd"/><span style="font-size:13px;color:#1a2e4a;font-style:italic">Por cualquier otra consulta, comunicate al CallCenter <b>0800-888-5555</b> o acercate directamente al Centro de Salud</span>`;

    L.marker([lat, lng], { icon: getIcon(r.Tipo) })
     .bindTooltip(tip, { sticky: true, opacity: 0.97, maxWidth: 280 })
     .addTo(layer);
    count++;
  });
  return count;
}

// ── Render zonas ──────────────────────────────────────────────
function renderZonas(selSet) {
  layerZonas.clearLayers();
  if (!zonasGeo || selSet.size === 0) return;
  let idx = 0;
  // Construir set normalizado para comparar sin importar mayúsculas/minúsculas
  const selSetNorm = new Set([...selSet].map(z => normZona(z)));

  zonasGeo.features.forEach(feat => {
    const name = feat.properties.name;
    if (!name || !selSetNorm.has(normZona(name))) return;
    const color = ZONA_COLORS[idx++ % ZONA_COLORS.length];
    L.geoJSON(feat, { style: { color, weight: 3.5, opacity: 1, fillOpacity: 0.18, fillColor: color, dashArray: null } })
     .bindTooltip(`<b>Zona: ${name}</b>`, { sticky: true, opacity: 0.9 })
     .addTo(layerZonas);
  });
}

// ── Toggle layer ──────────────────────────────────────────────
function toggleLayer(layer, show) {
  if (show && !map.hasLayer(layer)) layer.addTo(map);
  if (!show && map.hasLayer(layer)) map.removeLayer(layer);
}

// ── Dropdown ──────────────────────────────────────────────────
function initDropdown(ids) {
  const wrap  = document.getElementById(ids.wrap);
  const btn   = document.getElementById(ids.btn);
  const drop  = document.getElementById(ids.drop);
  const list  = document.getElementById(ids.list);
  const allB  = document.getElementById(ids.all);
  const noneB = document.getElementById(ids.none);
  const applyB= document.getElementById(ids.apply);

  const open = v => drop.classList.toggle("open", v);
  btn.addEventListener("click", e => { e.stopPropagation(); open(!drop.classList.contains("open")); });
  document.addEventListener("click", e => { if (!wrap.contains(e.target)) open(false); });
  allB.addEventListener("click",   () => list.querySelectorAll("input").forEach(c => c.checked = true));
  noneB.addEventListener("click",  () => list.querySelectorAll("input").forEach(c => c.checked = false));
  applyB.addEventListener("click", () => { open(false); applyFilter(); });

  return {
    getSet:  () => new Set([...list.querySelectorAll("input:checked")].map(c => c.value)),
    setAll:  s  => list.querySelectorAll("input").forEach(c => c.checked = s),
    total:   ()  => list.querySelectorAll("input").length,
    checked: ()  => list.querySelectorAll("input:checked").length,
    btn
  };
}

function buildList(listEl, items, defaultChecked) {
  listEl.innerHTML = items.map(v => `
    <label class="ms-item">
      <input type="checkbox" value="${v.replace(/"/g,'&quot;')}" ${defaultChecked ? "checked" : ""}>
      <span>${v}</span>
    </label>`).join("");
}

let ctrlCS, ctrlDEM, ctrlHosp, ctrlZonas, ctrlCardinal;

function getZonaRow(r) {
  // soporta distintas variantes de nombre de campo
  return (r.zona ?? r.Zona ?? r.ZONA ?? "").toString().trim();
}

function normZona(z) {
  // normaliza para comparar: sin tildes, sin espacios raros, upper
  return z.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim().replace(/\s+/g, " ");
}


// ── Filtro por zona usando campo del JSON ─────────────────────
function rowEnZonas(r, selZonas) {
  if (selZonas.size === 0) return true;

  const zr = getZonaRow(r);
  if (!zr) return false;

  const zrN = normZona(zr);

  // comparo normalizado contra las zonas seleccionadas normalizadas
  for (const z of selZonas) {
    if (zrN === normZona(z)) return true;
  }
  return false;
}

// ── Apply filter ──────────────────────────────────────────────
function applyFilter() {
  const selCS       = ctrlCS.getSet();
  const selDEM      = ctrlDEM.getSet();
  const selHosp     = ctrlHosp.getSet();
  const selZonas    = ctrlZonas.getSet();
  const selCardinal = ctrlCardinal.getSet();

  const hayZona     = selZonas.size > 0;
  const hayCardinal = selCardinal.size > 0;

  // Paso 1: separar por tipo
  const todosCS   = allRows.filter(r => esTipoCS(r.Tipo));
  const todosDEM  = allRows.filter(r => esTipoDEM(r.Tipo));
  const todosHosp = allRows.filter(r => esTipoHosp(r.Tipo));

  // Paso 2: filtro cardinal
  const enCardinal = r => {
    if (!hayCardinal) return true;
    const lat = parseFloat(r.Latitud), lng = parseFloat(r.Longitud);
    if (!isFinite(lat) || !isFinite(lng)) return false;
    return selCardinal.has(getCardinal(lat, lng));
  };

  // Paso 3: filtro zona
  const enZona = r => rowEnZonas(r, selZonas);

  const filtroBase = r => enCardinal(r) && (!hayZona || enZona(r));

  const csBase   = todosCS.filter(filtroBase);
  const demBase  = todosDEM.filter(filtroBase);
  const hospBase = todosHosp.filter(filtroBase);

  // Paso 4: filtro individual de centro (solo si no hay zona activa)
  const rowsCS   = hayZona ? csBase   : csBase.filter(r => selCS.has(r.Centro));
  const rowsDEM  = hayZona ? demBase  : demBase.filter(r => selDEM.has(r.Centro));
  const rowsHosp = hayZona ? hospBase : hospBase.filter(r => selHosp.has(r.Centro));

  const mostrarCS   = hayZona || hayCardinal || selCS.size > 0;
  const mostrarDEM  = hayZona || hayCardinal || selDEM.size > 0;
  const mostrarHosp = hayZona || hayCardinal || selHosp.size > 0;

  const nCS   = mostrarCS   ? renderMarkers(layerCS,   rowsCS)   : (layerCS.clearLayers(),   0);
  const nDEM  = mostrarDEM  ? renderMarkers(layerDEM,  rowsDEM)  : (layerDEM.clearLayers(),  0);
  const nHosp = mostrarHosp ? renderMarkers(layerHosp, rowsHosp) : (layerHosp.clearLayers(), 0);

  toggleLayer(layerCS,   nCS   > 0);
  toggleLayer(layerDEM,  nDEM  > 0);
  toggleLayer(layerHosp, nHosp > 0);

  // Zonas geográficas
  if (hayZona) {
    if (!map.hasLayer(layerZonas)) layerZonas.addTo(map);
    renderZonas(selZonas);
  } else {
    layerZonas.clearLayers();
    if (map.hasLayer(layerZonas)) map.removeLayer(layerZonas);
  }

  // Textos botones
  const labelBtn = (ctrl, total) => {
    const n = ctrl.checked();
    ctrl.btn.textContent = n === 0 ? "Ninguno" : n === total ? `Todos (${total})` : `${n} seleccionado/s`;
  };
  labelBtn(ctrlCS,   todosCS.length);
  labelBtn(ctrlDEM,  todosDEM.length);
  labelBtn(ctrlHosp, todosHosp.length);
  const nZ = ctrlZonas.checked(), tZ = ctrlZonas.total();
  ctrlZonas.btn.textContent = nZ === 0 ? "Ninguna" : nZ === tZ ? `Todas (${tZ})` : `${nZ} seleccionadas`;
  const nC = ctrlCardinal.checked(), tC = ctrlCardinal.total();
  ctrlCardinal.btn.textContent = nC === 0 ? "Ninguno" : nC === tC ? `Todos (${tC})` : `${nC} seleccionados`;

  // Leyenda
  const items = [];
  if (nCS   > 0) items.push(`<div class="legend-item"><img src="./assets/CS.png" style="width:20px;height:20px;object-fit:contain"/><span>Centro de Salud</span></div>`);
  if (nDEM  > 0) items.push(`<div class="legend-item"><img src="./assets/DEM.png" style="width:20px;height:20px;object-fit:contain"/><span>DEM / Odontología</span></div>`);
  if (nHosp > 0) items.push(`<div class="legend-item"><img src="./assets/hospital.png" style="width:20px;height:20px;object-fit:contain"/><span>Hospital</span></div>`);
  [...selZonas].forEach((z, i) => {
    const c = ZONA_COLORS[i % ZONA_COLORS.length];
    items.push(`<div class="legend-item"><div style="width:14px;height:14px;border-radius:3px;background:${c};flex-shrink:0"></div><span>${z}</span></div>`);
  });
  [...selCardinal].forEach(card => {
    const c = CARDINAL_COLORS[card];
    const count = [...rowsCS, ...rowsDEM, ...rowsHosp].filter(r => {
      const lat = parseFloat(r.Latitud), lng = parseFloat(r.Longitud);
      return isFinite(lat) && isFinite(lng) && getCardinal(lat, lng) === card;
    }).length;
    items.push(`<div class="legend-item"><div style="width:14px;height:14px;border-radius:50%;background:${c};flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700">${CARDINAL_ICONS[card]}</div><span>${card} <b>(${count})</b></span></div>`);
  });
  if (items.length) {
    filterLegendEl.innerHTML = `<div class="legend-title">Referencias</div>${items.join("")}`;
    filterLegendEl.style.display = "block";
  } else {
    filterLegendEl.style.display = "none";
  }
}

function setStatus(t, ok) {
  statusEl.textContent = t;
  statusEl.className   = ok ? "status-text success" : "status-text";
}

document.getElementById("clearFiltersBtn").addEventListener("click", () => {
  ctrlCS.setAll(true);
  ctrlDEM.setAll(false);
  ctrlHosp.setAll(false);
  ctrlZonas.setAll(false);
  ctrlCardinal.setAll(false);
  applyFilter();
});

// ── Init ──────────────────────────────────────────────────────
(async function main() {
  try {
    setStatus("Cargando datos...");

    const json = await fetch(`./data/cs_servicios.json?v=${Date.now()}`, { cache:"no-store" }).then(r => r.json());
    allRows = json.data || [];

    try {
      zonasGeo = await fetch(`./layers/ZONA.json?v=${Date.now()}`, { cache:"no-store" }).then(r => r.json());
    } catch(e) {
      console.warn("ZONA.json no disponible");
      zonasGeo = { features: [] };
    }

    const listCS    = allRows.filter(r => esTipoCS(r.Tipo)).map(r => r.Centro).sort();
    const listDEM   = allRows.filter(r => esTipoDEM(r.Tipo)).map(r => r.Centro).sort();
    const listHosp  = allRows.filter(r => esTipoHosp(r.Tipo)).map(r => r.Centro).sort();

    // Zonas: tomar del campo 'zona' del JSON (fuente primaria), complementar con GeoJSON si hay
    const zonasDesdeJSON = [...new Set(allRows.map(r => getZonaRow(r)).filter(Boolean))].sort();
    const zonasDesdeGeo  = (zonasGeo.features || []).map(f => f.properties.name).filter(Boolean);
    const listZonas = zonasDesdeJSON.length > 0
      ? zonasDesdeJSON
      : zonasDesdeGeo.sort();

    buildList(document.getElementById("csList"),      listCS,      true);
    buildList(document.getElementById("demList"),     listDEM,     false);
    buildList(document.getElementById("hospList"),    listHosp,    false);
    buildList(document.getElementById("zonasList"),   listZonas,   false);
    buildList(document.getElementById("cardinalList"), ["Norte","Sur","Este","Oeste"], false);

    ctrlCS       = initDropdown({ wrap:"csWrap",       btn:"csBtn",       drop:"csDrop",       list:"csList",       all:"csAll",       none:"csNone",       apply:"csApply" });
    ctrlDEM      = initDropdown({ wrap:"demWrap",      btn:"demBtn",      drop:"demDrop",      list:"demList",      all:"demAll",      none:"demNone",      apply:"demApply" });
    ctrlHosp     = initDropdown({ wrap:"hospWrap",     btn:"hospBtn",     drop:"hospDrop",     list:"hospList",     all:"hospAll",     none:"hospNone",     apply:"hospApply" });
    ctrlZonas    = initDropdown({ wrap:"zonasWrap",    btn:"zonasBtn",    drop:"zonasDrop",    list:"zonasList",    all:"zonasAll",    none:"zonasNone",    apply:"zonasApply" });
    ctrlCardinal = initDropdown({ wrap:"cardinalWrap", btn:"cardinalBtn", drop:"cardinalDrop", list:"cardinalList", all:"cardinalAll", none:"cardinalNone", apply:"cardinalApply" });

    applyFilter();
    setStatus("✓ Datos cargados correctamente", true);
  } catch(e) {
    console.error(e);
    setStatus("❌ Error al cargar los datos");
  }
})();

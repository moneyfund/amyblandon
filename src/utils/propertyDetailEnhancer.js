const iconPaths = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M9 20v-6h6v6"/>',
  bed: '<path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"/><path d="M3 15h18"/><path d="M6 11V8.5A1.5 1.5 0 0 1 7.5 7h3A1.5 1.5 0 0 1 12 8.5V11"/><path d="M12 11V8.5A1.5 1.5 0 0 1 13.5 7h3A1.5 1.5 0 0 1 18 8.5V11"/><path d="M5 18v2M19 18v2"/>',
  bath: '<path d="M4 12h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z"/><path d="M7 12V6a2 2 0 0 1 4 0"/><path d="M4 20 3 22M20 20l1 2"/>',
  car: '<path d="M5 17h14l1-5-2-5H6l-2 5z"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/><path d="M6 11h12"/>',
  ruler: '<path d="m4 16 12-12 4 4L8 20H4z"/><path d="m13 7 4 4M10 10l2 2M7 13l2 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  waves: '<path d="M2 8c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><path d="M2 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><path d="M2 20c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>',
  tree: '<path d="M12 22v-6"/><path d="M8 18h8"/><path d="M12 2 6 10h3l-4 6h14l-4-6h3z"/>',
  utensils: '<path d="M7 3v7M4 3v4a3 3 0 0 0 6 0V3M7 10v11"/><path d="M16 3v18M16 3c3 2 4 5 4 8h-4"/>',
  sofa: '<path d="M5 12V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"/><path d="M4 12a2 2 0 0 0-2 2v4h20v-4a2 2 0 0 0-2-2"/><path d="M5 18v2M19 18v2"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12h18M10 12v2h4v-2"/>',
  laundry: '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="5"/><path d="M7 6h.01M10 6h.01"/>',
  box: '<path d="m4 7 8-4 8 4-8 4z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  shirt: '<path d="m8 4-4 3 2 4 2-1v11h8V10l2 1 2-4-4-3a4 4 0 0 1-8 0z"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.3 8-8 10-4.7-2-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
  wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
  snow: '<path d="M12 2v20M4.2 6.5l15.6 11M4.2 17.5l15.6-11"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
  zap: '<path d="M13 2 5 14h6l-1 8 9-13h-6z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>'
};

const normalize = (value) => String(value || '')
  .toLocaleLowerCase('es')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

function iconNameFor(label) {
  const text = normalize(label);
  if (/piscina|alberca|jacuzzi|agua/.test(text)) return 'waves';
  if (/jardin|patio|area verde|terraza verde/.test(text)) return 'tree';
  if (/cocina|comedor|desayunador/.test(text)) return 'utensils';
  if (/sala|living|estar familiar/.test(text)) return 'sofa';
  if (/oficina|estudio|despacho/.test(text)) return 'briefcase';
  if (/lavander|lavado/.test(text)) return 'laundry';
  if (/deposito|bodega|almacen/.test(text)) return 'box';
  if (/terraza|balcon|azotea|solarium/.test(text)) return 'sun';
  if (/closet|vestidor|walk-in/.test(text)) return 'shirt';
  if (/seguridad|vigilancia|garita|cerca electrica/.test(text)) return 'shield';
  if (/internet|wifi|senal/.test(text)) return 'wifi';
  if (/aire acondicionado|climatizacion/.test(text)) return 'snow';
  if (/electricidad|generador|planta electrica|energia/.test(text)) return 'zap';
  if (/habitacion|dormitorio|cuarto/.test(text)) return 'bed';
  if (/bano|sanitario/.test(text)) return 'bath';
  if (/parqueo|estacionamiento|garaje|garage/.test(text)) return 'car';
  if (/area|construccion|terreno|lote|tamano|medida|frente|fondo/.test(text)) return 'ruler';
  if (/ano|fecha/.test(text)) return 'calendar';
  if (/tipo de propiedad|estado|propiedad|residencial|casa|apartamento/.test(text)) return 'home';
  return 'check';
}

function buildIcon(label) {
  const icon = document.createElement('span');
  icon.className = 'pd-ref-feature-symbol';
  icon.setAttribute('aria-hidden', 'true');
  const name = iconNameFor(label);
  icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name]}</svg>`;
  return icon;
}

function enhancePropertyDetail() {
  const root = document.querySelector('.property-detail-reference');
  if (!root) return;

  root.querySelectorAll('.pd-ref-amenities__grid > span').forEach((item) => {
    if (item.dataset.contextIcon === 'true') return;
    item.dataset.contextIcon = 'true';
    item.querySelector(':scope > svg')?.remove();
    item.prepend(buildIcon(item.textContent));
  });

  root.querySelectorAll('.pd-ref-details dl > div').forEach((row) => {
    if (row.dataset.contextIcon === 'true') return;
    row.dataset.contextIcon = 'true';
    const term = row.querySelector('dt');
    if (!term) return;
    term.prepend(buildIcon(term.textContent));
  });
}

let scheduled = false;
function scheduleEnhancement() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    enhancePropertyDetail();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleEnhancement, { once: true });
} else {
  scheduleEnhancement();
}

const observer = new MutationObserver(scheduleEnhancement);
observer.observe(document.documentElement, { childList: true, subtree: true });

const NAV_ITEMS = [
  { hash: '#/', label: 'Inicio' },
  { hash: '#/sobre-mi', label: 'Sobre mí' },
  { hash: '#/propiedades', label: 'Bienes raíces' },
  { hash: '#/seguros', label: 'Seguros' },
  { hash: '#/contacto', label: 'Contacto' },
];

const getHash = (anchor) => {
  try {
    return new URL(anchor.href, window.location.href).hash;
  } catch {
    return anchor.getAttribute('href') || '';
  }
};

const hashMatches = (anchor, expected) => {
  const hash = getHash(anchor);
  if (expected === '#/') return hash === '#/' || hash === '#';
  return hash === expected || hash.startsWith(`${expected}/`);
};

const applyNavbarOrder = () => {
  const nav = document.querySelector('.public-navbar__menu');
  if (!nav) return;

  const phone = nav.querySelector('.public-navbar__phone');
  const links = [...nav.querySelectorAll(':scope > a:not(.public-navbar__phone)')];
  const ordered = NAV_ITEMS.map((item) => {
    const link = links.find((candidate) => hashMatches(candidate, item.hash));
    if (link && link.textContent?.trim() !== item.label) link.textContent = item.label;
    return link;
  }).filter(Boolean);

  if (ordered.length !== NAV_ITEMS.length) return;

  const currentOrder = links.map(getHash).join('|');
  const desiredOrder = ordered.map(getHash).join('|');
  if (currentOrder === desiredOrder) return;

  const fragment = document.createDocumentFragment();
  ordered.forEach((link) => fragment.appendChild(link));
  nav.insertBefore(fragment, phone || null);
};

const hideFieldByLabel = (sectionSelector, labelText) => {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  section.querySelectorAll('.property-workspace__field').forEach((field) => {
    const label = field.querySelector(':scope > span');
    if (label?.textContent?.replace('*', '').trim() === labelText) {
      field.hidden = true;
      field.style.setProperty('display', 'none', 'important');
      field.setAttribute('data-amy-hidden', 'true');
    }
  });
};

const simplifyPropertyWorkspace = () => {
  const marketingSection = document.querySelector('#property-marketing');
  if (marketingSection) {
    marketingSection.hidden = true;
    marketingSection.style.setProperty('display', 'none', 'important');
  }

  const marketingNav = document.querySelector('.property-workspace__navigation a[href="#property-marketing"]');
  if (marketingNav) {
    marketingNav.hidden = true;
    marketingNav.style.setProperty('display', 'none', 'important');
  }

  hideFieldByLabel('#property-commercial', 'Orden de aparición');
  hideFieldByLabel('#property-location', 'Referencia interna');
};

let scheduled = false;
const applyPendingChanges = () => {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    applyNavbarOrder();
    simplifyPropertyWorkspace();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyPendingChanges, { once: true });
} else {
  applyPendingChanges();
}

window.addEventListener('hashchange', applyPendingChanges);
new MutationObserver(applyPendingChanges).observe(document.documentElement, {
  childList: true,
  subtree: true,
});

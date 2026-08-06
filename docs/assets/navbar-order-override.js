const desiredNavigation = [
  { hash: '#/', label: 'Inicio' },
  { hash: '#/sobre-mi', label: 'Sobre mí' },
  { hash: '#/propiedades', label: 'Bienes raíces' },
  { hash: '#/seguros', label: 'Seguros' },
  { hash: '#/contacto', label: 'Contacto' },
];

const navigationHash = (anchor) => {
  try {
    return new URL(anchor.href, window.location.href).hash;
  } catch {
    return anchor.getAttribute('href') || '';
  }
};

const matchesHash = (anchor, expectedHash) => {
  const hash = navigationHash(anchor);
  if (expectedHash === '#/') return hash === '#/' || hash === '#';
  return hash === expectedHash || hash.startsWith(`${expectedHash}/`);
};

const applyNavigation = () => {
  const nav = document.querySelector('.public-navbar__menu');
  if (!nav) return;

  const phone = nav.querySelector('.public-navbar__phone');
  const links = [...nav.querySelectorAll(':scope > a:not(.public-navbar__phone)')];
  const orderedLinks = desiredNavigation
    .map((item) => {
      const link = links.find((anchor) => matchesHash(anchor, item.hash));
      if (link && link.textContent?.trim() !== item.label) link.textContent = item.label;
      return link;
    })
    .filter(Boolean);

  if (orderedLinks.length !== desiredNavigation.length) return;

  const currentOrder = links.map(navigationHash).join('|');
  const desiredOrder = orderedLinks.map(navigationHash).join('|');
  if (currentOrder === desiredOrder) return;

  const fragment = document.createDocumentFragment();
  orderedLinks.forEach((link) => fragment.appendChild(link));
  nav.insertBefore(fragment, phone || null);
};

let scheduled = false;
const scheduleNavigation = () => {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    applyNavigation();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleNavigation, { once: true });
} else {
  scheduleNavigation();
}

new MutationObserver(scheduleNavigation).observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true,
});

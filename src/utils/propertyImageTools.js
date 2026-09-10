import { canonicalPropertyImageUrl, enhanceStoredPropertyImage } from './imageAutoEnhanceEngine';

let enhancing = false;

function cacheBustedUrl(value) {
  try {
    const url = new URL(canonicalPropertyImageUrl(value));
    url.searchParams.set('amyv', String(Date.now()));
    return url.toString();
  } catch {
    return value;
  }
}

function addEnhancedBadge(article) {
  if (!article || article.querySelector('.property-workspace__enhanced-badge')) return;
  const preview = article.querySelector('.property-workspace__image-preview');
  if (!preview) return;
  const badge = document.createElement('span');
  badge.className = 'property-workspace__enhanced-badge';
  badge.innerHTML = '<span aria-hidden="true">✦</span> Mejorada';
  preview.appendChild(badge);
}

function getImageItems(section) {
  return [...section.querySelectorAll('.property-workspace__image-grid article')]
    .map((article) => ({ article, image: article.querySelector('.property-workspace__image-preview img') }))
    .filter(({ image }) => image?.src);
}

async function runEnhancement(section, button, status) {
  if (enhancing) return;
  const items = getImageItems(section);
  if (!items.length) {
    status.textContent = 'Primero agrega al menos una fotografía.';
    return;
  }

  enhancing = true;
  button.disabled = true;
  button.classList.add('is-processing');
  status.classList.remove('is-error');
  let improved = 0;
  let alreadyImproved = 0;

  try {
    for (let index = 0; index < items.length; index += 1) {
      const { article, image } = items[index];
      status.textContent = `Mejorando fotografía ${index + 1} de ${items.length}…`;
      const result = await enhanceStoredPropertyImage(image.src);
      if (result.skipped) {
        alreadyImproved += 1;
      } else {
        improved += 1;
        image.src = cacheBustedUrl(image.src);
      }
      addEnhancedBadge(article);
    }

    if (improved) {
      status.textContent = `${improved} fotografía${improved === 1 ? '' : 's'} mejorada${improved === 1 ? '' : 's'} con un ajuste natural.`;
    } else if (alreadyImproved === items.length) {
      status.textContent = 'Todas las fotografías ya tienen aplicada la mejora automática.';
    } else {
      status.textContent = 'La mejora automática terminó correctamente.';
    }
  } catch (error) {
    console.error('[Amy] Mejora automática:', error);
    status.textContent = error?.message || 'No se pudo completar la mejora automática.';
    status.classList.add('is-error');
  } finally {
    enhancing = false;
    button.classList.remove('is-processing');
    button.disabled = false;
  }
}

function createEnhancementControl(section) {
  const wrapper = document.createElement('div');
  wrapper.className = 'property-workspace__auto-enhance';
  wrapper.innerHTML = `
    <div class="property-workspace__auto-enhance-copy">
      <span class="property-workspace__auto-enhance-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.25 3.45a2 2 0 0 1-1.2 1.2L6.1 8.9l3.45 1.25a2 2 0 0 1 1.2 1.2L12 14.8l1.25-3.45a2 2 0 0 1 1.2-1.2L17.9 8.9l-3.45-1.25a2 2 0 0 1-1.2-1.2L12 3Z"/>
          <path d="m18.5 14.5-.7 1.9a1.2 1.2 0 0 1-.7.7l-1.9.7 1.9.7a1.2 1.2 0 0 1 .7.7l.7 1.9.7-1.9a1.2 1.2 0 0 1 .7-.7l1.9-.7-1.9-.7a1.2 1.2 0 0 1-.7-.7l-.7-1.9Z"/>
        </svg>
      </span>
      <div>
        <strong>Mejora automática</strong>
        <span>Optimiza brillo, contraste y saturación de forma suave según cada fotografía.</span>
      </div>
    </div>
    <button type="button" class="property-workspace__auto-enhance-button">
      <span aria-hidden="true">✦</span> Mejora automática
    </button>
    <p class="property-workspace__auto-enhance-status" aria-live="polite"></p>
  `;
  const button = wrapper.querySelector('.property-workspace__auto-enhance-button');
  const status = wrapper.querySelector('.property-workspace__auto-enhance-status');
  button.addEventListener('click', () => runEnhancement(section, button, status));
  return wrapper;
}

function ensureEnhancementControl() {
  const section = document.querySelector('#property-media');
  if (!section || section.querySelector('.property-workspace__auto-enhance')) return;
  const dropzone = section.querySelector('.property-workspace__dropzone');
  if (!dropzone) return;
  dropzone.insertAdjacentElement('afterend', createEnhancementControl(section));
}

function installLightboxCloseFix() {
  document.addEventListener('pointerdown', (event) => {
    if (!(event.target instanceof Element)) return;
    const closeButton = event.target.closest('.property-lightbox__topbar button[aria-label="Cerrar galería"]');
    if (!closeButton) return;
    event.preventDefault();
    event.stopPropagation();
    closeButton.click();
  }, true);
}

let scheduled = false;
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    ensureEnhancementControl();
  });
}

installLightboxCloseFix();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
else schedule();

const observer = new MutationObserver(schedule);
observer.observe(document.documentElement, { childList: true, subtree: true });

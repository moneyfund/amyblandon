import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { siteImages, siteImageSlots } from '../config/siteImages';
import { subscribeSiteImages } from '../services/siteImagesService';

const CACHE_KEY = 'amy-site-images-v2';
const LEGACY_CACHE_KEYS = ['amy-site-images-v1'];
const BLOCKED_IMAGE_PARTS = ['photo-1560250097-0b93528c311a'];
const managedKeys = siteImageSlots.map(({ key }) => key);

let defaultFaviconHref = '';
let defaultFaviconType = '';
let defaultFaviconSizes = '';

function isAllowedImageUrl(value) {
  return typeof value === 'string'
    && Boolean(value.trim())
    && !BLOCKED_IMAGE_PARTS.some((blockedPart) => value.includes(blockedPart));
}

function syncDocumentFavicon(url) {
  if (typeof document === 'undefined') return;

  let favicon = document.querySelector('link[rel~="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }

  if (!defaultFaviconHref) {
    defaultFaviconHref = favicon.getAttribute('href') || '';
    defaultFaviconType = favicon.getAttribute('type') || '';
    defaultFaviconSizes = favicon.getAttribute('sizes') || '';
  }

  if (isAllowedImageUrl(url)) {
    favicon.setAttribute('href', url);
    favicon.removeAttribute('sizes');
    favicon.removeAttribute('type');
    favicon.dataset.managedFavicon = 'true';

    let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
      appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.dataset.managedFavicon = 'true';
      document.head.appendChild(appleTouchIcon);
    }
    appleTouchIcon.setAttribute('href', url);
    return;
  }

  if (defaultFaviconHref) favicon.setAttribute('href', defaultFaviconHref);
  if (defaultFaviconType) favicon.setAttribute('type', defaultFaviconType);
  else favicon.removeAttribute('type');
  if (defaultFaviconSizes) favicon.setAttribute('sizes', defaultFaviconSizes);
  else favicon.removeAttribute('sizes');
  delete favicon.dataset.managedFavicon;

  const managedAppleTouchIcon = document.querySelector('link[rel="apple-touch-icon"][data-managed-favicon="true"]');
  managedAppleTouchIcon?.remove();
}

function withLegacyAliases(images) {
  return {
    ...images,
    hero: images.heroPerson || '',
    aboutAmy: images.aboutHome || '',
  };
}

function emptyManagedImages() {
  return managedKeys.reduce((result, key) => {
    result[key] = '';
    return result;
  }, {});
}

function clearLegacyCaches() {
  if (typeof window === 'undefined') return;
  LEGACY_CACHE_KEYS.forEach((key) => window.localStorage.removeItem(key));
}

function initialImages() {
  const base = withLegacyAliases({
    ...siteImages,
    ...emptyManagedImages(),
  });

  if (typeof window === 'undefined') return base;

  try {
    clearLegacyCaches();
    const cached = JSON.parse(window.localStorage.getItem(CACHE_KEY) || '{}');
    const validCachedImages = Object.fromEntries(
      Object.entries(cached).filter(([, value]) => isAllowedImageUrl(value)),
    );
    return withLegacyAliases({ ...base, ...validCachedImages });
  } catch {
    return base;
  }
}

function cacheImages(images) {
  if (typeof window === 'undefined') return;
  try {
    const safeImages = Object.fromEntries(
      Object.entries(images).filter(([, value]) => !value || isAllowedImageUrl(value)),
    );
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(safeImages));
  } catch {
    // La web debe seguir funcionando aunque el navegador bloquee localStorage.
  }
}

function hasManagedImage(images) {
  return managedKeys.some((key) => isAllowedImageUrl(images[key]));
}

const SiteImagesContext = createContext({ images: initialImages(), loading: true });

export function SiteImagesProvider({ children }) {
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearLegacyCaches();

    const unsubscribe = subscribeSiteImages(
      (nextImages) => {
        const sanitizedImages = Object.fromEntries(
          Object.entries(nextImages).map(([key, value]) => [key, isAllowedImageUrl(value) ? value : '']),
        );
        const resolvedImages = withLegacyAliases({ ...siteImages, ...sanitizedImages });
        setImages(resolvedImages);
        cacheImages(resolvedImages);
        setLoading(false);
      },
      () => {
        setImages((current) => {
          if (hasManagedImage(current)) return current;
          const fallback = withLegacyAliases({ ...siteImages });
          cacheImages(fallback);
          return fallback;
        });
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    syncDocumentFavicon(images.favicon || '');
  }, [images.favicon]);

  const value = useMemo(() => ({ images, loading }), [images, loading]);
  return <SiteImagesContext.Provider value={value}>{children}</SiteImagesContext.Provider>;
}

export function useSiteImages() {
  return useContext(SiteImagesContext);
}

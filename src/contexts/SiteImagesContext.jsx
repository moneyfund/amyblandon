import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { siteImages, siteImageSlots } from '../config/siteImages';
import { subscribeSiteImages } from '../services/siteImagesService';

const CACHE_KEY = 'amy-site-images-v1';
const managedKeys = siteImageSlots.map(({ key }) => key);

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

function initialImages() {
  const base = withLegacyAliases({
    ...siteImages,
    ...emptyManagedImages(),
  });

  if (typeof window === 'undefined') return base;

  try {
    const cached = JSON.parse(window.localStorage.getItem(CACHE_KEY) || '{}');
    const validCachedImages = Object.fromEntries(
      Object.entries(cached).filter(([, value]) => typeof value === 'string' && value.trim()),
    );
    return withLegacyAliases({ ...base, ...validCachedImages });
  } catch {
    return base;
  }
}

function cacheImages(images) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(images));
  } catch {
    // La web debe seguir funcionando aunque el navegador bloquee localStorage.
  }
}

function hasManagedImage(images) {
  return managedKeys.some((key) => Boolean(images[key]));
}

const SiteImagesContext = createContext({ images: initialImages(), loading: true });

export function SiteImagesProvider({ children }) {
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeSiteImages(
      (nextImages) => {
        const resolvedImages = withLegacyAliases({ ...siteImages, ...nextImages });
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

  const value = useMemo(() => ({ images, loading }), [images, loading]);
  return <SiteImagesContext.Provider value={value}>{children}</SiteImagesContext.Provider>;
}

export function useSiteImages() {
  return useContext(SiteImagesContext);
}

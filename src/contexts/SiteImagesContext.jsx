import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { siteImages } from '../config/siteImages';
import { subscribeSiteImages } from '../services/siteImagesService';

const SiteImagesContext = createContext({ images: siteImages, loading: true });

export function SiteImagesProvider({ children }) {
  const [images, setImages] = useState(siteImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeSiteImages(
      (nextImages) => {
        setImages((current) => ({ ...current, ...nextImages }));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ images, loading }), [images, loading]);
  return <SiteImagesContext.Provider value={value}>{children}</SiteImagesContext.Provider>;
}

export function useSiteImages() {
  return useContext(SiteImagesContext);
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultSiteTheme } from '../config/siteTheme';
import { subscribeSiteTheme } from '../services/siteThemeService';

const SiteThemeContext = createContext({ theme: defaultSiteTheme, loading: true });

export function SiteThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultSiteTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeSiteTheme(
      (nextTheme) => {
        setTheme(nextTheme);
        setLoading(false);
      },
      () => {
        setTheme(defaultSiteTheme);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ theme, loading }), [theme, loading]);
  return <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>;
}

export function useSiteTheme() {
  return useContext(SiteThemeContext);
}

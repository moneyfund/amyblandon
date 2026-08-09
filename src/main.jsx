import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { SiteImagesProvider } from './contexts/SiteImagesContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';
import './styles/reference-typography.css';
import './styles/reference-cards-footer.css';
import './styles/site-images.css';
import './styles/reference-hero-layout.css';
import './styles/reference-hero-proximity.css';
import './styles/reference-mobile-hero.css';
import './styles/insurance.css';
import './styles/insurance-mobile-overrides.css';
import './styles/insurance-coverage-links.css';
import './styles/insurance-detail.css';
import './styles/contact-footer-overrides.css';
import './styles/sector-socials.css';
import './styles/property-workspace.css';
import './styles/property-workspace-simplified.css';
import './styles/real-estate-hero-premium.css';
import './styles/about-map-coverage-overrides.css';
import './styles/navbar-phone-final.css';
import './styles/home-about-signature.css';
import './styles/about-light-hero.css';
import './styles/real-estate-light-hero.css';

const Router = window.location.hostname.endsWith('github.io') ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ErrorBoundary>
        <LanguageProvider>
          <AuthProvider>
            <SiteImagesProvider>
              <AppRoutes />
            </SiteImagesProvider>
          </AuthProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </Router>
  </StrictMode>,
);

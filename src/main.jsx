import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { SiteImagesProvider } from './contexts/SiteImagesContext';
import { SiteThemeProvider } from './contexts/SiteThemeContext';
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
import './styles/insurance-light-hero.css';
import './styles/insurance-coverage-links.css';
import './styles/insurance-coverage-cards-premium.css';
import './styles/insurance-detail.css';
import './styles/contact-footer-overrides.css';
import './styles/sector-socials.css';
import './styles/property-workspace.css';
import './styles/property-workspace-simplified.css';
import './styles/property-workspace-wizard.css';
import './styles/admin-sidebar-collapse.css';
import './styles/real-estate-hero-premium.css';
import './styles/navbar-phone-final.css';
import './styles/home-about-signature.css';
import './styles/real-estate-light-hero.css';
import './styles/real-estate-catalog-first.css';
import './styles/site-personalization.css';
import './styles/real-estate-search-v2.css';
import './styles/real-estate-search-v3.css';
import './styles/real-estate-search-v4.css';
import './styles/home-hero-seam-fix.css';
import './styles/amy-original-exact.css';
import './styles/inner-page-typography.css';
import './styles/home-featured-properties.css';
import './styles/property-detail-premium.css';
import './styles/property-detail-video.css';
import './styles/property-detail-breadcrumb-cleanup.css';
import './styles/property-gallery-lightbox.css';
import './styles/section-hero-backgrounds-v5.css';
import './styles/insurance-coverage-colors-final.css';
import './styles/property-technical-sheet-admin.css';
import './styles/footer-refinements.css';
import './styles/content-admin-v3.css';
import './styles/property-card-hierarchy.css';
import './styles/about-home-reference.css';
import './styles/about-hero-refinement.css';
import './styles/about-navbar-family-polish.css';
import './styles/about-mobile-carousel.css';

const Router = window.location.hostname.endsWith('github.io') ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ErrorBoundary>
        <LanguageProvider>
          <AuthProvider>
            <SiteImagesProvider>
              <SiteThemeProvider>
                <AppRoutes />
              </SiteThemeProvider>
            </SiteImagesProvider>
          </AuthProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </Router>
  </StrictMode>,
);

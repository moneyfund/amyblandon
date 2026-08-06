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
import './styles/property-workspace.css';

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

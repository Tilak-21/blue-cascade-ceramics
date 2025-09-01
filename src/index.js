import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './styles/index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import SkipLinks from './components/SkipLinks';
import { HomeSEO } from './components/SEOHead';
import reportWebVitals from './reportWebVitals';

// Initialize production services
import './services/monitoring';
import { initSecurity } from './utils/security';
import { initPerformanceMonitoring } from './utils/performanceOptimizations';
import './utils/serviceWorker';

// Initialize security and performance monitoring
if (typeof window !== 'undefined') {
  initSecurity();
  initPerformanceMonitoring();
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <SkipLinks />
        <HomeSEO />
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
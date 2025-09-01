import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import config from '../config/environment';
import logger from './logger';

class MonitoringService {
  constructor() {
    this.initialized = false;
    this.performanceObserver = null;
    this.init();
  }

  init() {
    // Initialize Sentry
    if (config.FEATURES.ERROR_REPORTING && config.MONITORING.SENTRY_DSN) {
      Sentry.init({
        dsn: config.MONITORING.SENTRY_DSN,
        integrations: [
          new BrowserTracing(),
        ],
        environment: config.ENVIRONMENT,
        release: config.APP_VERSION,
        tracesSampleRate: config.isProduction() ? 0.1 : 1.0,
        replaysSessionSampleRate: config.isProduction() ? 0.1 : 1.0,
        replaysOnErrorSampleRate: 1.0,
        beforeSend(event, hint) {
          // Filter out development errors
          if (config.isDevelopment() && event.exception) {
            console.log('Sentry Event:', event);
          }
          return event;
        }
      });

      // Set user context
      Sentry.setUser({
        id: this.getUserId(),
        session: this.getSessionId(),
      });

      // Set application context
      Sentry.setContext('application', {
        name: config.APP_NAME,
        version: config.APP_VERSION,
        environment: config.ENVIRONMENT,
      });

      this.initialized = true;
      logger.info('Monitoring service initialized');
    }

    // Initialize performance monitoring
    if (config.FEATURES.PERFORMANCE_MONITORING) {
      this.initPerformanceMonitoring();
    }

    // Initialize Google Analytics
    if (config.FEATURES.ANALYTICS && config.MONITORING.GOOGLE_ANALYTICS_ID) {
      this.initGoogleAnalytics();
    }
  }

  initPerformanceMonitoring() {
    // Web Vitals monitoring
    if ('web-vitals' in window || window.webVitals) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(this.sendMetric.bind(this));
        getFID(this.sendMetric.bind(this));
        getFCP(this.sendMetric.bind(this));
        getLCP(this.sendMetric.bind(this));
        getTTFB(this.sendMetric.bind(this));
      });
    }

    // Performance Observer for custom metrics
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.handlePerformanceEntry(entry);
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'] 
      });
    }
  }

  initGoogleAnalytics() {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.MONITORING.GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', config.MONITORING.GOOGLE_ANALYTICS_ID, {
      send_page_view: true,
      custom_map: {
        custom_dimension_1: 'environment',
        custom_dimension_2: 'version',
      }
    });

    // Set custom dimensions
    gtag('config', config.MONITORING.GOOGLE_ANALYTICS_ID, {
      custom_dimension_1: config.ENVIRONMENT,
      custom_dimension_2: config.APP_VERSION,
    });

    logger.info('Google Analytics initialized');
  }

  sendMetric(metric) {
    const { name, value, delta, id } = metric;
    
    logger.performance(name, Math.round(value), {
      delta: Math.round(delta),
      id,
      type: 'web-vital'
    });

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(value),
        non_interaction: true,
      });
    }

    // Send to Sentry
    if (this.initialized) {
      Sentry.addBreadcrumb({
        message: `Web Vital: ${name}`,
        category: 'performance',
        data: {
          value: Math.round(value),
          delta: Math.round(delta),
          id,
        },
      });
    }
  }

  handlePerformanceEntry(entry) {
    const { name, entryType, startTime, duration } = entry;

    logger.performance(`${entryType}: ${name}`, Math.round(duration), {
      startTime: Math.round(startTime),
      entryType,
      type: 'performance-entry'
    });
  }

  // Track page views
  trackPageView(page, title = '') {
    logger.info('Page View', { page, title });

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: window.location.href,
        page_path: page || window.location.pathname,
      });
    }
  }

  // Track events
  trackEvent(action, category = 'General', label = '', value = null) {
    logger.userAction(action, { category, label, value });

    if (window.gtag) {
      const eventData = {
        event_category: category,
        event_label: label,
      };

      if (value !== null) {
        eventData.value = value;
      }

      window.gtag('event', action, eventData);
    }

    if (this.initialized) {
      Sentry.addBreadcrumb({
        message: `Event: ${action}`,
        category: 'ui',
        data: { category, label, value },
      });
    }
  }

  // Track errors
  trackError(error, context = {}) {
    logger.error(error.message || error, {
      stack: error.stack,
      ...context
    });

    if (this.initialized) {
      Sentry.withScope((scope) => {
        Object.keys(context).forEach(key => {
          scope.setTag(key, context[key]);
        });
        Sentry.captureException(error);
      });
    }
  }

  // Track custom metrics
  trackTiming(name, timeInMs, category = 'Performance') {
    logger.performance(name, timeInMs, { category });

    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: timeInMs,
        event_category: category,
      });
    }
  }

  // Set user context
  setUser(userId, properties = {}) {
    if (this.initialized) {
      Sentry.setUser({ id: userId, ...properties });
    }

    if (window.gtag) {
      window.gtag('set', { user_id: userId });
    }

    logger.info('User context set', { userId, ...properties });
  }

  // Utility methods
  getUserId() {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', Date.now().toString(36) + Math.random().toString(36).substr(2));
    }
    return localStorage.getItem('userId');
  }

  getSessionId() {
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', Date.now().toString(36) + Math.random().toString(36).substr(2));
    }
    return sessionStorage.getItem('sessionId');
  }
}

// Create singleton instance
const monitoring = new MonitoringService();

export default monitoring;
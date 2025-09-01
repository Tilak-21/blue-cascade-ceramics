import { useEffect, useCallback, useRef } from 'react';
import logger from '../services/logger';
import monitoring from '../services/monitoring';

// Custom hook for performance monitoring
export const usePerformance = (componentName) => {
  const startTime = useRef(null);
  const renderCount = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
    renderCount.current += 1;

    return () => {
      if (startTime.current) {
        const duration = performance.now() - startTime.current;
        logger.performance(`${componentName} Render`, duration, {
          renderCount: renderCount.current
        });
      }
    };
  });

  const measureFunction = useCallback((functionName, fn) => {
    return (...args) => {
      const start = performance.now();
      const result = fn(...args);
      const duration = performance.now() - start;
      
      logger.performance(`${componentName}.${functionName}`, duration);
      monitoring.trackTiming(`${componentName}.${functionName}`, duration);
      
      return result;
    };
  }, [componentName]);

  const measureAsyncFunction = useCallback((functionName, fn) => {
    return async (...args) => {
      const start = performance.now();
      try {
        const result = await fn(...args);
        const duration = performance.now() - start;
        
        logger.performance(`${componentName}.${functionName}`, duration);
        monitoring.trackTiming(`${componentName}.${functionName}`, duration);
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logger.error(`${componentName}.${functionName} failed`, { 
          error: error.message, 
          duration 
        });
        throw error;
      }
    };
  }, [componentName]);

  return {
    measureFunction,
    measureAsyncFunction,
    renderCount: renderCount.current
  };
};

// Hook for measuring resource loading times
export const useResourceTiming = (resourceName) => {
  const measureResourceLoad = useCallback((url, type = 'resource') => {
    const start = performance.now();
    
    return {
      finish: () => {
        const duration = performance.now() - start;
        logger.performance(`${resourceName} Load`, duration, { url, type });
        monitoring.trackTiming(`Resource Load: ${resourceName}`, duration);
      }
    };
  }, [resourceName]);

  return { measureResourceLoad };
};

// Hook for debounced performance measurements
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Hook for measuring user interactions
export const useInteractionTracking = (componentName) => {
  const trackInteraction = useCallback((action, context = {}) => {
    monitoring.trackEvent(action, 'User Interaction', componentName, 1);
    logger.userAction(`${componentName}: ${action}`, context);
  }, [componentName]);

  const trackClick = useCallback((elementName, context = {}) => {
    trackInteraction(`Click ${elementName}`, context);
  }, [trackInteraction]);

  const trackSearch = useCallback((query, resultsCount = 0) => {
    trackInteraction('Search', { query, resultsCount });
  }, [trackInteraction]);

  const trackFilter = useCallback((filterType, filterValue) => {
    trackInteraction('Filter', { filterType, filterValue });
  }, [trackInteraction]);

  return {
    trackInteraction,
    trackClick,
    trackSearch,
    trackFilter
  };
};
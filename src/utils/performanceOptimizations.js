import { memo, useMemo, useCallback } from 'react';
import logger from '../services/logger';

// Higher-order component for performance optimization
export const withPerformanceOptimization = (Component, displayName) => {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    // Custom comparison logic - only re-render if specific props change
    const keys = Object.keys(nextProps);
    
    for (let key of keys) {
      if (prevProps[key] !== nextProps[key]) {
        // Log what caused the re-render in development
        if (process.env.NODE_ENV === 'development') {
          logger.debug(`${displayName} re-rendering due to ${key} change`, {
            prev: prevProps[key],
            next: nextProps[key]
          });
        }
        return false; // Re-render
      }
    }
    
    return true; // Don't re-render
  });

  MemoizedComponent.displayName = displayName;
  return MemoizedComponent;
};

// Utility for creating stable callback references
export const useStableCallback = (callback, deps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, [callback, ...deps]);
};

// Utility for creating stable object references
export const useStableObject = (object, deps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => object, [object, ...deps]);
};

// Virtual scrolling utility for large lists
export const calculateVisibleItems = (
  scrollTop, 
  containerHeight, 
  itemHeight, 
  totalItems,
  overscan = 5
) => {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);
  
  return { start, end, visibleCount };
};

// Image optimization utilities
export const getOptimizedImageUrl = (originalUrl, width, height, quality = 80) => {
  if (!originalUrl) return null;
  
  // If using a CDN that supports image optimization
  const cdnUrl = process.env.REACT_APP_IMAGE_CDN_URL;
  if (cdnUrl) {
    return `${cdnUrl}/w_${width},h_${height},q_${quality}/${originalUrl}`;
  }
  
  // Fallback to original URL
  return originalUrl;
};

// Progressive image loading
export const createImageSrcSet = (baseUrl, sizes = [400, 800, 1200, 1600]) => {
  if (!baseUrl) return '';
  
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, size)} ${size}w`)
    .join(', ');
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalImages = [
    '/images/logo-192.png',
    '/images/hero-background.jpg',
    '/images/placeholder-tile.svg'
  ];
  
  const criticalFonts = [
    // Add your critical font URLs here
  ];

  // Preload images
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });

  // Preload fonts
  criticalFonts.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = src;
    document.head.appendChild(link);
  });

  logger.info('Critical resources preloaded', {
    images: criticalImages.length,
    fonts: criticalFonts.length
  });
};

// Bundle splitting helpers
export const loadComponentLazily = (importFunction) => {
  return import('react').then(({ lazy }) => lazy(importFunction));
};

// Performance budget checker
export const checkPerformanceBudget = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    const metrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime,
    };

    // Performance budgets (in milliseconds)
    const budgets = {
      loadTime: 3000,
      domContentLoaded: 1500,
      firstPaint: 1000,
      firstContentfulPaint: 1500,
    };

    const violations = [];
    Object.keys(budgets).forEach(metric => {
      if (metrics[metric] && metrics[metric] > budgets[metric]) {
        violations.push({
          metric,
          actual: metrics[metric],
          budget: budgets[metric]
        });
      }
    });

    if (violations.length > 0) {
      logger.warn('Performance budget violations', { violations, metrics });
    } else {
      logger.info('Performance budget met', metrics);
    }

    return { metrics, violations, passed: violations.length === 0 };
  }

  return null;
};

// Memory usage monitoring
export const checkMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = performance.memory;
    const usage = {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
    };

    if (usage.percentage > 80) {
      logger.warn('High memory usage detected', usage);
    } else {
      logger.debug('Memory usage', usage);
    }

    return usage;
  }

  return null;
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Check performance budget after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      checkPerformanceBudget();
      checkMemoryUsage();
    }, 100);
  });

  // Monitor memory usage periodically in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      checkMemoryUsage();
    }, 30000); // Every 30 seconds
  }

  // Preload critical resources
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalResources);
  } else {
    preloadCriticalResources();
  }
};
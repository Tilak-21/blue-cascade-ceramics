import { useEffect, useCallback, useRef, useState } from 'react';
import logger from '../services/logger';

// Hook for keyboard navigation
export const useKeyboardNavigation = (onEnter, onEscape, dependencies = []) => {
  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          onEnter(event);
          logger.userAction('Keyboard Navigation: Enter', { context: 'accessibility' });
        }
        break;
      case 'Escape':
        if (onEscape) {
          onEscape(event);
          logger.userAction('Keyboard Navigation: Escape', { context: 'accessibility' });
        }
        break;
      default:
        break;
    }
  }, dependencies);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return handleKeyDown;
};

// Hook for focus management
export const useFocusManagement = (autoFocus = false) => {
  const elementRef = useRef(null);

  const focusElement = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.focus();
      logger.userAction('Focus Management: Element Focused', { context: 'accessibility' });
    }
  }, []);

  const blurElement = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.blur();
    }
  }, []);

  useEffect(() => {
    if (autoFocus && elementRef.current) {
      focusElement();
    }
  }, [autoFocus, focusElement]);

  return {
    elementRef,
    focusElement,
    blurElement
  };
};

// Hook for ARIA announcements
export const useAriaAnnouncements = () => {
  const announcementRef = useRef(null);

  const announce = useCallback((message, priority = 'polite') => {
    if (!announcementRef.current) {
      // Create announcement element if it doesn't exist
      announcementRef.current = document.createElement('div');
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.setAttribute('aria-atomic', 'true');
      announcementRef.current.setAttribute('class', 'sr-only');
      announcementRef.current.style.cssText = `
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      `;
      document.body.appendChild(announcementRef.current);
    }

    // Clear previous message and set new one
    announcementRef.current.textContent = '';
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message;
      }
    }, 100);

    logger.userAction('ARIA Announcement', { message, priority, context: 'accessibility' });
  }, []);

  useEffect(() => {
    return () => {
      if (announcementRef.current && document.body.contains(announcementRef.current)) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  return { announce };
};

// Hook for screen reader detection
export const useScreenReader = () => {
  const [isScreenReader, setIsScreenReader] = useState(false);

  useEffect(() => {
    // Check for common screen reader indicators
    const checkScreenReader = () => {
      // Check for high contrast mode (common with screen readers)
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        setIsScreenReader(true);
        return;
      }

      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsScreenReader(true);
        return;
      }

      // Check user agent for screen reader indicators
      const userAgent = navigator.userAgent.toLowerCase();
      const screenReaderIndicators = ['nvda', 'jaws', 'voiceover', 'talkback'];
      
      if (screenReaderIndicators.some(indicator => userAgent.includes(indicator))) {
        setIsScreenReader(true);
        return;
      }

      // Check for keyboard-only navigation
      let keyboardNavigation = false;
      const handleKeyDown = () => {
        keyboardNavigation = true;
        document.removeEventListener('keydown', handleKeyDown);
      };
      const handleMouseMove = () => {
        if (!keyboardNavigation) {
          setIsScreenReader(false);
        }
        document.removeEventListener('mousemove', handleMouseMove);
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousemove', handleMouseMove);

      // Clean up after 5 seconds
      setTimeout(() => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousemove', handleMouseMove);
        if (keyboardNavigation) {
          setIsScreenReader(true);
        }
      }, 5000);
    };

    checkScreenReader();
  }, []);

  return isScreenReader;
};

// Hook for skip links
export const useSkipLinks = () => {
  const skipToContent = useCallback(() => {
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
      logger.userAction('Skip Link: Main Content', { context: 'accessibility' });
    }
  }, []);

  const skipToNavigation = useCallback(() => {
    const navigation = document.getElementById('main-navigation') || document.querySelector('nav');
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView({ behavior: 'smooth' });
      logger.userAction('Skip Link: Navigation', { context: 'accessibility' });
    }
  }, []);

  return {
    skipToContent,
    skipToNavigation
  };
};
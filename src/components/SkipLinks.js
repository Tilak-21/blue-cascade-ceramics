import React from 'react';
import { useSkipLinks } from '../hooks/useAccessibility';

const SkipLinks = () => {
  const { skipToContent, skipToNavigation } = useSkipLinks();

  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-stone-900 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:font-medium focus:no-underline focus:outline-none focus:ring-2 focus:ring-white"
        onClick={(e) => {
          e.preventDefault();
          skipToContent();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            skipToContent();
          }
        }}
      >
        Skip to main content
      </a>
      
      <a
        href="#main-navigation"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 focus:z-50 focus:bg-stone-900 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:font-medium focus:no-underline focus:outline-none focus:ring-2 focus:ring-white"
        onClick={(e) => {
          e.preventDefault();
          skipToNavigation();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            skipToNavigation();
          }
        }}
      >
        Skip to navigation
      </a>
    </div>
  );
};

export default SkipLinks;
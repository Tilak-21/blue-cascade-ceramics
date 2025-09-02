import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useKeyboardNavigation, useAriaAnnouncements } from '../hooks/useAccessibility';
import logger from '../services/logger';

const ImageModal = ({ 
  isOpen, 
  onClose, 
  imageSrc, 
  imageAlt, 
  tileData,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}) => {
  const { announce } = useAriaAnnouncements();

  // Keyboard navigation
  useKeyboardNavigation(
    null, // Enter handled by individual buttons
    onClose, // Escape to close
    [onClose]
  );

  // Additional keyboard controls for modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) {
            event.preventDefault();
            onPrevious();
            logger.userAction('Image Modal: Previous via keyboard');
          }
          break;
        case 'ArrowRight':
          if (hasNext && onNext) {
            event.preventDefault();
            onNext();
            logger.userAction('Image Modal: Next via keyboard');
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, onPrevious, onNext]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      announce(`Viewing enlarged image of ${imageAlt || 'tile'}`);
      logger.userAction('Image Modal: Opened', { imageAlt, tileSeries: tileData?.series });
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, imageAlt, announce, tileData]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    announce('Closed image view');
    logger.userAction('Image Modal: Closed');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-2 sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Modal Container */}
      <div className="relative w-full h-full max-w-7xl max-h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 text-white flex-shrink-0">
          <div className="flex-1 min-w-0 pr-2 sm:pr-4">
            <h2 id="modal-title" className="text-lg sm:text-xl font-semibold truncate">
              {tileData?.series} {tileData?.material}
            </h2>
            <p id="modal-description" className="text-stone-300 text-xs sm:text-sm truncate">
              {tileData?.size} • {tileData?.surface} finish • PEI {tileData?.peiRating}
            </p>
          </div>
          
          {/* Controls - Stack on very small screens */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Navigation Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  disabled={!hasPrevious}
                  className="p-1.5 sm:p-2 rounded-lg bg-black bg-opacity-50 text-white hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                  aria-label="Previous image"
                  title="Previous image (← arrow key)"
                >
                  ←
                </button>
              )}
              
              {onNext && (
                <button
                  onClick={onNext}
                  disabled={!hasNext}
                  className="p-1.5 sm:p-2 rounded-lg bg-black bg-opacity-50 text-white hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                  aria-label="Next image"
                  title="Next image (→ arrow key)"
                >
                  →
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-lg bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close image view"
              title="Close (Escape key)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Image Container - Responsive Layout */}
        <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-0 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-center max-w-full max-h-full gap-3 sm:gap-4 lg:gap-6 w-full">
            {/* Image */}
            <div className="relative flex-shrink-0 max-w-full">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="max-w-full object-contain rounded-lg shadow-2xl"
                  style={{ 
                    maxHeight: 'calc(100vh - 200px)', 
                    maxWidth: 'min(90vw, 800px)' // Better max width for lightbox
                  }}
                  onError={(e) => {
                    // Hide broken images gracefully
                    e.target.style.display = 'none';
                    // Show placeholder instead
                    const placeholder = e.target.nextElementSibling;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* Placeholder for missing/broken images */}
              <div 
                className="flex items-center justify-center bg-gradient-to-br from-pacific-100 to-pacific-200 rounded-lg shadow-2xl"
                style={{ 
                  maxHeight: 'calc(100vh - 200px)', 
                  maxWidth: 'min(90vw, 800px)',
                  minHeight: '400px',
                  minWidth: '300px',
                  display: imageSrc ? 'none' : 'flex'
                }}
              >
                <div className="text-center text-pacific-600">
                  <div className="w-16 h-16 mx-auto mb-4 bg-pacific-300 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Preview Coming Soon</h3>
                  <p className="text-sm">High-quality image preview will be available shortly</p>
                </div>
              </div>
            </div>
            
            {/* Image Info Panel - Responsive */}
            <div className="bg-black bg-opacity-90 text-white p-3 sm:p-4 rounded-lg w-full lg:max-w-sm lg:min-w-[280px] xl:min-w-[320px] flex-shrink-0 max-h-96 lg:max-h-full overflow-y-auto">
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="text-stone-300 text-xs sm:text-sm block">Material:</span>
                  <div className="font-medium text-sm sm:text-base">{tileData?.type === 'GP' ? 'Porcelain' : 'Ceramic'}</div>
                </div>
                <div>
                  <span className="text-stone-300 text-xs sm:text-sm block">Size:</span>
                  <div className="font-medium text-sm sm:text-base">{tileData?.size?.replace('X', ' × ')} cm</div>
                </div>
                <div>
                  <span className="text-stone-300 text-xs sm:text-sm block">Surface:</span>
                  <div className="font-medium text-sm sm:text-base">{tileData?.surface}</div>
                </div>
                <div>
                  <span className="text-stone-300 text-xs sm:text-sm block">Stock:</span>
                  <div className="font-medium text-sm sm:text-base text-emerald-400">{tileData?.qty?.toLocaleString()} m²</div>
                </div>
                
                {tileData?.application && (
                  <div>
                    <span className="text-stone-300 text-xs sm:text-sm block mb-1 sm:mb-2">Applications:</span>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {tileData.application.map((app, index) => (
                        <span key={index} className="px-2 py-1 bg-stone-700 text-xs sm:text-sm rounded-full whitespace-nowrap">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Responsive breakpoint adjustments */}
        <style>{`
          @media (max-width: 640px) {
            .max-h-96 { max-height: 200px; }
          }
          @media (min-width: 1024px) {
            img {
              max-width: min(65vw, 900px) !important;
            }
          }
          @media (min-width: 1280px) {
            img {
              max-width: min(70vw, 1000px) !important;
            }
          }
        `}</style>

        {/* Footer Instructions - Hide on very small screens */}
        <div className="hidden sm:block p-3 sm:p-4 text-center text-stone-400 text-xs sm:text-sm flex-shrink-0">
          <p>Use arrow keys to navigate • ESC to close • Click outside to close</p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import logger from '../services/logger';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderClassName = 'bg-stone-200 animate-pulse',
  fallbackSrc = '/images/placeholder-tile.svg',
  onLoad,
  onError,
  ...props
}) => {
  const [imageState, setImageState] = useState('loading'); // loading, loaded, error
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef(null);

  // Intersection Observer for lazy loading
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px 0px', // Load images 50px before they come into view
  });

  useEffect(() => {
    if (inView && src && imageState === 'loading') {
      loadImage(src);
    }
  }, [inView, src, imageState]);

  const loadImage = (imageSrc) => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(imageSrc);
      setImageState('loaded');
      
      // Log successful image load for performance monitoring
      logger.performance('Image Load Success', performance.now(), {
        src: imageSrc,
        alt: alt
      });
      
      if (onLoad) {
        onLoad();
      }
    };
    
    img.onerror = () => {
      logger.warn('Image Load Failed', { 
        src: imageSrc, 
        alt: alt,
        fallback: fallbackSrc 
      });
      
      // Try fallback image if original fails
      if (imageSrc !== fallbackSrc && fallbackSrc) {
        loadImage(fallbackSrc);
      } else {
        setImageState('error');
      }
      
      if (onError) {
        onError();
      }
    };
    
    img.src = imageSrc;
  };

  // Combine refs
  const setRefs = (element) => {
    ref(element);
    imageRef.current = element;
  };

  if (imageState === 'loading') {
    return (
      <div 
        ref={setRefs}
        className={`${placeholderClassName} ${className}`}
        {...props}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (imageState === 'error') {
    return (
      <div 
        ref={setRefs}
        className={`${placeholderClassName} ${className} flex items-center justify-center`}
        {...props}
      >
        <div className="text-center text-stone-500">
          <div className="w-8 h-8 mx-auto mb-2">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-xs">Image unavailable</div>
        </div>
      </div>
    );
  }

  return (
    <img
      ref={setRefs}
      src={imageSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${imageState === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
      loading="lazy"
      {...props}
    />
  );
};

export default LazyImage;
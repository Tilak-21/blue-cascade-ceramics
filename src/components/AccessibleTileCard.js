import React from 'react';
import { useAriaAnnouncements, useFocusManagement } from '../hooks/useAccessibility';
import { formatTileSize, getCategoryColor, getPEIColor, getMaterialTypeName, getTileImage } from '../utils/helpers';
import LazyImage from './LazyImage';

const AccessibleTileCard = ({ tile, index }) => {
  const { announce } = useAriaAnnouncements();
  const { elementRef } = useFocusManagement();

  const handleCardFocus = () => {
    const announcement = `Tile ${index + 1}: ${tile.series} ${tile.material}, 
      ${getMaterialTypeName(tile.type)} tile, 
      ${formatTileSize(tile.size)}, 
      ${tile.surface} finish, 
      PEI rating ${tile.peiRating}, 
      ${tile.qty} square meters available`;
    announce(announcement);
  };

  const handleCardClick = () => {
    announce(`Viewing details for ${tile.series} ${tile.material}`);
  };

  const imageSrc = getTileImage(tile.series, tile.material, tile.qty);
  const categoryColor = getCategoryColor(tile.category);
  const peiColor = getPEIColor(tile.peiRating);

  return (
    <article
      ref={elementRef}
      className="tile-card bg-white rounded-xl shadow-tile hover:shadow-tile-hover border border-stone-200 p-6 h-full flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
      tabIndex={0}
      role="button"
      aria-labelledby={`tile-title-${index}`}
      aria-describedby={`tile-description-${index}`}
      onFocus={handleCardFocus}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Image Section */}
      <div className="relative mb-4 bg-stone-100 rounded-lg overflow-hidden aspect-square">
        {imageSrc ? (
          <LazyImage
            src={imageSrc}
            alt={`${tile.series} ${tile.material} tile sample showing ${tile.surface} finish in ${formatTileSize(tile.size)} format`}
            className="w-full h-full object-cover"
            placeholderClassName="w-full h-full bg-stone-200 animate-pulse flex items-center justify-center"
          />
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center"
            role="img"
            aria-label={`Placeholder for ${tile.series} ${tile.material} tile`}
          >
            <div className="text-stone-400">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Material Type Badge */}
        <div className="absolute top-3 left-3">
          <span 
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(tile.type)}`}
            aria-label={`Material type: ${getMaterialTypeName(tile.type)}`}
          >
            {getMaterialTypeName(tile.type)}
          </span>
        </div>

        {/* Availability Status */}
        <div className="absolute top-3 right-3">
          <div 
            className="w-3 h-3 bg-emerald-500 rounded-full"
            role="img"
            aria-label="In stock and ready to ship"
          ></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col">
        <div className="mb-3">
          <h3 
            id={`tile-title-${index}`}
            className="text-lg font-semibold text-stone-900 mb-1 line-clamp-1"
          >
            {tile.series}
          </h3>
          <p className="text-stone-600 text-sm line-clamp-1">
            {tile.material}
          </p>
        </div>

        {/* Specifications */}
        <div 
          id={`tile-description-${index}`}
          className="space-y-2 mb-4 text-sm"
        >
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Size:</span>
            <span className="font-medium text-stone-900">{formatTileSize(tile.size)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Surface:</span>
            <span className="font-medium text-stone-900">{tile.surface}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-stone-500">PEI Rating:</span>
            <span 
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${peiColor}`}
              aria-label={`Durability rating: ${tile.peiRating}`}
            >
              {tile.peiRating}
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <span 
            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${categoryColor}`}
            aria-label={`Product category: ${tile.category}`}
          >
            {tile.category}
          </span>
        </div>

        {/* Applications */}
        <div className="mb-4">
          <p className="text-xs text-stone-500 mb-2">Recommended Applications:</p>
          <div className="flex flex-wrap gap-1">
            {tile.application.map((app, appIndex) => (
              <span 
                key={appIndex} 
                className="inline-flex px-2 py-1 text-xs bg-stone-100 text-stone-700 rounded"
                aria-label={`Suitable for ${app.toLowerCase()} applications`}
              >
                {app}
              </span>
            ))}
          </div>
        </div>

        {/* Inventory */}
        <div className="mt-auto pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-stone-500">Available:</span>
              <span 
                className="ml-2 font-semibold text-emerald-600"
                aria-label={`${tile.qty} square meters in stock`}
              >
                {tile.qty.toLocaleString()} m²
              </span>
            </div>
            <div 
              className="text-xs text-stone-400"
              aria-label="Ready for immediate shipping"
            >
              Ready to Ship
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default AccessibleTileCard;
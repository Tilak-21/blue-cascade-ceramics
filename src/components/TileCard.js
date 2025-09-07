import React, { useState } from 'react';
import { Grid, Ruler, Palette, Package, Sparkles, ZoomIn } from 'lucide-react';
import { 
  formatTileSize, 
  getCategoryColor, 
  getPEIColor, 
  getMaterialTypeColor, 
  getMaterialTypeName,
  formatNumber 
} from '../utils/helpers';

const TileCard = ({ tile, onImageClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="tile-card bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-tile-hover transition-all duration-300 overflow-hidden border border-pacific-200 hover:border-cascade-300 flex flex-col h-full">
      {/* Image Container with Click to Expand */}
      <div 
        className="relative bg-gradient-to-br from-pacific-50 via-pacific-100 to-pacific-200 overflow-hidden cursor-pointer group" 
        style={{ aspectRatio: '4/5' }}
        onClick={() => onImageClick && onImageClick(tile)}
        role="button"
        tabIndex={0}
        aria-label={`View larger image of ${tile.series}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onImageClick && onImageClick(tile);
          }
        }}
      >
        {tile.image && !imageError ? (
          <>
            <img
              src={tile.image}
              alt={`${tile.series} ${tile.material} tile sample`}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              style={{ 
                objectPosition: 'center',
                filter: 'contrast(1.02) saturate(1.05)' 
              }}
              onError={handleImageError}
            />
            {/* Zoom overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-95 rounded-full p-3 shadow-tile">
                <ZoomIn className="w-6 h-6 text-cascade-700" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pacific-200 to-pacific-300 rounded-lg shadow-sm flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-pacific-300 to-pacific-400 rounded flex items-center justify-center">
                <Grid className="w-6 h-6 text-pacific-600" />
              </div>
            </div>
          </div>
        )}
        
        {/* Badges - Stack vertically to avoid overlap on narrow cards */}
        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(tile.category)} backdrop-blur-md bg-opacity-95 shadow-sm`}>
          {tile.category}
        </span>
        
        <span className={`absolute top-8 right-2 px-2 py-0.5 rounded text-xs font-medium ${getPEIColor(tile.peiRating)} backdrop-blur-md bg-opacity-95 shadow-sm`}>
          {tile.peiRating}
        </span>
      </div>
      
      {/* Card Content */}
      <div className="p-4 sm:p-5">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg sm:text-xl text-pacific-900 leading-tight flex-1 pr-3">{tile.series}</h3>
          <div className="text-right flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold text-cascade-700">${tile.proposedSP}</span>
            <div className="text-xs text-pacific-500">per m²</div>
          </div>
        </div>
        
        {/* Specifications Section */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-pacific-600">
            <Ruler className="w-4 h-4 mr-2 text-pacific-400 flex-shrink-0" />
            <span className="font-medium">{formatTileSize(tile.size)}</span>
            <span className="ml-2 text-pacific-400">• {tile.thickness}</span>
          </div>
          <div className="flex items-center text-sm text-pacific-600">
            <Palette className="w-4 h-4 mr-2 text-pacific-400 flex-shrink-0" />
            <span>{tile.finish}</span>
          </div>
          <div className="flex items-center text-sm text-pacific-600">
            <Package className="w-4 h-4 mr-2 text-pacific-400 flex-shrink-0" />
            <span className="font-medium">{formatNumber(tile.qty)} m²</span>
            <span className="ml-2 text-forest-600 text-xs">In Stock</span>
          </div>
        </div>

        {/* Applications Section */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tile.application.slice(0, 3).map((app, idx) => (
            <span key={idx} className="px-2 py-1 bg-pacific-100 text-pacific-700 rounded text-xs">
              {app}
            </span>
          ))}
        </div>
        
        {/* Footer Section - Material Type & Action Button */}
        <div className="flex items-center justify-between gap-3 pt-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMaterialTypeColor(tile.type)} flex-shrink-0`}>
            {getMaterialTypeName(tile.type)}
          </span>
          <button 
            className="bg-cascade-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-cascade-700 transition-colors flex items-center gap-1.5 shadow-tile hover:shadow-tile-hover flex-shrink-0"
            aria-label={`Request quote for ${tile.series}`}
          >
            <Sparkles className="w-4 h-4" />
            Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileCard;
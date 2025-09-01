import React, { useState } from 'react';
import { Ruler, Package, Award, Palette, Grid, ZoomIn } from 'lucide-react';
import { 
  formatTileSize, 
  getCategoryColor, 
  getMaterialTypeColor, 
  getMaterialTypeName,
  formatNumber 
} from '../utils/helpers';

const TileListItem = ({ tile, onImageClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Tile Image - Clickable */}
        <div className="flex-shrink-0">
          <div 
            className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 rounded-xl overflow-hidden cursor-pointer group relative"
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
                {/* Zoom overlay for list view */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2">
                    <ZoomIn className="w-4 h-4 text-stone-800" />
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                <Grid className="w-6 h-6 text-stone-600" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-xl text-stone-900">{tile.series}</h3>
            <div className="text-right">
              <span className="text-2xl font-bold text-stone-800">${tile.proposedSP}</span>
              <span className="text-sm text-stone-500 ml-1">per m²</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-stone-600 mb-3">
            <div className="flex items-center">
              <Ruler className="w-3 h-3 mr-1" />
              {formatTileSize(tile.size)}
            </div>
            <div className="flex items-center">
              <Package className="w-3 h-3 mr-1" />
              {formatNumber(tile.qty)} m²
            </div>
            <div className="flex items-center">
              <Award className="w-3 h-3 mr-1" />
              {tile.peiRating}
            </div>
            <div className="flex items-center">
              <Palette className="w-3 h-3 mr-1" />
              {tile.finish}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(tile.category)}`}>
                {tile.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${getMaterialTypeColor(tile.type)}`}>
                {getMaterialTypeName(tile.type)}
              </span>
              {tile.application.slice(0, 2).map((app, idx) => (
                <span key={idx} className="px-2 py-1 bg-stone-100 text-stone-700 rounded-full text-xs">
                  {app}
                </span>
              ))}
            </div>
            <button 
              className="bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-900 transition-colors"
              aria-label={`Request quote for ${tile.series}`}
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileListItem;
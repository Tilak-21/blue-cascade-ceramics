import React, { useState } from 'react';
import { Ruler, Package, Award, Palette, Grid } from 'lucide-react';
import { 
  formatTileSize, 
  getCategoryColor, 
  getMaterialTypeColor, 
  getMaterialTypeName,
  formatNumber 
} from '../utils/helpers';

const TileListItem = ({ tile }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Tile Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 rounded-lg overflow-hidden">
            {tile.image && !imageError ? (
              <img
                src={tile.image}
                alt={tile.series}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={handleImageError}
                loading="lazy"
              />
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
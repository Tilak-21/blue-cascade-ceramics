import React, { useState } from 'react';
import { Grid, Ruler, Palette, Package, Sparkles } from 'lucide-react';
import { 
  formatTileSize, 
  getCategoryColor, 
  getPEIColor, 
  getMaterialTypeColor, 
  getMaterialTypeName,
  formatNumber 
} from '../utils/helpers';

const TileCard = ({ tile }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="tile-card bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-stone-200">
      <div className="h-40 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center relative overflow-hidden">
        {tile.image && !imageError ? (
          <img
            src={tile.image}
            alt={tile.series}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg shadow-sm flex items-center justify-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-gradient-to-br from-stone-300 to-stone-400 rounded flex items-center justify-center">
              <Grid className="w-6 h-6 text-stone-600" />
            </div>
          </div>
        )}
        
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tile.category)} backdrop-blur-sm bg-opacity-90`}>
          {tile.category}
        </span>
        
        <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getPEIColor(tile.peiRating)} backdrop-blur-sm bg-opacity-90`}>
          {tile.peiRating}
        </span>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-stone-900 leading-tight">{tile.series}</h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-stone-800">${tile.proposedSP}</span>
            <div className="text-xs text-stone-500">per m²</div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-stone-600">
            <Ruler className="w-4 h-4 mr-2 text-stone-400" />
            <span className="font-medium">{formatTileSize(tile.size)}</span>
            <span className="ml-2 text-stone-400">• {tile.thickness}</span>
          </div>
          <div className="flex items-center text-sm text-stone-600">
            <Palette className="w-4 h-4 mr-2 text-stone-400" />
            <span>{tile.finish}</span>
          </div>
          <div className="flex items-center text-sm text-stone-600">
            <Package className="w-4 h-4 mr-2 text-stone-400" />
            <span className="font-medium">{formatNumber(tile.qty)} m²</span>
            <span className="ml-2 text-emerald-600 text-xs">In Stock</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {tile.application.slice(0, 3).map((app, idx) => (
            <span key={idx} className="px-2 py-1 bg-stone-100 text-stone-700 rounded text-xs">
              {app}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMaterialTypeColor(tile.type)}`}>
            {getMaterialTypeName(tile.type)}
          </span>
          <button 
            className="bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-900 transition-colors flex items-center"
            aria-label={`Request quote for ${tile.series}`}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Request Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileCard;
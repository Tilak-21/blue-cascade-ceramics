import React from 'react';
import { MapPin } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

const Header = () => {
  return (
    <header className="bg-white shadow-cascade border-b border-pacific-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cascade-500 to-cascade-600 rounded-xl flex items-center justify-center mr-4 shadow-tile">
              <div className="w-8 h-8 bg-white rounded opacity-95 flex items-center justify-center">
                <div className="w-4 h-4 bg-cascade-600 rounded-sm"></div>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-pacific-900">{APP_CONFIG.name}</h1>
              <p className="text-sm text-cascade-600 font-medium">{APP_CONFIG.tagline}</p>
            </div>
          </div>

          <div className="flex items-center text-sm text-pacific-600">
            <MapPin className="w-4 h-4 mr-2 text-cascade-500" />
            <span className="font-medium">{APP_CONFIG.market} Market Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { MapPin } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-stone-600 to-stone-800 rounded-xl flex items-center justify-center mr-4">
              <div className="w-8 h-8 bg-white rounded opacity-90 flex items-center justify-center">
                <div className="w-4 h-4 bg-stone-800 rounded-sm"></div>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-stone-900">{APP_CONFIG.name}</h1>
              <p className="text-sm text-stone-600">{APP_CONFIG.tagline}</p>
            </div>
          </div>

          <div className="flex items-center text-sm text-stone-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="font-medium">{APP_CONFIG.market} Market Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
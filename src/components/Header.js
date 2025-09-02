import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { APP_CONFIG, CONTACT_INFO } from '../utils/constants';

const Header = () => {
  return (
    <header className="bg-white shadow-cascade border-b border-pacific-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28 sm:h-32">
          {/* Left - Location */}
          <div className="flex-1 flex items-center min-w-0">
            <div className="flex items-center text-xs sm:text-sm text-pacific-600 bg-pacific-50 px-3 py-2 rounded-lg border border-pacific-100">
              <MapPin className="w-4 h-4 mr-2 text-cascade-500 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-medium hidden sm:inline">{APP_CONFIG.market} Market</span>
                <span className="font-medium sm:hidden">PNW</span>
                <div className="text-xs text-pacific-500 hidden sm:block">Ready to Serve</div>
              </div>
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex flex-col items-center flex-shrink-0 mx-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32">
              <img 
                src="/images/site_logo.png" 
                alt={`${APP_CONFIG.name} Logo`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right - Phone */}
          <div className="flex-1 flex justify-end items-center min-w-0">
            <a 
              href={`tel:${CONTACT_INFO.phone}`}
              className="flex items-center text-xs sm:text-sm bg-cascade-500 text-white px-3 py-2 rounded-lg hover:bg-cascade-600 transition-colors duration-200 shadow-sm hover:shadow-md group"
            >
              <Phone className="w-4 h-4 mr-2 flex-shrink-0 group-hover:animate-pulse" />
              <div className="min-w-0">
                <span className="font-semibold hidden sm:inline">{CONTACT_INFO.phone}</span>
                <span className="font-semibold sm:hidden">Call</span>
                <div className="text-xs text-cascade-100 hidden sm:block">Click to Call</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
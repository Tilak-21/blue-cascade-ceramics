import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { APP_CONFIG, CONTACT_INFO } from '../utils/constants';

const Header = () => {
  return (
    <header className="bg-white shadow-cascade border-b border-pacific-200 sticky top-0 z-50" role="banner">
      <nav id="main-navigation" role="navigation" aria-label="Main navigation">
      {/* Mobile Header - Edge to Edge Logo */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between px-2 py-2">
          {/* Left - Larger Location */}
          <div className="flex items-center text-sm text-pacific-600 bg-pacific-50 px-4 py-2 rounded-lg border border-pacific-100">
            <MapPin className="w-4 h-4 mr-2 text-cascade-500 flex-shrink-0" />
            <span className="font-medium">PNW</span>
          </div>

          {/* Right - Larger Phone */}
          <a 
            href={`tel:${CONTACT_INFO.phone}`}
            className="flex items-center text-sm bg-cascade-500 text-white px-4 py-2 rounded-lg hover:bg-cascade-600 transition-colors shadow-sm hover:shadow-md group"
          >
            <Phone className="w-4 h-4 mr-2 flex-shrink-0 group-hover:animate-pulse" />
            <span className="font-semibold">Call</span>
          </a>
        </div>
        
        {/* Large Edge-to-Edge Logo */}
        <div className="px-2 pb-2">
          <div className="w-full h-20 bg-gradient-to-r from-pacific-50 to-cascade-50 rounded-lg border border-pacific-100 p-2">
            <img 
              src="/images/site_logo.png" 
              alt={`${APP_CONFIG.name} Logo`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-32 lg:h-36">
            {/* Left - Location */}
            <div className="flex-1 flex items-center min-w-0">
              <div className="flex items-center text-sm text-pacific-600 bg-pacific-50 px-4 py-3 rounded-lg border border-pacific-100">
                <MapPin className="w-5 h-5 mr-3 text-cascade-500 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-medium">{APP_CONFIG.market} Market</span>
                  <div className="text-xs text-pacific-500">Ready to Serve</div>
                </div>
              </div>
            </div>

            {/* Center - Large Logo */}
            <div className="flex flex-col items-center flex-shrink-0 mx-6">
              <div className="w-36 h-36 lg:w-44 lg:h-44">
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
                className="flex items-center text-sm bg-cascade-500 text-white px-4 py-3 rounded-lg hover:bg-cascade-600 transition-colors duration-200 shadow-sm hover:shadow-md group"
              >
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 group-hover:animate-pulse" />
                <div className="min-w-0">
                  <span className="font-semibold">{CONTACT_INFO.phone}</span>
                  <div className="text-xs text-cascade-100">Click to Call</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      </nav>
    </header>
  );
};

export default Header;
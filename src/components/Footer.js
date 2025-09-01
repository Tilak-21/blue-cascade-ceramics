import React from 'react';
import { Sparkles, Package, Award, MapPin } from 'lucide-react';
import { APP_CONFIG, CONTACT_INFO } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-pacific-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cascade-500 to-cascade-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-cascade">
            <div className="w-10 h-10 bg-white rounded-lg opacity-95 flex items-center justify-center">
              <div className="w-6 h-6 bg-cascade-600 rounded"></div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Space?</h3>
          <p className="text-pacific-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Partner with us for premium ceramic and porcelain tiles inspired by the Pacific Northwest. 
            Quality assurance, competitive pricing, and reliable service throughout the greater Seattle area.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="bg-cascade-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-cascade-600 transition-colors flex items-center shadow-tile-hover">
              <Sparkles className="w-5 h-5 mr-2" />
              Request Quote
            </button>
            <button className="border border-pacific-600 text-pacific-300 px-8 py-4 rounded-xl font-semibold hover:bg-pacific-800 transition-colors">
              View Catalog
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-cascade-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-cascade-300" />
              </div>
              <h4 className="font-semibold mb-2 text-cascade-300">Regional Service</h4>
              <p className="text-pacific-400 text-sm">{CONTACT_INFO.region}</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-forest-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-forest-300" />
              </div>
              <h4 className="font-semibold mb-2 text-forest-300">PNW Quality</h4>
              <p className="text-pacific-400 text-sm">Industry certified & locally sourced</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-stone-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-stone-300" />
              </div>
              <h4 className="font-semibold mb-2 text-stone-300">Seattle Area</h4>
              <p className="text-pacific-400 text-sm">{CONTACT_INFO.showroom}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-pacific-800 text-sm text-pacific-400">
            <p>Contact us: {CONTACT_INFO.email} | {CONTACT_INFO.phone}</p>
            <p className="mt-2">© 2025 {APP_CONFIG.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Sparkles, Package, Award, MapPin } from 'lucide-react';
import { APP_CONFIG, CONTACT_INFO } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-stone-600 to-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 bg-white rounded-lg opacity-90 flex items-center justify-center">
              <div className="w-6 h-6 bg-stone-800 rounded"></div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Space?</h3>
          <p className="text-stone-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Partner with us for premium ceramic and porcelain tiles. We offer competitive bulk pricing, 
            quality assurance, and reliable shipping to the US market. From residential projects to commercial developments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="bg-white text-stone-900 px-8 py-4 rounded-xl font-semibold hover:bg-stone-100 transition-colors flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Request Bulk Quote
            </button>
            <button className="border border-stone-600 text-stone-300 px-8 py-4 rounded-xl font-semibold hover:bg-stone-800 transition-colors">
              Download Catalog
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-stone-300" />
              </div>
              <h4 className="font-semibold mb-2">Volume Discounts</h4>
              <p className="text-stone-400 text-sm">Competitive pricing for large orders</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-stone-300" />
              </div>
              <h4 className="font-semibold mb-2">Quality Certified</h4>
              <p className="text-stone-400 text-sm">ISO standards & PEI rated products</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-stone-300" />
              </div>
              <h4 className="font-semibold mb-2">US Shipping</h4>
              <p className="text-stone-400 text-sm">Fast & reliable delivery nationwide</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-stone-800 text-sm text-stone-400">
            <p>Contact us: {CONTACT_INFO.email} | {CONTACT_INFO.phone}</p>
            <p className="mt-2">© 2025 {APP_CONFIG.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
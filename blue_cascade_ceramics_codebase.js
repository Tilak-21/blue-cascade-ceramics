// =============================================================================
// src/components/TileCard.js
/**
 * Tile Card Component
 * 
 * Individual product card for grid view display. Features hover effects,
 * comprehensive product information, and call-to-action buttons.
 */

import React from 'react';
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
  return (
    <div className="tile-card bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-stone-200">
      {/* Product Image Placeholder */}
      <div className="h-40 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center relative overflow-hidden">
        {/* Tile Visualization */}
        <div className="w-24 h-24 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg shadow-sm flex items-center justify-center transform hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-gradient-to-br from-stone-300 to-stone-400 rounded flex items-center justify-center">
            <Grid className="w-6 h-6 text-stone-600" />
          </div>
        </div>
        
        {/* Category Badge */}
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tile.category)}`}>
          {tile.category}
        </span>
        
        {/* PEI Rating Badge */}
        <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getPEIColor(tile.peiRating)}`}>
          {tile.peiRating}
        </span>
      </div>
      
      {/* Product Information */}
      <div className="p-5">
        {/* Header with Name and Price */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-stone-900 leading-tight">{tile.series}</h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-stone-800">${tile.proposedSP}</span>
            <div className="text-xs text-stone-500">per m²</div>
          </div>
        </div>
        
        {/* Product Specifications */}
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

        {/* Application Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tile.application.slice(0, 3).map((app, idx) => (
            <span key={idx} className="px-2 py-1 bg-stone-100 text-stone-700 rounded text-xs">
              {app}
            </span>
          ))}
        </div>
        
        {/* Footer with Material Type and CTA */}
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

// =============================================================================
// src/components/TileListItem.js
/**
 * Tile List Item Component
 * 
 * Horizontal layout component for list view display. Optimized for
 * detailed product comparison with comprehensive specifications.
 */

import React from 'react';
import { Ruler, Package, Award, Palette } from 'lucide-react';
import { 
  formatTileSize, 
  getCategoryColor, 
  getMaterialTypeColor, 
  getMaterialTypeName,
  formatNumber 
} from '../utils/helpers';

const TileListItem = ({ tile }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Product Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-xl text-stone-900">{tile.series}</h3>
            <div className="text-right">
              <span className="text-2xl font-bold text-stone-800">${tile.proposedSP}</span>
              <span className="text-sm text-stone-500 ml-1">per m²</span>
            </div>
          </div>
          
          {/* Product Specifications Grid */}
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
          
          {/* Tags and CTA */}
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

// =============================================================================
// src/components/Footer.js
/**
 * Footer Component
 * 
 * Application footer with call-to-action, contact information,
 * and key selling points for the US market.
 */

import React from 'react';
import { Sparkles, Package, Award, MapPin } from 'lucide-react';
import { APP_CONFIG, CONTACT_INFO } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Brand Logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-stone-600 to-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 bg-white rounded-lg opacity-90 flex items-center justify-center">
              <div className="w-6 h-6 bg-stone-800 rounded"></div>
            </div>
          </div>
          
          {/* Main CTA */}
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Space?</h3>
          <p className="text-stone-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Partner with us for premium ceramic and porcelain tiles. We offer competitive bulk pricing, 
            quality assurance, and reliable shipping to the US market. From residential projects to commercial developments.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="bg-white text-stone-900 px-8 py-4 rounded-xl font-semibold hover:bg-stone-100 transition-colors flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Request Bulk Quote
            </button>
            <button className="border border-stone-600 text-stone-300 px-8 py-4 rounded-xl font-semibold hover:bg-stone-800 transition-colors">
              Download Catalog
            </button>
          </div>
          
          {/* Key Features */}
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
          
          {/* Contact Information */}
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

// =============================================================================
// src/App.js
/**
 * Main Application Component
 * 
 * Root component that orchestrates the entire tile showcase application.
 * Manages state, filtering logic, and renders all major components.
 */

import React, { useState, useMemo } from 'react';
import { Grid, List, Package } from 'lucide-react';

// Component imports
import Header from './components/Header';
import SearchFilters from './components/SearchFilters';
import TileCard from './components/TileCard';
import TileListItem from './components/TileListItem';
import Footer from './components/Footer';

// Data and utilities
import { tileInventoryData, getUniqueValues } from './data/tileData';
import { calculateTotalInventory } from './utils/helpers';
import { VIEW_MODES, FILTER_DEFAULTS } from './utils/constants';

function App() {
  // State management for filters and view
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(FILTER_DEFAULTS.ALL);
  const [selectedSurface, setSelectedSurface] = useState(FILTER_DEFAULTS.ALL);
  const [selectedApplication, setSelectedApplication] = useState(FILTER_DEFAULTS.ALL);
  const [selectedPEI, setSelectedPEI] = useState(FILTER_DEFAULTS.ALL);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values for filter options
  const surfaces = useMemo(() => getUniqueValues(tileInventoryData, 'surface'), []);
  const applications = useMemo(() => getUniqueValues(tileInventoryData, 'application'), []);
  const peiRatings = useMemo(() => getUniqueValues(tileInventoryData, 'peiRating'), []);

  // Filter data based on current selections
  const filteredData = useMemo(() => {
    return tileInventoryData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === FILTER_DEFAULTS.ALL || item.type === selectedType;
      const matchesSurface = selectedSurface === FILTER_DEFAULTS.ALL || item.surface === selectedSurface;
      const matchesApplication = selectedApplication === FILTER_DEFAULTS.ALL || 
        item.application.includes(selectedApplication);
      const matchesPEI = selectedPEI === FILTER_DEFAULTS.ALL || item.peiRating === selectedPEI;
      
      return matchesSearch && matchesType && matchesSurface && matchesApplication && matchesPEI;
    });
  }, [searchTerm, selectedType, selectedSurface, selectedApplication, selectedPEI]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType(FILTER_DEFAULTS.ALL);
    setSelectedSurface(FILTER_DEFAULTS.ALL);
    setSelectedApplication(FILTER_DEFAULTS.ALL);
    setSelectedPEI(FILTER_DEFAULTS.ALL);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Application Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Interface */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedSurface={selectedSurface}
          setSelectedSurface={setSelectedSurface}
          selectedApplication={selectedApplication}
          setSelectedApplication={setSelectedApplication}
          selectedPEI={selectedPEI}
          setSelectedPEI={setSelectedPEI}
          surfaces={surfaces}
          applications={applications}
          peiRatings={peiRatings}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Results Summary and View Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-stone-800 font-medium text-lg">
              {filteredData.length} Premium Products Available
            </p>
            <p className="text-stone-600 text-sm">
              Total inventory: {calculateTotalInventory(filteredData).toLocaleString()} m²
            </p>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-stone-600">Ready to Ship</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-stone-600">Industry Certified</span>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setViewMode(VIEW_MODES.GRID)}
                className={`p-3 rounded-xl ${viewMode === VIEW_MODES.GRID ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 border border-stone-300'}`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(VIEW_MODES.LIST)}
                className={`p-3 rounded-xl ${viewMode === VIEW_MODES.LIST ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 border border-stone-300'}`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Display */}
        {viewMode === VIEW_MODES.GRID ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredData.map((tile, index) => (
              <TileCard key={`${tile.series}-${tile.material}-${index}`} tile={tile} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map((tile, index) => (
              <TileListItem key={`${tile.series}-${tile.material}-${index}`} tile={tile} />
            ))}
          </div>
        )}

        {/* No Results Message */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-stone-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-stone-900 mb-3">No products match your criteria</h3>
            <p className="text-stone-600 mb-6">Try adjusting your search or filter settings</p>
            <button
              onClick={resetFilters}
              className="bg-stone-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-900 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Application Footer */}
      <Footer />
    </div>
  );
}

export default App;

// =============================================================================
// src/reportWebVitals.js
/**
 * Performance Monitoring
 * 
 * Web Vitals reporting for application performance monitoring.
 * Helps track Core Web Vitals metrics for optimization.
 */

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

// =============================================================================
// tailwind.config.js
/**
 * Tailwind CSS Configuration
 * 
 * Customized Tailwind configuration with extended color palette,
 * typography, and component-specific utilities.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'tile': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'tile-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    // Add any additional Tailwind plugins here
  ],
}

// =============================================================================
// .gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
Thumbs.db
ehthumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

// =============================================================================
// LICENSE
MIT License

Copyright (c) 2025 TileCraft Premium

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

// =============================================================================
// INSTALLATION INSTRUCTIONS
/*
To set up this project locally:

1. Extract all files to a new directory
2. Open terminal in the project directory
3. Run: npm install
4. Run: npm start
5. Open browser to http://localhost:3000

The application will automatically reload when you make changes to the source files.

For production deployment:
1. Run: npm run build
2. Deploy the 'build' folder to your hosting service

Recommended folder structure after extraction:
blue-cascade-ceramics/
├── public/
├── src/
├── package.json
├── README.md
├── tailwind.config.js
├── .gitignore
└── LICENSE
*/
          // =============================================================================
// TILECRAFT PREMIUM - CERAMIC & PORCELAIN TILE SHOWCASE
// Complete React Application Codebase
// =============================================================================

// package.json
{
  "name": "tilecraft-premium",
  "version": "1.0.0",
  "description": "Professional ceramic and porcelain tile showcase application for US market",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "keywords": [
    "ceramic-tiles",
    "porcelain-tiles",
    "tile-showcase",
    "construction-materials",
    "building-supplies",
    "react",
    "tailwind"
  ],
  "author": "TileCraft Premium",
  "license": "MIT"
}

// =============================================================================
// README.md
# TileCraft Premium - Ceramic & Porcelain Tile Showcase

A professional, mobile-first React application for showcasing premium ceramic and porcelain tile inventory to US market buyers.

## 🏗️ Features

### Core Functionality
- **Advanced Product Filtering**: Filter by material type, surface finish, PEI rating, and application
- **Dual View Modes**: Grid view for visual browsing, list view for detailed comparison
- **Real-time Search**: Search across product series, materials, categories, and sizes
- **Professional Categorization**: Industry-standard tile classifications and PEI ratings
- **Mobile-First Design**: Optimized for mobile devices with responsive layouts

### Industry Standards
- **PEI Classification**: Proper durability ratings (Class 1-5) based on traffic requirements
- **Surface Finishes**: Accurate categorization of glazed/unglazed, matt/polished finishes
- **Material Types**: Clear distinction between ceramic and porcelain tiles
- **Professional Applications**: Commercial, residential, and specialized use cases

### Technical Features
- **React 18**: Latest React with functional components and hooks
- **Tailwind CSS**: Utility-first styling with professional color palette
- **Lucide Icons**: Modern, consistent iconography
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Performance Optimized**: Efficient filtering with useMemo hooks

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tilecraft-premium.git
   cd tilecraft-premium
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Build for Production
```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
blue-cascade-ceramics/
├── public/
│   ├── index.html              # Main HTML template
│   ├── manifest.json           # PWA manifest
│   └── favicon.ico            # Application favicon
├── src/
│   ├── components/
│   │   ├── TileCard.js        # Individual tile product card
│   │   ├── TileListItem.js    # List view tile component
│   │   ├── Header.js          # Application header with branding
│   │   ├── SearchFilters.js   # Search and filter components
│   │   └── Footer.js          # Footer with contact information
│   ├── data/
│   │   └── tileData.js        # Product inventory data
│   ├── utils/
│   │   ├── helpers.js         # Utility functions
│   │   └── constants.js       # Application constants
│   ├── styles/
│   │   └── index.css          # Global styles and Tailwind imports
│   ├── App.js                 # Main application component
│   └── index.js               # Application entry point
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## 🎨 Design System

### Color Palette
- **Primary**: Stone tones (stone-50 to stone-900)
- **Accent Colors**: Categorical color coding for tile types
- **Success**: Emerald tones for stock availability
- **Interactive**: Hover states and transitions

### Typography
- **Headings**: Bold, professional font weights
- **Body Text**: Readable sizes with proper line height
- **Labels**: Consistent sizing for form elements

### Component Standards
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Consistent padding, hover states, icon integration
- **Forms**: Clear labels, focus states, validation ready

## 🛠️ Customization

### Adding New Tiles
Edit `src/data/tileData.js` to add new products:

```javascript
{
  type: 'GP', // 'GP' for Porcelain, 'CERAMICS' for Ceramic
  size: 'GP60X60',
  series: 'YOUR_SERIES_NAME',
  material: 'MATERIAL_CODE',
  surface: 'Matt', // Surface finish
  qty: 10000, // Quantity in m²
  proposedSP: 25, // Price per m²
  category: 'Natural Stone Look', // Product category
  application: ['Floor', 'Wall'], // Use cases
  peiRating: 'Class 4', // Durability rating
  thickness: '10mm', // Tile thickness
  finish: 'Glazed Matt' // Detailed finish description
}
```

### Modifying Categories
Update category colors in `src/utils/helpers.js`:

```javascript
const getCategoryColor = (category) => {
  const colors = {
    'Your New Category': 'bg-blue-100 text-blue-800',
    // Add more categories...
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};
```

### Styling Changes
All styles use Tailwind CSS. Modify classes directly in components or extend the configuration in `tailwind.config.js`.

## 🔧 Development

### Code Structure
- **Functional Components**: All components use React hooks
- **State Management**: useState and useMemo for local state
- **Performance**: Optimized filtering and rendering
- **Accessibility**: Semantic HTML and proper ARIA labels

### Best Practices
- **Component Separation**: Logical component boundaries
- **Code Comments**: Comprehensive inline documentation
- **Naming Conventions**: Descriptive variable and function names
- **Error Handling**: Graceful fallbacks for missing data

### Testing
```bash
npm test
# or
yarn test
```

Run tests in watch mode for development.

## 📱 Mobile Optimization

### Responsive Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

### Touch Interactions
- **Tap Targets**: Minimum 44px touch targets
- **Gestures**: Swipe-friendly card layouts
- **Keyboard**: Full keyboard navigation support

## 🚀 Deployment

### Netlify
1. Build the project: `npm run build`
2. Drag the `build` folder to Netlify
3. Configure custom domain if needed

### Vercel
1. Connect your GitHub repository
2. Vercel will automatically build and deploy
3. Configure environment variables if needed

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json: `"homepage": "https://yourusername.github.io/tilecraft-premium"`
3. Add deploy scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Deploy: `npm run deploy`

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support:
- **Email**: support@tilecraftpremium.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/blue-cascade-ceramics/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/blue-cascade-ceramics/wiki)

## 🙏 Acknowledgments

- **Industry Standards**: Based on PEI, ISO, and ANSI tile classifications
- **Design Inspiration**: Modern ceramic industry practices
- **Icons**: Lucide React icon library
- **Styling**: Tailwind CSS framework

---

**Built with ❤️ for the ceramic tile industry**

// =============================================================================
// public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#78716c" />
    <meta
      name="description"
      content="Premium ceramic and porcelain tile showcase for US market buyers. Professional tile inventory with industry-standard classifications."
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>TileCraft Premium - Ceramic & Porcelain Tile Collection</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>

// =============================================================================
// public/manifest.json
{
  "short_name": "TileCraft Premium",
  "name": "TileCraft Premium - Ceramic & Porcelain Tiles",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#78716c",
  "background_color": "#fafaf9"
}

// =============================================================================
// src/index.js
/**
 * Application Entry Point
 * 
 * This file bootstraps the React application and renders the main App component
 * into the DOM. It includes basic performance monitoring with Web Vitals.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create root element for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring (optional)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// =============================================================================
// src/styles/index.css
/**
 * Global Styles and Tailwind CSS
 * 
 * This file imports Tailwind CSS and defines global styles for the application.
 * Custom styles are added after Tailwind imports to ensure proper cascading.
 */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global Styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f8fafc;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth focus transitions */
*:focus {
  outline: none;
}

/* Custom component styles */
.tile-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tile-card:hover {
  transform: translateY(-2px);
}

/* Animation utilities */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

// =============================================================================
// src/data/tileData.js
/**
 * Tile Inventory Data
 * 
 * This file contains the complete product catalog with industry-standard
 * classifications including PEI ratings, surface finishes, and applications.
 * 
 * Data Structure:
 * - type: 'GP' (Porcelain) or 'CERAMICS' (Ceramic)
 * - size: Dimensional format (e.g., 'GP60X60', '20X60RB')
 * - series: Product line name
 * - material: Internal material code
 * - surface: Surface treatment description
 * - qty: Available quantity in square meters
 * - proposedSP: Selling price per square meter (USD)
 * - category: Market category classification
 * - application: Array of recommended use cases
 * - peiRating: Durability rating (Class 1-5)
 * - thickness: Tile thickness specification
 * - finish: Detailed finish description
 */

export const tileInventoryData = [
  // Large Format Premium Porcelain Collection
  {
    type: 'GP',
    size: 'SL60X120TH9',
    series: 'CALACATTA GOLD',
    material: 'B12GCTAG-WHE.M0X5R',
    surface: 'Matt',
    qty: 19763,
    proposedSP: 20,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall', 'Commercial'],
    peiRating: 'Class 4',
    thickness: '9mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'SL60X120TH9',
    series: 'STARK STONE',
    material: 'B12GSRKS-OWH.M0X5R',
    surface: 'Matt',
    qty: 10308,
    proposedSP: 20,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall', 'Commercial'],
    peiRating: 'Class 4',
    thickness: '9mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'SL60X120TH9',
    series: 'TECH MARBLE',
    material: 'A12GTCMB-BTV.X0X5P',
    surface: 'Unglazed Polished',
    qty: 8302,
    proposedSP: 40,
    category: 'Engineered Stone',
    application: ['Floor', 'Wall', 'Luxury Residential'],
    peiRating: 'Class 5',
    thickness: '9mm',
    finish: 'Unglazed Polished'
  },
  {
    type: 'GP',
    size: 'SL60X120TH9',
    series: 'TECH MARBLE',
    material: 'A12GTCMB-SRT.X0X5P',
    surface: 'Unglazed Polished',
    qty: 8931,
    proposedSP: 40,
    category: 'Engineered Stone',
    application: ['Floor', 'Wall', 'Luxury Residential'],
    peiRating: 'Class 5',
    thickness: '9mm',
    finish: 'Unglazed Polished'
  },
  {
    type: 'GP',
    size: 'SL60X120TH9',
    series: 'PIETRA PIASENTINA',
    material: 'A12GPTPS-BEE.A6X5R',
    surface: 'Matt',
    qty: 7613,
    proposedSP: 25,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall', 'Commercial'],
    peiRating: 'Class 4',
    thickness: '9mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'SL60X120TH9',
    series: 'PIETRA PIASENTINA',
    material: 'A12GPTPS-GRY.A6X5R',
    surface: 'Matt',
    qty: 7930,
    proposedSP: 25,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall', 'Commercial'],
    peiRating: 'Class 4',
    thickness: '9mm',
    finish: 'Unglazed Matt'
  },

  // Standard Format Premium Porcelain
  {
    type: 'GP',
    size: 'GP60X60',
    series: 'SEAL MARBLE',
    material: 'A06GSELB-BEE.M0X3L',
    surface: 'Polished Glazed',
    qty: 130860,
    proposedSP: 20,
    category: 'Volume Commercial',
    application: ['Floor', 'Wall', 'Commercial', 'High Traffic'],
    peiRating: 'Class 4',
    thickness: '10mm',
    finish: 'Polished Glazed'
  },
  {
    type: 'GP',
    size: 'GP60X60',
    series: 'PIETRA PIASENTINA',
    material: 'A06GPTPS-BEE.A6X0R',
    surface: 'Matt',
    qty: 10974,
    proposedSP: 20,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall'],
    peiRating: 'Class 4',
    thickness: '10mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'GP60X60',
    series: 'VENQUARTZ',
    material: 'AI06GVEQU-WH0.X0P',
    surface: 'Unglazed Polished',
    qty: 5436,
    proposedSP: 20,
    category: 'Engineered Stone',
    application: ['Floor', 'Wall', 'Luxury Residential'],
    peiRating: 'Class 5',
    thickness: '10mm',
    finish: 'Unglazed Polished'
  },
  {
    type: 'GP',
    size: 'GP30X60',
    series: 'EARTH STONE',
    material: 'A09GZESN-IVO.A0X0R',
    surface: 'Matt',
    qty: 6156,
    proposedSP: 20,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall'],
    peiRating: 'Class 3',
    thickness: '9mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'GP30X60',
    series: 'SIOX',
    material: 'A09GZSIO-WHE.M0X0L',
    surface: 'Matt',
    qty: 5593,
    proposedSP: 20,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall'],
    peiRating: 'Class 3',
    thickness: '9mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'GP30X60',
    series: 'TRIMICK',
    material: 'A09GTMCK-MGY.M6X0R',
    surface: 'Unglazed Matt',
    qty: 17340,
    proposedSP: 25,
    category: 'Industrial Grade',
    application: ['Floor', 'Commercial', 'High Traffic'],
    peiRating: 'Class 5',
    thickness: '10mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'GP30X60',
    series: 'LOUNGE',
    material: 'AUB09LOUNGRYDSST3C',
    surface: 'Unglazed Matt',
    qty: 29537,
    proposedSP: 25,
    category: 'Industrial Grade',
    application: ['Floor', 'Commercial', 'High Traffic'],
    peiRating: 'Class 5',
    thickness: '10mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'GP40X40',
    series: 'GOLDQUADRA',
    material: 'A07GGLDQ-GLD.M0R',
    surface: 'Matt',
    qty: 8803,
    proposedSP: 30,
    category: 'Luxury Collection',
    application: ['Floor', 'Wall', 'Feature'],
    peiRating: 'Class 4',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },

  // Large Format Porcelain Specialty
  {
    type: 'GP',
    size: 'GP80X80',
    series: 'OPIFICIO',
    material: 'A05GOPFC-ANT.M6X0R',
    surface: 'Matt',
    qty: 5832,
    proposedSP: 25,
    category: 'Large Format',
    application: ['Floor', 'Wall', 'Commercial'],
    peiRating: 'Class 4',
    thickness: '10mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'GP80X80',
    series: 'TECH MARBLE',
    material: 'A05GTCMB-PSB.O0X0P',
    surface: 'Unglazed Polished',
    qty: 5311,
    proposedSP: 40,
    category: 'Engineered Stone',
    application: ['Floor', 'Wall', 'Luxury Residential'],
    peiRating: 'Class 5',
    thickness: '10mm',
    finish: 'Unglazed Polished'
  },
  {
    type: 'GP',
    size: 'SL90X180TH9',
    series: 'OPIFICIO',
    material: 'A93GOPFC-BEE.A6X5R',
    surface: 'Matt',
    qty: 5082,
    proposedSP: 40,
    category: 'Large Format',
    application: ['Wall', 'Feature', 'Commercial'],
    peiRating: 'Class 4',
    thickness: '9mm',
    finish: 'Unglazed Matt'
  },
  {
    type: 'GP',
    size: 'SL120X120TH9',
    series: 'NEW TRAVERTINO',
    material: 'AI22GZNTV-GY.G0C3P',
    surface: 'Polished Glazed',
    qty: 5868,
    proposedSP: 40,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall', 'Luxury Residential'],
    peiRating: 'Class 4',
    thickness: '9mm',
    finish: 'Polished Glazed'
  },
  {
    type: 'GP',
    size: 'SL120X19.5TH9CUT',
    series: 'SEA WOOD',
    material: 'A99GSEAW#NUR.A6X5R',
    surface: 'Matt',
    qty: 6065,
    proposedSP: 25,
    category: 'Wood Look',
    application: ['Floor', 'Wall'],
    peiRating: 'Class 3',
    thickness: '9mm',
    finish: 'Unglazed Matt'
  },

  // Traditional Ceramics - Wall & Floor Applications
  {
    type: 'CERAMICS',
    size: '20X60RB',
    series: 'PURSUIT',
    material: 'A26RPUST-LBR.M0X0R',
    surface: 'Matt',
    qty: 23085,
    proposedSP: 12,
    category: 'Volume Residential',
    application: ['Wall', 'Floor', 'Residential'],
    peiRating: 'Class 3',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },
  {
    type: 'CERAMICS',
    size: '20X60RB',
    series: 'DARTHA',
    material: 'A26RDART-IV0.MDU',
    surface: 'Décor Matt',
    qty: 7212,
    proposedSP: 12,
    category: 'Decorative Collection',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Décor Matt'
  },
  {
    type: 'CERAMICS',
    size: '20X60RB',
    series: 'SENALE',
    material: 'A26RZENA-LBE.GDU',
    surface: 'Glossy Décor',
    qty: 5049,
    proposedSP: 12,
    category: 'Decorative Wall',
    application: ['Wall', 'Backsplash'],
    peiRating: 'Class 1',
    thickness: '8mm',
    finish: 'Glazed Glossy'
  },
  {
    type: 'CERAMICS',
    size: '20X60RB',
    series: 'INTENSITY',
    material: 'A26RZINT-BR0.GBU',
    surface: 'Glossy Beveled',
    qty: 6377,
    proposedSP: 12,
    category: 'Designer Wall',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Glossy'
  },

  // Ceramic Specialty Formats
  {
    type: 'CERAMICS',
    size: '30X60RB',
    series: 'VIGA BRICK',
    material: 'A14RZVGB-BLK.GKX0R',
    surface: 'Glossy',
    qty: 9143,
    proposedSP: 12,
    category: 'Brick Look',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Glossy'
  },
  {
    type: 'CERAMICS',
    size: '33X33RB',
    series: 'EMERY',
    material: 'A04REMRY-BLE.MDX0U',
    surface: 'Matt Décor',
    qty: 6755,
    proposedSP: 10,
    category: 'Traditional Format',
    application: ['Floor', 'Wall'],
    peiRating: 'Class 3',
    thickness: '8mm',
    finish: 'Glazed Matt Décor'
  },
  {
    type: 'CERAMICS',
    size: '37.5X75RB',
    series: 'INWOOD',
    material: 'A77RINWD-LIG.M0X0R',
    surface: 'Matt',
    qty: 6657,
    proposedSP: 12,
    category: 'Wood Look',
    application: ['Floor', 'Wall'],
    peiRating: 'Class 3',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },
  {
    type: 'CERAMICS',
    size: '40X120RB',
    series: 'DRAIDE PRO MARBLE',
    material: 'A45RDRPM-WHE.M0X0R',
    surface: 'Matt',
    qty: 8110,
    proposedSP: 15,
    category: 'Large Format Ceramic',
    application: ['Wall', 'Floor'],
    peiRating: 'Class 3',
    thickness: '9mm',
    finish: 'Glazed Matt'
  },
  {
    type: 'CERAMICS',
    size: '40X120RB',
    series: 'BRAID',
    material: 'ARD45ZBRASABZMLE1R',
    surface: 'Matt - Punch',
    qty: 5109,
    proposedSP: 15,
    category: 'Large Format Ceramic',
    application: ['Wall', 'Floor'],
    peiRating: 'Class 3',
    thickness: '9mm',
    finish: 'Glazed Matt'
  },

  // Wood Look & Texture Ceramic Series
  {
    type: 'CERAMICS',
    size: '15X70RB',
    series: 'MISTREY',
    material: 'ARB74MSTYBRNZMSNLU',
    surface: 'Matt',
    qty: 6377,
    proposedSP: 12,
    category: 'Wood Look',
    application: ['Floor', 'Wall'],
    peiRating: 'Class 3',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },
  {
    type: 'CERAMICS',
    size: '15X70RB',
    series: 'WAY CONCRETE',
    material: 'ARB74WCCEBRNZMSNLU',
    surface: 'Matt',
    qty: 5100,
    proposedSP: 12,
    category: 'Concrete Look',
    application: ['Floor', 'Wall'],
    peiRating: 'Class 3',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },
  {
    type: 'CERAMICS',
    size: '20X23WB',
    series: 'COUNTRY BRICK',
    material: 'A23SZCBR-LIG.M6X0U',
    surface: 'Matt',
    qty: 5522,
    proposedSP: 25,
    category: 'Brick Look',
    application: ['Wall', 'Feature', 'Exterior'],
    peiRating: 'Class 4',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },

  // Textured & Feature Ceramic Collection
  {
    type: 'CERAMICS',
    size: '25X90RB',
    series: 'OCEAN WAVE',
    material: 'ARB43OCWESABZMLNLR',
    surface: 'Matt',
    qty: 7272,
    proposedSP: 12,
    category: 'Textured Collection',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },
  {
    type: 'CERAMICS',
    size: '25X90RB',
    series: 'SKIPTON',
    material: 'ARB43SKTNIVOZMLNLR',
    surface: 'Matt',
    qty: 5945,
    proposedSP: 12,
    category: 'Textured Collection',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },
  {
    type: 'CERAMICS',
    size: '25X90RB',
    series: 'RIPPLE',
    material: 'ARB43ZRPLBUWZMSNLR',
    surface: 'Matt',
    qty: 5773,
    proposedSP: 12,
    category: 'Textured Collection',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },
  {
    type: 'CERAMICS',
    size: '25X90RB',
    series: 'NOTREES',
    material: 'ARD43NTRRBEEZMLN1R',
    surface: 'Matt - Punch',
    qty: 5139,
    proposedSP: 12,
    category: 'Textured Collection',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },

  // Multi-Surface Ceramic Applications
  {
    type: 'CERAMICS',
    size: '40X80RB',
    series: 'BIANCO VENA',
    material: 'A48RZBVA-WH0.HLR',
    surface: 'Line Décor - Glossy',
    qty: 5850,
    proposedSP: 12,
    category: 'Marble Look',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Glossy'
  },
  {
    type: 'CERAMICS',
    size: '40X80RB',
    series: 'METROPOL',
    material: 'A48RZMPL-MGY.MDR',
    surface: 'Décor - Matt',
    qty: 5211,
    proposedSP: 12,
    category: 'Urban Collection',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },
  {
    type: 'CERAMICS',
    size: '40X80RB',
    series: 'METROPOL',
    material: 'A48RZNUM-IV0.HDR',
    surface: 'Décor Glossy',
    qty: 5440,
    proposedSP: 12,
    category: 'Urban Collection',
    application: ['Wall', 'Feature'],
    peiRating: 'Class 2',
    thickness: '8mm',
    finish: 'Glazed Glossy'
  },
  {
    type: 'CERAMICS',
    size: '40X80RB',
    series: 'BASSANO',
    material: 'ARB48BSNOBUWZMLNLR',
    surface: 'Matt',
    qty: 8074,
    proposedSP: 12,
    category: 'Natural Stone Look',
    application: ['Wall', 'Floor'],
    peiRating: 'Class 3',
    thickness: '8mm',
    finish: 'Glazed Matt'
  },

  // Thick Format Premium Ceramic
  {
    type: 'CERAMICS',
    size: '41.6X41.6RBTH13',
    series: 'BRIME STONE',
    material: 'A07RBIST-IVO.M0X1U',
    surface: 'Matt - 13mm',
    qty: 7513,
    proposedSP: 15,
    category: 'Heavy Duty',
    application: ['Floor', 'Commercial', 'High Traffic'],
    peiRating: 'Class 4',
    thickness: '13mm',
    finish: 'Glazed Matt'
  }
];

/**
 * Helper function to get unique values for filters
 */
export const getUniqueValues = (data, key) => {
  if (key === 'application') {
    return [...new Set(data.flatMap(item => item.application))];
  }
  return [...new Set(data.map(item => item[key]))];
};

/**
 * Helper function to filter data based on multiple criteria
 */
export const filterTileData = (data, filters) => {
  return data.filter(item => {
    const matchesSearch = !filters.search || 
      item.series.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.material.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.size.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.category.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = !filters.type || filters.type === 'ALL' || item.type === filters.type;
    const matchesSurface = !filters.surface || filters.surface === 'ALL' || item.surface === filters.surface;
    const matchesApplication = !filters.application || filters.application === 'ALL' || 
      item.application.includes(filters.application);
    const matchesPEI = !filters.peiRating || filters.peiRating === 'ALL' || item.peiRating === filters.peiRating;
    
    return matchesSearch && matchesType && matchesSurface && matchesApplication && matchesPEI;
  });
};

// =============================================================================
// src/utils/helpers.js
/**
 * Utility Functions
 * 
 * This file contains helper functions for data processing, formatting,
 * and UI utilities used throughout the application.
 */

/**
 * Format tile size for display
 * Converts internal size format to user-friendly dimensions
 * 
 * @param {string} size - Internal size format (e.g., 'GP60X60', '20X60RB')
 * @returns {string} - Formatted size (e.g., '60 × 60 cm', '20 × 60 cm')
 */
export const formatTileSize = (size) => {
  if (size.includes('GP')) {
    return size.replace('GP', '').replace('X', ' × ') + ' cm';
  }
  if (size.includes('SL')) {
    const cleanSize = size.replace('SL', '').replace('TH9', '').replace('CUT', '');
    return cleanSize.replace('X', ' × ') + ' cm';
  }
  return size.replace('RB', '').replace('WB', '').replace('RBTH13', '').replace('X', ' × ') + ' cm';
};

/**
 * Get category-specific color coding
 * Returns Tailwind CSS classes for category badges
 * 
 * @param {string} category - Product category
 * @returns {string} - Tailwind CSS classes
 */
export const getCategoryColor = (category) => {
  const colorMap = {
    'Volume Commercial': 'bg-slate-100 text-slate-800',
    'Volume Residential': 'bg-emerald-100 text-emerald-800',
    'Natural Stone Look': 'bg-amber-100 text-amber-800',
    'Large Format Ceramic': 'bg-orange-100 text-orange-800',
    'Large Format': 'bg-orange-100 text-orange-800',
    'Engineered Stone': 'bg-purple-100 text-purple-800',
    'Luxury Collection': 'bg-yellow-100 text-yellow-800',
    'Industrial Grade': 'bg-red-100 text-red-800',
    'Wood Look': 'bg-green-100 text-green-800',
    'Brick Look': 'bg-rose-100 text-rose-800',
    'Concrete Look': 'bg-gray-100 text-gray-800',
    'Textured Collection': 'bg-indigo-100 text-indigo-800',
    'Decorative Wall': 'bg-pink-100 text-pink-800',
    'Decorative Collection': 'bg-pink-100 text-pink-800',
    'Designer Wall': 'bg-violet-100 text-violet-800',
    'Traditional Format': 'bg-blue-100 text-blue-800',
    'Marble Look': 'bg-stone-100 text-stone-800',
    'Urban Collection': 'bg-cyan-100 text-cyan-800',
    'Heavy Duty': 'bg-zinc-100 text-zinc-800'
  };
  return colorMap[category] || 'bg-gray-100 text-gray-800';
};

/**
 * Get PEI rating color coding
 * Returns Tailwind CSS classes for PEI rating badges
 * 
 * @param {string} peiRating - PEI classification (Class 1-5)
 * @returns {string} - Tailwind CSS classes
 */
export const getPEIColor = (peiRating) => {
  const colorMap = {
    'Class 1': 'bg-blue-50 text-blue-700',
    'Class 2': 'bg-green-50 text-green-700',
    'Class 3': 'bg-yellow-50 text-yellow-700',
    'Class 4': 'bg-orange-50 text-orange-700',
    'Class 5': 'bg-red-50 text-red-700'
  };
  return colorMap[peiRating] || 'bg-gray-50 text-gray-700';
};

/**
 * Get material type color coding
 * Returns Tailwind CSS classes for material type badges
 * 
 * @param {string} type - Material type ('GP' or 'CERAMICS')
 * @returns {string} - Tailwind CSS classes
 */
export const getMaterialTypeColor = (type) => {
  return type === 'CERAMICS' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-800';
};

/**
 * Get material type display name
 * Converts internal type codes to user-friendly names
 * 
 * @param {string} type - Internal type code ('GP' or 'CERAMICS')
 * @returns {string} - Display name
 */
export const getMaterialTypeName = (type) => {
  return type === 'GP' ? 'Porcelain' : 'Ceramic';
};

/**
 * Format number with thousand separators
 * 
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  return num.toLocaleString();
};

/**
 * Calculate total inventory value
 * 
 * @param {Array} data - Tile inventory data
 * @returns {number} - Total value in square meters
 */
export const calculateTotalInventory = (data) => {
  return data.reduce((total, item) => total + item.qty, 0);
};

/**
 * Get PEI rating description
 * Returns detailed description of PEI rating applications
 * 
 * @param {string} peiRating - PEI classification
 * @returns {string} - Description of suitable applications
 */
export const getPEIDescription = (peiRating) => {
  const descriptions = {
    'Class 1': 'Wall use only - No foot traffic',
    'Class 2': 'Light residential traffic - Bathroom floors',
    'Class 3': 'Light to moderate residential traffic - Most home applications',
    'Class 4': 'Moderate to heavy traffic - Commercial and residential floors',
    'Class 5': 'Heavy to extra-heavy traffic - Commercial and industrial applications'
  };
  return descriptions[peiRating] || 'Standard durability rating';
};

/**
 * Debounce function for search input
 * Delays function execution until after specified wait time
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// =============================================================================
// src/utils/constants.js
/**
 * Application Constants
 * 
 * This file contains all constant values used throughout the application
 * including configuration, default values, and static content.
 */

// Application Information
export const APP_CONFIG = {
  name: 'TileCraft Premium',
  tagline: 'Ceramic & Porcelain Collection',
  description: 'Professional ceramic and porcelain tile showcase for US market buyers',
  version: '1.0.0',
  author: 'Blue Cascade Ceramics',
  market: 'USA'
};

// View Modes
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

// Filter Options
export const FILTER_DEFAULTS = {
  ALL: 'ALL',
  SEARCH_PLACEHOLDER: 'Search by series, material, category, or size...',
  DEBOUNCE_DELAY: 300
};

// Material Types
export const MATERIAL_TYPES = {
  CERAMICS: 'CERAMICS',
  GP: 'GP' // Glazed Porcelain
};

// PEI Rating Information
export const PEI_RATINGS = {
  CLASS_1: 'Class 1',
  CLASS_2: 'Class 2',
  CLASS_3: 'Class 3',
  CLASS_4: 'Class 4',
  CLASS_5: 'Class 5'
};

// Common Applications
export const APPLICATIONS = [
  'Floor',
  'Wall',
  'Commercial',
  'Residential',
  'High Traffic',
  'Backsplash',
  'Feature',
  'Exterior',
  'Luxury Residential'
];

// Surface Finishes
export const SURFACE_FINISHES = [
  'Matt',
  'Glossy',
  'Polished',
  'Textured',
  'Unglazed Matt',
  'Polished Glazed',
  'Unglazed Polished'
];

// Responsive Breakpoints (Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Animation Durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Contact Information
export const CONTACT_INFO = {
  email: 'sales@tilecraftpremium.com',
  phone: '+1 (555) 123-4567',
  address: 'Premium Tile District, USA',
  supportEmail: 'support@tilecraftpremium.com'
};

// SEO Meta Information
export const SEO_META = {
  title: 'TileCraft Premium - Professional Ceramic & Porcelain Tiles',
  description: 'Discover premium ceramic and porcelain tiles for commercial and residential projects. Industry-certified quality with competitive US market pricing.',
  keywords: [
    'ceramic tiles',
    'porcelain tiles',
    'building materials',
    'construction supplies',
    'tile wholesale',
    'commercial tiles',
    'residential tiles',
    'US market',
    'premium tiles',
    'tile inventory'
  ]
};

// Social Media Links (placeholder)
export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/tilecraft-premium',
  instagram: 'https://instagram.com/tilecraftpremium',
  facebook: 'https://facebook.com/tilecraftpremium'
};

// =============================================================================
// src/components/Header.js
/**
 * Header Component
 * 
 * Main application header with branding, navigation, and market indicator.
 * Includes responsive design and sticky positioning for better UX.
 */

import React from 'react';
import { MapPin } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo and Name */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="w-12 h-12 bg-gradient-to-br from-stone-600 to-stone-800 rounded-xl flex items-center justify-center mr-4">
              <div className="w-8 h-8 bg-white rounded opacity-90 flex items-center justify-center">
                <div className="w-4 h-4 bg-stone-800 rounded-sm"></div>
              </div>
            </div>
            
            {/* Brand Text */}
            <div>
              <h1 className="text-2xl font-bold text-stone-900">{APP_CONFIG.name}</h1>
              <p className="text-sm text-stone-600">{APP_CONFIG.tagline}</p>
            </div>
          </div>

          {/* Market Indicator */}
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

// =============================================================================
// src/components/SearchFilters.js
/**
 * Search and Filters Component
 * 
 * Comprehensive filtering interface with search input, dropdowns,
 * and advanced filter panel. Includes debounced search for performance.
 */

import React, { useState, useCallback } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { debounce } from '../utils/helpers';
import { FILTER_DEFAULTS } from '../utils/constants';

const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedSurface,
  setSelectedSurface,
  selectedApplication,
  setSelectedApplication,
  selectedPEI,
  setSelectedPEI,
  surfaces,
  applications,
  peiRatings,
  showFilters,
  setShowFilters
}) => {
  // Debounced search to improve performance
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, FILTER_DEFAULTS.DEBOUNCE_DELAY),
    [setSearchTerm]
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className="mb-8">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
        <input
          type="text"
          placeholder={FILTER_DEFAULTS.SEARCH_PLACEHOLDER}
          className="w-full pl-12 pr-4 py-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-stone-900 placeholder-stone-500 bg-white"
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-5 py-3 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors"
            aria-expanded={showFilters}
            aria-controls="advanced-filters"
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Material Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 text-stone-900"
            aria-label="Filter by material type"
          >
            <option value={FILTER_DEFAULTS.ALL}>All Materials</option>
            <option value="CERAMICS">Ceramic Tiles</option>
            <option value="GP">Porcelain Tiles</option>
          </select>

          {/* Application Filter */}
          <select
            value={selectedApplication}
            onChange={(e) => setSelectedApplication(e.target.value)}
            className="px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 text-stone-900"
            aria-label="Filter by application"
          >
            <option value={FILTER_DEFAULTS.ALL}>All Applications</option>
            {applications.map(app => (
              <option key={app} value={app}>{app}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div 
          id="advanced-filters"
          className="mt-6 p-6 bg-white rounded-xl border border-stone-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Surface Finish Filter */}
            <div>
              <label htmlFor="surface-filter" className="block text-sm font-medium text-stone-700 mb-2">
                Surface Finish
              </label>
              <select
                id="surface-filter"
                value={selectedSurface}
                onChange={(e) => setSelectedSurface(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500"
              >
                <option value={FILTER_DEFAULTS.ALL}>All Finishes</option>
                {surfaces.map(surface => (
                  <option key={surface} value={surface}>{surface}</option>
                ))}
              </select>
            </div>
            
            {/* PEI Rating Filter */}
            <div>
              <label htmlFor="pei-filter" className="block text-sm font-medium text-stone-700 mb-2">
                PEI Rating
              </label>
              <select
                id="pei-filter"
                value={selectedPEI}
                onChange={(e) => setSelectedPEI(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500"
              >
                <option value={FILTER_DEFAULTS.ALL}>All Ratings</option>
                {peiRatings.map(pei => (
                  <option key={pei} value={pei}>{pei}</option>
                ))}
              </select>
            </div>
            
            {/* Information Panel */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Information
              </label>
              <p className="text-xs text-stone-600 leading-relaxed">
                PEI ratings indicate durability: Class 1 (wall only) to Class 5 (heavy commercial traffic).
                Porcelain tiles have ≤0.5% water absorption for superior performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
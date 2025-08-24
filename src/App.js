import React, { useState, useMemo } from 'react';
import { Grid, List, Package } from 'lucide-react';

import Header from './components/Header';
import SearchFilters from './components/SearchFilters';
import TileCard from './components/TileCard';
import TileListItem from './components/TileListItem';
import Footer from './components/Footer';

import { tileInventoryData, getUniqueValues } from './data/tileData';
import { calculateTotalInventory } from './utils/helpers';
import { VIEW_MODES, FILTER_DEFAULTS } from './utils/constants';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(FILTER_DEFAULTS.ALL);
  const [selectedSurface, setSelectedSurface] = useState(FILTER_DEFAULTS.ALL);
  const [selectedApplication, setSelectedApplication] = useState(FILTER_DEFAULTS.ALL);
  const [selectedPEI, setSelectedPEI] = useState(FILTER_DEFAULTS.ALL);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [showFilters, setShowFilters] = useState(false);

  const surfaces = useMemo(() => getUniqueValues(tileInventoryData, 'surface'), []);
  const applications = useMemo(() => getUniqueValues(tileInventoryData, 'application'), []);
  const peiRatings = useMemo(() => getUniqueValues(tileInventoryData, 'peiRating'), []);

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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType(FILTER_DEFAULTS.ALL);
    setSelectedSurface(FILTER_DEFAULTS.ALL);
    setSelectedApplication(FILTER_DEFAULTS.ALL);
    setSelectedPEI(FILTER_DEFAULTS.ALL);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-stone-800 font-medium text-lg">
              {filteredData.length} Premium Products Available
            </p>
            <p className="text-stone-600 text-sm">
              Total inventory: {calculateTotalInventory(filteredData).toLocaleString()} m²
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-stone-600">Ready to Ship</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-stone-600">Industry Certified</span>
            </div>
            
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

      <Footer />
    </div>
  );
}

export default App;
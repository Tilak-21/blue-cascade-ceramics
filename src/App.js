import React, { useState, useMemo } from 'react';
import { Grid, List, Package } from 'lucide-react';

import Header from './components/Header';
import SearchFilters from './components/SearchFilters';
import TileCard from './components/TileCard';
import TileListItem from './components/TileListItem';
import Footer from './components/Footer';
import ImageModal from './components/ImageModal';

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
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    currentTile: null,
    currentIndex: 0
  });

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

  // Image modal handlers
  const handleImageClick = (tile) => {
    const tileIndex = filteredData.findIndex(item => 
      item.series === tile.series && item.material === tile.material
    );
    
    setImageModal({
      isOpen: true,
      currentTile: tile,
      currentIndex: tileIndex
    });
  };

  const handleCloseModal = () => {
    setImageModal({
      isOpen: false,
      currentTile: null,
      currentIndex: 0
    });
  };

  const handlePreviousImage = () => {
    if (imageModal.currentIndex > 0) {
      const previousIndex = imageModal.currentIndex - 1;
      const previousTile = filteredData[previousIndex];
      
      setImageModal(prev => ({
        ...prev,
        currentTile: previousTile,
        currentIndex: previousIndex
      }));
    }
  };

  const handleNextImage = () => {
    if (imageModal.currentIndex < filteredData.length - 1) {
      const nextIndex = imageModal.currentIndex + 1;
      const nextTile = filteredData[nextIndex];
      
      setImageModal(prev => ({
        ...prev,
        currentTile: nextTile,
        currentIndex: nextIndex
      }));
    }
  };

  return (
    <div className="min-h-screen bg-pacific-50">
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

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <p className="text-pacific-800 font-medium text-base sm:text-lg">
              {filteredData.length} Premium Products Available
            </p>
            <p className="text-cascade-600 text-sm">
              Total inventory: {calculateTotalInventory(filteredData).toLocaleString()} m²
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-forest-500 rounded-full flex-shrink-0"></div>
              <span className="text-pacific-600">Ready to Ship</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cascade-500 rounded-full flex-shrink-0"></div>
              <span className="text-pacific-600">Industry Certified</span>
            </div>
            
            <div className="flex items-center gap-2 ml-0 sm:ml-4">
              <button
                onClick={() => setViewMode(VIEW_MODES.GRID)}
                className={`p-2 sm:p-3 rounded-xl transition-colors ${viewMode === VIEW_MODES.GRID ? 'bg-cascade-600 text-white shadow-tile' : 'bg-white text-pacific-600 border border-pacific-300 hover:bg-pacific-50'}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode(VIEW_MODES.LIST)}
                className={`p-2 sm:p-3 rounded-xl transition-colors ${viewMode === VIEW_MODES.LIST ? 'bg-cascade-600 text-white shadow-tile' : 'bg-white text-pacific-600 border border-pacific-300 hover:bg-pacific-50'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === VIEW_MODES.GRID ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {filteredData.map((tile, index) => (
              <TileCard 
                key={`${tile.series}-${tile.material}-${index}`} 
                tile={tile}
                onImageClick={handleImageClick}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map((tile, index) => (
              <TileListItem 
                key={`${tile.series}-${tile.material}-${index}`} 
                tile={tile}
                onImageClick={handleImageClick}
              />
            ))}
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-pacific-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-pacific-900 mb-3">No products match your criteria</h3>
            <p className="text-pacific-600 mb-6">Try adjusting your search or filter settings</p>
            <button
              onClick={resetFilters}
              className="bg-cascade-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-cascade-700 transition-colors shadow-tile-hover"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      <Footer />

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={handleCloseModal}
        imageSrc={imageModal.currentTile?.image}
        imageAlt={`${imageModal.currentTile?.series} ${imageModal.currentTile?.material}`}
        tileData={imageModal.currentTile}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
        hasPrevious={imageModal.currentIndex > 0}
        hasNext={imageModal.currentIndex < filteredData.length - 1}
      />
    </div>
  );
}

export default App;
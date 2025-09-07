import React, { useCallback } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
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
  selectedCategory,
  setSelectedCategory,
  surfaces,
  applications,
  peiRatings,
  showFilters,
  setShowFilters
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, FILTER_DEFAULTS.DEBOUNCE_DELAY),
    [setSearchTerm]
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedType !== FILTER_DEFAULTS.ALL) count++;
    if (selectedSurface !== FILTER_DEFAULTS.ALL) count++;
    if (selectedApplication !== FILTER_DEFAULTS.ALL) count++;
    if (selectedPEI !== FILTER_DEFAULTS.ALL) count++;
    if (selectedCategory && selectedCategory !== FILTER_DEFAULTS.ALL) count++;
    return count;
  };

  const resetAllFilters = () => {
    setSelectedType(FILTER_DEFAULTS.ALL);
    setSelectedSurface(FILTER_DEFAULTS.ALL);
    setSelectedApplication(FILTER_DEFAULTS.ALL);
    setSelectedPEI(FILTER_DEFAULTS.ALL);
    setSelectedCategory(FILTER_DEFAULTS.ALL);
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cascade-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by series, material, category, or size..."
          className="w-full pl-12 pr-12 py-4 border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 focus:border-transparent text-pacific-900 placeholder-pacific-500 bg-white shadow-sm text-base"
          onChange={handleSearchChange}
          defaultValue={searchTerm}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pacific-400 hover:text-pacific-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Material Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-white border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 text-pacific-900 shadow-sm min-w-0 sm:min-w-[160px] text-sm sm:text-base"
            aria-label="Filter by material type"
          >
            <option value={FILTER_DEFAULTS.ALL}>All Materials</option>
            <option value="CERAMICS">Ceramic</option>
            <option value="GP">Porcelain</option>
          </select>

          {/* Application Filter */}
          <select
            value={selectedApplication}
            onChange={(e) => setSelectedApplication(e.target.value)}
            className="px-4 py-3 bg-white border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 text-pacific-900 shadow-sm min-w-0 sm:min-w-[180px] text-sm sm:text-base"
            aria-label="Filter by application"
          >
            <option value={FILTER_DEFAULTS.ALL}>All Applications</option>
            <option value="Residential Floor">Residential Floor</option>
            <option value="Residential Wall">Residential Wall</option>
            <option value="Commercial Floor">Commercial Floor</option>
            <option value="Commercial Wall">Commercial Wall</option>
            <option value="Luxury Applications">Luxury Applications</option>
            <option value="Feature & Accent">Feature & Accent</option>
            <option value="Exterior Applications">Exterior</option>
          </select>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="px-3 py-2 text-sm text-pacific-600 hover:text-pacific-800 transition-colors"
              aria-label="Clear all filters"
            >
              Clear ({activeFilterCount})
            </button>
          )}
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-3 rounded-xl transition-colors shadow-sm min-h-[44px] ${
              showFilters 
                ? 'bg-cascade-600 text-white' 
                : 'bg-white border border-pacific-300 text-pacific-700 hover:bg-pacific-50'
            }`}
            aria-expanded={showFilters}
            aria-controls="advanced-filters"
          >
            <Filter className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Advanced</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-cascade-500 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div 
          id="advanced-filters"
          className="p-6 bg-gradient-to-r from-pacific-50 to-cascade-50 rounded-xl border border-pacific-200 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Surface Finish Filter */}
            <div>
              <label htmlFor="surface-filter" className="block text-sm font-semibold text-pacific-800 mb-3">
                Surface Finish
              </label>
              <select
                id="surface-filter"
                value={selectedSurface}
                onChange={(e) => setSelectedSurface(e.target.value)}
                className="w-full px-4 py-3 border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 text-pacific-900 bg-white shadow-sm"
              >
                <option value={FILTER_DEFAULTS.ALL}>All Finishes</option>
                <option value="Matte">Matte</option>
                <option value="Glossy">Glossy</option>
                <option value="Polished">Polished</option>
                <option value="Textured Matte">Textured Matte</option>
                <option value="Textured Glossy">Textured Glossy</option>
                <option value="Textured">Textured</option>
              </select>
            </div>
            
            {/* PEI Rating Filter */}
            <div>
              <label htmlFor="pei-filter" className="block text-sm font-semibold text-pacific-800 mb-3">
                PEI Durability Rating
              </label>
              <select
                id="pei-filter"
                value={selectedPEI}
                onChange={(e) => setSelectedPEI(e.target.value)}
                className="w-full px-4 py-3 border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 text-pacific-900 bg-white shadow-sm"
              >
                <option value={FILTER_DEFAULTS.ALL}>All Ratings</option>
                {peiRatings.map(pei => (
                  <option key={pei} value={pei}>{pei}</option>
                ))}
              </select>
            </div>

            {/* Product Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-semibold text-pacific-800 mb-3">
                Product Category
              </label>
              <select
                id="category-filter"
                value={selectedCategory || FILTER_DEFAULTS.ALL}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 text-pacific-900 bg-white shadow-sm"
              >
                <option value={FILTER_DEFAULTS.ALL}>All Categories</option>
                <option value="Natural Stone Look">Natural Stone Look</option>
                <option value="Engineered Stone">Engineered Stone</option>
                <option value="Wood Look">Wood Look</option>
                <option value="Concrete & Industrial">Concrete & Industrial</option>
                <option value="Large Format">Large Format</option>
                <option value="Volume Commercial">Volume Commercial</option>
                <option value="Luxury Collection">Luxury Collection</option>
                <option value="Decorative & Specialty">Decorative & Specialty</option>
              </select>
            </div>
          </div>
          
          {/* Professional Info Panel */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-pacific-200">
            <h4 className="text-sm font-semibold text-pacific-800 mb-2 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-cascade-600" />
              Professional Tile Guide
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-pacific-700">
              <div>
                <strong>PEI Ratings:</strong> Class 1 (walls) • Class 2 (light residential) • Class 3 (moderate traffic) • Class 4 (heavy residential) • Class 5 (commercial)
              </div>
              <div>
                <strong>Material Types:</strong> Ceramic (versatile, cost-effective) • Porcelain (≤0.5% absorption, superior durability)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
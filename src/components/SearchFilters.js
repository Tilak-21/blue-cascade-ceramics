import React, { useCallback } from 'react';
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

  return (
    <div className="mb-8">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cascade-400 w-5 h-5" />
        <input
          type="text"
          placeholder={FILTER_DEFAULTS.SEARCH_PLACEHOLDER}
          className="w-full pl-12 pr-4 py-4 border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 focus:border-transparent text-pacific-900 placeholder-pacific-500 bg-white shadow-sm"
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center sm:justify-start px-5 py-3 bg-white border border-pacific-300 rounded-xl hover:bg-pacific-50 transition-colors shadow-sm w-full sm:w-auto"
            aria-expanded={showFilters}
            aria-controls="advanced-filters"
          >
            <Filter className="w-4 h-4 mr-2 text-cascade-500" />
            Advanced Filters
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-white border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 text-pacific-900 shadow-sm w-full sm:w-auto text-sm sm:text-base"
            aria-label="Filter by material type"
          >
            <option value={FILTER_DEFAULTS.ALL}>All Materials</option>
            <option value="CERAMICS">Ceramic Tiles</option>
            <option value="GP">Porcelain Tiles</option>
          </select>

          <select
            value={selectedApplication}
            onChange={(e) => setSelectedApplication(e.target.value)}
            className="px-4 py-3 bg-white border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 text-pacific-900 shadow-sm w-full sm:w-auto text-sm sm:text-base"
            aria-label="Filter by application"
          >
            <option value={FILTER_DEFAULTS.ALL}>All Applications</option>
            {applications.map(app => (
              <option key={app} value={app}>{app}</option>
            ))}
          </select>
        </div>
      </div>

      {showFilters && (
        <div 
          id="advanced-filters"
          className="mt-6 p-6 bg-white rounded-xl border border-pacific-200 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="surface-filter" className="block text-sm font-medium text-pacific-700 mb-2">
                Surface Finish
              </label>
              <select
                id="surface-filter"
                value={selectedSurface}
                onChange={(e) => setSelectedSurface(e.target.value)}
                className="w-full px-4 py-3 border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 text-pacific-900"
              >
                <option value={FILTER_DEFAULTS.ALL}>All Finishes</option>
                {surfaces.map(surface => (
                  <option key={surface} value={surface}>{surface}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="pei-filter" className="block text-sm font-medium text-pacific-700 mb-2">
                PEI Rating
              </label>
              <select
                id="pei-filter"
                value={selectedPEI}
                onChange={(e) => setSelectedPEI(e.target.value)}
                className="w-full px-4 py-3 border border-pacific-300 rounded-xl focus:ring-2 focus:ring-cascade-500 text-pacific-900"
              >
                <option value={FILTER_DEFAULTS.ALL}>All Ratings</option>
                {peiRatings.map(pei => (
                  <option key={pei} value={pei}>{pei}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-pacific-700 mb-2">
                Information
              </label>
              <p className="text-xs text-pacific-600 leading-relaxed">
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
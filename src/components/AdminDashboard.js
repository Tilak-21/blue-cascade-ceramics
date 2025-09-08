import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BarChart3, Package, DollarSign, TrendingUp } from 'lucide-react';
import TileForm from './TileForm';
import { API_BASE_URL } from '../config/api';

const AdminDashboard = ({ onLogout }) => {
  const [tiles, setTiles] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showTileForm, setShowTileForm] = useState(false);
  const [editingTile, setEditingTile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    showInactive: false
  });

  const API_BASE = API_BASE_URL;

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  // Fetch tiles
  const fetchTiles = async (page = 1, searchFilters = filters) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...Object.fromEntries(Object.entries(searchFilters).filter(([_, v]) => v))
      });

      const response = await fetch(`${API_BASE}/tiles?${params}`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setTiles(data.data);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to fetch tiles:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDashboardStats(), fetchTiles()]);
      setLoading(false);
    };
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchTiles(1, newFilters);
  };

  // Handle tile operations
  const handleAddTile = () => {
    setEditingTile(null);
    setShowTileForm(true);
  };

  const handleEditTile = (tile) => {
    setEditingTile(tile);
    setShowTileForm(true);
  };

  const handleDeleteTile = async (tileId) => {
    if (!window.confirm('Are you sure you want to delete this tile?')) return;

    try {
      const response = await fetch(`${API_BASE}/tiles/${tileId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        await fetchTiles(currentPage);
        await fetchDashboardStats();
      } else {
        alert('Failed to delete tile');
      }
    } catch (error) {
      console.error('Error deleting tile:', error);
      alert('Error deleting tile');
    }
  };

  const handleTileFormSuccess = async () => {
    setShowTileForm(false);
    setEditingTile(null);
    await fetchTiles(currentPage);
    await fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cascade-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-cascade-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Blue Cascade Ceramics</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tiles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.overview?.totalTiles || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tiles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.overview?.activeTiles || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inventory</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.inventory?.totalQuantity?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardStats.overview?.totalInventoryValue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tiles Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Tile Management</h2>
              <button
                onClick={handleAddTile}
                className="flex items-center px-4 py-2 bg-cascade-600 text-white rounded-lg hover:bg-cascade-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Tile
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search tiles..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              />
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="GP">GP</option>
                <option value="CERAMICS">CERAMICS</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Natural Stone Look">Natural Stone Look</option>
                <option value="Traditional Format">Traditional Format</option>
                <option value="Modern Design">Modern Design</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showInactive}
                  onChange={(e) => handleFilterChange('showInactive', e.target.checked)}
                  className="rounded border-gray-300 text-cascade-600 focus:ring-cascade-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Inactive</span>
              </label>
            </div>
          </div>

          {/* Tiles Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tile Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tiles.map((tile) => (
                  <tr key={tile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tile.series}</div>
                        <div className="text-sm text-gray-500">{tile.material}</div>
                        <div className="text-xs text-gray-400">{tile.size}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tile.type}</div>
                      <div className="text-sm text-gray-500">{tile.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tile.qty.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${tile.proposedSP}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tile.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tile.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditTile(tile)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTile(tile.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchTiles(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchTiles(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tile Form Modal */}
      {showTileForm && (
        <TileForm
          tile={editingTile}
          onClose={() => setShowTileForm(false)}
          onSuccess={handleTileFormSuccess}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
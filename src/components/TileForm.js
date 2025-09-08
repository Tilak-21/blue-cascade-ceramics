import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const TileForm = ({ tile, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'GP',
    size: '',
    series: '',
    material: '',
    surface: 'Matt',
    qty: 0,
    proposedSP: 0,
    category: 'Natural Stone Look',
    application: [],
    peiRating: 'Class 4',
    thickness: '9mm',
    finish: 'Unglazed Matt',
    image: '',
    images: [],
    searchTerms: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE = API_BASE_URL;

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Initialize form data
  useEffect(() => {
    if (tile) {
      setFormData({
        ...tile,
        application: Array.isArray(tile.application) ? tile.application : [],
        images: Array.isArray(tile.images) ? tile.images : []
      });
    }
  }, [tile]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'application') {
        const updatedApplications = checked
          ? [...formData.application, value]
          : formData.application.filter(app => app !== value);
        setFormData(prev => ({ ...prev, application: updatedApplications }));
      }
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image URL changes
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  // Add new image field
  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  // Remove image field
  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.series.trim()) newErrors.series = 'Series is required';
    if (!formData.material.trim()) newErrors.material = 'Material is required';
    if (!formData.size.trim()) newErrors.size = 'Size is required';
    if (formData.qty < 0) newErrors.qty = 'Quantity cannot be negative';
    if (formData.proposedSP <= 0) newErrors.proposedSP = 'Price must be greater than 0';
    if (formData.application.length === 0) newErrors.application = 'At least one application is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== '')
      };

      const url = tile 
        ? `${API_BASE}/tiles/${tile.id}`
        : `${API_BASE}/tiles`;
      
      const method = tile ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        if (errorData.details) {
          // Handle validation errors from server
          const serverErrors = {};
          errorData.details.forEach(error => {
            serverErrors[error.path[0]] = error.message;
          });
          setErrors(serverErrors);
        } else {
          alert(errorData.message || 'Failed to save tile');
        }
      }
    } catch (error) {
      console.error('Error saving tile:', error);
      alert('Error saving tile');
    } finally {
      setLoading(false);
    }
  };

  // Application options
  const applicationOptions = [
    'Floor', 'Wall', 'Commercial', 'Residential', 'Outdoor', 'Pool Area', 
    'Backsplash', 'Bathroom', 'Kitchen', 'Living Room'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {tile ? 'Edit Tile' : 'Add New Tile'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              >
                <option value="GP">GP</option>
                <option value="CERAMICS">CERAMICS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size *
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., SL60X120TH9"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent ${
                  errors.size ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Series *
              </label>
              <input
                type="text"
                name="series"
                value={formData.series}
                onChange={handleChange}
                placeholder="e.g., CALACATTA GOLD"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent ${
                  errors.series ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.series && <p className="mt-1 text-sm text-red-600">{errors.series}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material *
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="e.g., B12GCTAG-WHE.M0X5R"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent ${
                  errors.material ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.material && <p className="mt-1 text-sm text-red-600">{errors.material}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface
              </label>
              <select
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              >
                <option value="Matt">Matt</option>
                <option value="Glossy">Glossy</option>
                <option value="Satin">Satin</option>
                <option value="Textured">Textured</option>
                <option value="Polished">Polished</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              >
                <option value="Natural Stone Look">Natural Stone Look</option>
                <option value="Traditional Format">Traditional Format</option>
                <option value="Modern Design">Modern Design</option>
                <option value="Wood Look">Wood Look</option>
                <option value="Geometric Pattern">Geometric Pattern</option>
              </select>
            </div>

            {/* Inventory & Pricing */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory & Pricing</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent ${
                  errors.qty ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.qty && <p className="mt-1 text-sm text-red-600">{errors.qty}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposed Price ($) *
              </label>
              <input
                type="number"
                name="proposedSP"
                value={formData.proposedSP}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent ${
                  errors.proposedSP ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.proposedSP && <p className="mt-1 text-sm text-red-600">{errors.proposedSP}</p>}
            </div>

            {/* Technical Specifications */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PEI Rating
              </label>
              <select
                name="peiRating"
                value={formData.peiRating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              >
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thickness
              </label>
              <input
                type="text"
                name="thickness"
                value={formData.thickness}
                onChange={handleChange}
                placeholder="e.g., 9mm"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finish
              </label>
              <input
                type="text"
                name="finish"
                value={formData.finish}
                onChange={handleChange}
                placeholder="e.g., Unglazed Matt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Terms
              </label>
              <input
                type="text"
                name="searchTerms"
                value={formData.searchTerms}
                onChange={handleChange}
                placeholder="e.g., premium natural stone ceramic"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              />
            </div>

            {/* Applications */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Applications *
                {errors.application && <span className="text-red-600 text-sm ml-2">{errors.application}</span>}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {applicationOptions.map(app => (
                  <label key={app} className="flex items-center">
                    <input
                      type="checkbox"
                      name="application"
                      value={app}
                      checked={formData.application.includes(app)}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-cascade-600 focus:ring-cascade-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{app}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image Path
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="/images/tile_name.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use file paths like "/images/tile_name.png" or full URLs
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="/images/tile_name_variant.png"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center text-cascade-600 hover:text-cascade-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Image
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Detailed description of the tile..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cascade-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-cascade-600 text-white rounded-lg hover:bg-cascade-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {tile ? 'Update Tile' : 'Create Tile'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TileForm;
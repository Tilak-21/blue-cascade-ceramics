import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export const useTiles = () => {
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all tiles without authentication (public endpoint)
      const response = await fetch(`${API_BASE_URL}/tiles?limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Transform the data to match the frontend format
        const transformedTiles = result.data.map(tile => ({
          ...tile,
          // Ensure application is an array
          application: Array.isArray(tile.application) ? tile.application : [],
          // Convert numeric fields
          qty: parseInt(tile.qty) || 0,
          proposedSP: parseFloat(tile.proposedSP) || 0
        }));
        
        setTiles(transformedTiles);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Failed to fetch tiles:', err);
      setError(err.message);
      
      // Fallback to hardcoded data if API fails
      try {
        const { tileInventoryData } = await import('../data/tileData');
        setTiles(tileInventoryData);
        console.warn('Using fallback hardcoded data due to API error');
      } catch (fallbackError) {
        console.error('Failed to load fallback data:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiles();
  }, []);

  return {
    tiles,
    loading,
    error,
    refetch: fetchTiles
  };
};

// Helper function to get unique values from tiles data
export const getUniqueValues = (data, key) => {
  if (!data || data.length === 0) return [];
  
  if (key === 'application') {
    return [...new Set(data.flatMap(item => 
      Array.isArray(item.application) ? item.application : []
    ))].sort();
  }
  
  return [...new Set(data.map(item => item[key]).filter(Boolean))].sort();
};
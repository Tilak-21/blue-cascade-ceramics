import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from '../../App';
import ErrorBoundary from '../ErrorBoundary';

// Mock the data
jest.mock('../../data/tileData', () => ({
  tileInventoryData: [
    {
      series: 'Test Series 1',
      material: 'Test Material 1',
      size: '60X60',
      type: 'GP',
      surface: 'Matt',
      peiRating: 'Class 4',
      category: 'Test Category',
      application: ['Floor', 'Wall'],
      qty: 1000
    },
    {
      series: 'Test Series 2',
      material: 'Test Material 2',
      size: '30X30',
      type: 'CERAMICS',
      surface: 'Glossy',
      peiRating: 'Class 3',
      category: 'Test Category 2',
      application: ['Wall'],
      qty: 500
    }
  ],
  getUniqueValues: jest.fn((data, field) => {
    if (!data || !Array.isArray(data)) return [];
    const values = data.map(item => {
      if (field === 'application' && Array.isArray(item[field])) {
        return item[field];
      }
      return item[field];
    }).flat();
    return [...new Set(values)].filter(Boolean);
  })
}));

const AppWithProviders = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </HelmetProvider>
);

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<AppWithProviders />);
    expect(screen.getByText('TileCraft Premium')).toBeInTheDocument();
  });

  test('displays correct number of products', async () => {
    render(<AppWithProviders />);
    
    await waitFor(() => {
      expect(screen.getByText('2 Premium Products Available')).toBeInTheDocument();
    });
  });

  test('search functionality works', async () => {
    render(<AppWithProviders />);
    
    const searchInput = screen.getByPlaceholderText(/search by series/i);
    
    fireEvent.change(searchInput, { target: { value: 'Test Series 1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
    });
  });

  test('filter by material type works', async () => {
    render(<AppWithProviders />);
    
    const materialSelect = screen.getByLabelText(/filter by material type/i);
    
    fireEvent.change(materialSelect, { target: { value: 'GP' } });
    
    await waitFor(() => {
      expect(screen.getByText('1 Premium Products Available')).toBeInTheDocument();
    });
  });

  test('view mode toggle works', async () => {
    render(<AppWithProviders />);
    
    const listViewButton = screen.getByLabelText('List view');
    
    fireEvent.click(listViewButton);
    
    // Should switch to list view
    expect(listViewButton).toHaveClass('bg-stone-800');
  });

  test('advanced filters toggle works', async () => {
    render(<AppWithProviders />);
    
    const advancedFiltersButton = screen.getByText('Advanced Filters');
    
    fireEvent.click(advancedFiltersButton);
    
    await waitFor(() => {
      expect(screen.getByText('Surface Finish')).toBeInTheDocument();
    });
  });

  test('reset filters functionality works', async () => {
    render(<AppWithProviders />);
    
    // Apply a filter first
    const materialSelect = screen.getByLabelText(/filter by material type/i);
    fireEvent.change(materialSelect, { target: { value: 'GP' } });
    
    await waitFor(() => {
      expect(screen.getByText('1 Premium Products Available')).toBeInTheDocument();
    });
    
    // Reset filters
    const resetButton = screen.getByText('Reset All Filters');
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(screen.getByText('2 Premium Products Available')).toBeInTheDocument();
    });
  });

  test('no results message appears when no products match', async () => {
    render(<AppWithProviders />);
    
    const searchInput = screen.getByPlaceholderText(/search by series/i);
    
    fireEvent.change(searchInput, { target: { value: 'NonexistentProduct' } });
    
    await waitFor(() => {
      expect(screen.getByText('No products match your criteria')).toBeInTheDocument();
    });
  });

  test('calculates total inventory correctly', async () => {
    render(<AppWithProviders />);
    
    await waitFor(() => {
      expect(screen.getByText('Total inventory: 1,500 m²')).toBeInTheDocument();
    });
  });

  test('renders header and footer', () => {
    render(<AppWithProviders />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
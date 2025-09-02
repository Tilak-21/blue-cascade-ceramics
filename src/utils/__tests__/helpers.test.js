import {
  formatTileSize,
  getCategoryColor,
  getPEIColor,
  getMaterialTypeColor,
  getMaterialTypeName,
  formatNumber,
  calculateTotalInventory,
  getPEIDescription,
  debounce,
  getTileImage
} from '../helpers';

describe('Helper Functions', () => {
  describe('formatTileSize', () => {
    test('formats GP tiles correctly', () => {
      expect(formatTileSize('GP60X60')).toBe('60 × 60 cm');
      expect(formatTileSize('GP30X90')).toBe('30 × 90 cm');
    });

    test('formats SL tiles correctly', () => {
      expect(formatTileSize('SL20X120TH9')).toBe('20 × 120 cm');
      expect(formatTileSize('SL15X60CUT')).toBe('15 × 60 cm');
    });

    test('formats regular tiles correctly', () => {
      expect(formatTileSize('RB25X50')).toBe('25 × 50 cm');
      expect(formatTileSize('WB30X30')).toBe('30 × 30 cm');
    });
  });

  describe('getCategoryColor', () => {
    test('returns correct colors for known categories', () => {
      expect(getCategoryColor('Volume Commercial')).toBe('bg-slate-100 text-slate-800');
      expect(getCategoryColor('Luxury Collection')).toBe('bg-yellow-100 text-yellow-800');
    });

    test('returns default color for unknown categories', () => {
      expect(getCategoryColor('Unknown Category')).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('getPEIColor', () => {
    test('returns correct colors for PEI ratings', () => {
      expect(getPEIColor('Class 1')).toBe('bg-blue-50 text-blue-700');
      expect(getPEIColor('Class 5')).toBe('bg-red-50 text-red-700');
    });

    test('returns default color for unknown ratings', () => {
      expect(getPEIColor('Unknown')).toBe('bg-gray-50 text-gray-700');
    });
  });

  describe('getMaterialTypeColor', () => {
    test('returns correct colors for material types', () => {
      expect(getMaterialTypeColor('CERAMICS')).toBe('bg-amber-100 text-amber-800');
      expect(getMaterialTypeColor('GP')).toBe('bg-stone-100 text-stone-800');
    });
  });

  describe('getMaterialTypeName', () => {
    test('returns correct names for material types', () => {
      expect(getMaterialTypeName('GP')).toBe('Porcelain');
      expect(getMaterialTypeName('CERAMICS')).toBe('Ceramic');
    });
  });

  describe('formatNumber', () => {
    test('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('calculateTotalInventory', () => {
    test('calculates total inventory correctly', () => {
      const data = [
        { qty: 100 },
        { qty: 200 },
        { qty: 300 }
      ];
      expect(calculateTotalInventory(data)).toBe(600);
    });

    test('handles empty data', () => {
      expect(calculateTotalInventory([])).toBe(0);
    });
  });

  describe('getPEIDescription', () => {
    test('returns correct descriptions for PEI ratings', () => {
      expect(getPEIDescription('Class 1')).toBe('Wall use only - No foot traffic');
      expect(getPEIDescription('Class 5')).toBe('Heavy to extra-heavy traffic - Commercial and industrial applications');
    });

    test('returns default description for unknown ratings', () => {
      expect(getPEIDescription('Unknown')).toBe('Standard durability rating');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers('legacy');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalled();
    });

    test('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTileImage', () => {
    test('returns special mapping for known series and materials', () => {
      expect(getTileImage('Tech Marble', 'A12GTCMB-BTV.X0X5P')).toBe('/images/tech_marble_A12GTCMB-BTV.X0X5P.png');
    });

    test('returns default image for known series', () => {
      expect(getTileImage('Mistrey')).toBe('/images/mistrey.png');
    });

    test('returns null for unknown series', () => {
      expect(getTileImage('Unknown Series')).toBeNull();
    });
  });
});
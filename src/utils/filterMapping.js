// Professional filter mappings to eliminate redundancy and improve UX

export const SURFACE_FINISH_MAPPING = {
  // Matt variations → Matte
  'Matt': 'Matte',
  'Unglazed Matt': 'Matte', 
  'Matt - 13mm': 'Matte',
  'Matt - Punch': 'Matte',
  
  // Decorative Matt → Textured Matte
  'Matt Décor': 'Textured Matte',
  'Décor - Matt': 'Textured Matte',
  'Décor Matt': 'Textured Matte',
  
  // Glossy variations → Glossy
  'Glossy': 'Glossy',
  'Glossy Beveled': 'Glossy',
  'Polished Glazed': 'Glossy',
  
  // Decorative Glossy → Textured Glossy
  'Glossy Décor': 'Textured Glossy',
  'Décor Glossy': 'Textured Glossy', 
  'Line Décor - Glossy': 'Textured Glossy',
  
  // Polished → Polished
  'Unglazed Polished': 'Polished',
  
  // Textured → Textured
  'Textured': 'Textured'
};

export const APPLICATION_MAPPING = {
  // Consolidate similar applications
  'Floor': ['Residential Floor', 'Commercial Floor'],
  'Wall': ['Residential Wall', 'Commercial Wall'],
  'Commercial': ['Commercial Floor', 'Commercial Wall'],
  'Residential': ['Residential Floor', 'Residential Wall'],
  'High Traffic': ['Commercial Floor'],
  'Luxury Residential': ['Luxury Applications'],
  'Feature': ['Feature & Accent'],
  'Backsplash': ['Feature & Accent'],
  'Exterior': ['Exterior Applications']
};

export const CATEGORY_MAPPING = {
  // Natural Stone groupings
  'Natural Stone Look': 'Natural Stone Look',
  'Marble Look': 'Natural Stone Look',
  
  // Engineered products
  'Engineered Stone': 'Engineered Stone',
  
  // Wood-inspired
  'Wood Look': 'Wood Look',
  
  // Industrial/Modern
  'Concrete Look': 'Concrete & Industrial',
  'Industrial Grade': 'Concrete & Industrial',
  'Heavy Duty': 'Concrete & Industrial',
  
  // Format-based
  'Large Format': 'Large Format',
  'Large Format Ceramic': 'Large Format',
  'Traditional Format': 'Traditional Sizes',
  
  // Commercial volume
  'Volume Commercial': 'Volume Commercial',
  'Volume Residential': 'Volume Commercial',
  
  // Luxury/Premium
  'Luxury Collection': 'Luxury Collection',
  
  // Decorative/Specialty
  'Decorative Collection': 'Decorative & Specialty',
  'Decorative Wall': 'Decorative & Specialty',
  'Designer Wall': 'Decorative & Specialty',
  'Textured Collection': 'Decorative & Specialty',
  'Urban Collection': 'Decorative & Specialty',
  'Brick Look': 'Decorative & Specialty'
};

// Professional filter options for SearchFilters component
export const REFINED_FILTER_OPTIONS = {
  surfaceFinishes: [
    'Matte',
    'Glossy', 
    'Polished',
    'Textured Matte',
    'Textured Glossy',
    'Textured'
  ],
  
  applications: [
    'Residential Floor',
    'Residential Wall', 
    'Commercial Floor',
    'Commercial Wall',
    'Luxury Applications',
    'Feature & Accent',
    'Exterior Applications'
  ],
  
  categories: [
    'Natural Stone Look',
    'Engineered Stone',
    'Wood Look',
    'Concrete & Industrial',
    'Large Format',
    'Traditional Sizes',
    'Volume Commercial',
    'Luxury Collection',
    'Decorative & Specialty'
  ]
};

// Utility functions for data processing
export const mapSurfaceFinish = (originalSurface) => {
  return SURFACE_FINISH_MAPPING[originalSurface] || originalSurface;
};

export const mapApplications = (originalApplications) => {
  const mappedApplications = new Set();
  
  originalApplications.forEach(app => {
    const mappedValues = APPLICATION_MAPPING[app];
    if (mappedValues) {
      mappedValues.forEach(mapped => mappedApplications.add(mapped));
    } else {
      // Handle unmapped applications by trying to categorize them
      if (app.toLowerCase().includes('floor')) {
        mappedApplications.add('Residential Floor');
      } else if (app.toLowerCase().includes('wall')) {
        mappedApplications.add('Residential Wall');
      } else {
        mappedApplications.add(app);
      }
    }
  });
  
  return Array.from(mappedApplications);
};

export const mapCategory = (originalCategory) => {
  return CATEGORY_MAPPING[originalCategory] || originalCategory;
};

// Process tile data to use refined categories
export const processRefinedTileData = (rawTileData) => {
  return rawTileData.map(tile => ({
    ...tile,
    refinedSurface: mapSurfaceFinish(tile.surface),
    refinedApplications: mapApplications(tile.application),
    refinedCategory: mapCategory(tile.category),
    // Keep original data for reference
    originalSurface: tile.surface,
    originalApplications: tile.application,
    originalCategory: tile.category
  }));
};

// Get unique refined values for filters
export const getUniqueRefinedValues = (processedData, field) => {
  const values = new Set();
  
  processedData.forEach(item => {
    if (field === 'refinedApplications') {
      item[field].forEach(app => values.add(app));
    } else {
      values.add(item[field]);
    }
  });
  
  return Array.from(values).sort();
};
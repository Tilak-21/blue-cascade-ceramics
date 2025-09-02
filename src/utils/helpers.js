export const formatTileSize = (size) => {
  if (size.includes('GP')) {
    return size.replace('GP', '').replace('X', ' × ') + ' cm';
  }
  if (size.includes('SL')) {
    const cleanSize = size.replace('SL', '').replace('TH9', '').replace('CUT', '');
    return cleanSize.replace('X', ' × ') + ' cm';
  }
  return size.replace('RB', '').replace('WB', '').replace('RBTH13', '').replace('X', ' × ') + ' cm';
};

export const getCategoryColor = (category) => {
  const colorMap = {
    'Volume Commercial': 'bg-slate-100 text-slate-800',
    'Volume Residential': 'bg-emerald-100 text-emerald-800',
    'Natural Stone Look': 'bg-amber-100 text-amber-800',
    'Large Format Ceramic': 'bg-orange-100 text-orange-800',
    'Large Format': 'bg-orange-100 text-orange-800',
    'Engineered Stone': 'bg-purple-100 text-purple-800',
    'Luxury Collection': 'bg-yellow-100 text-yellow-800',
    'Industrial Grade': 'bg-red-100 text-red-800',
    'Wood Look': 'bg-green-100 text-green-800',
    'Brick Look': 'bg-rose-100 text-rose-800',
    'Concrete Look': 'bg-gray-100 text-gray-800',
    'Textured Collection': 'bg-indigo-100 text-indigo-800',
    'Decorative Wall': 'bg-pink-100 text-pink-800',
    'Decorative Collection': 'bg-pink-100 text-pink-800',
    'Designer Wall': 'bg-violet-100 text-violet-800',
    'Traditional Format': 'bg-blue-100 text-blue-800',
    'Marble Look': 'bg-stone-100 text-stone-800',
    'Urban Collection': 'bg-cyan-100 text-cyan-800',
    'Heavy Duty': 'bg-zinc-100 text-zinc-800'
  };
  return colorMap[category] || 'bg-gray-100 text-gray-800';
};

export const getPEIColor = (peiRating) => {
  const colorMap = {
    'Class 1': 'bg-blue-50 text-blue-700',
    'Class 2': 'bg-green-50 text-green-700',
    'Class 3': 'bg-yellow-50 text-yellow-700',
    'Class 4': 'bg-orange-50 text-orange-700',
    'Class 5': 'bg-red-50 text-red-700'
  };
  return colorMap[peiRating] || 'bg-gray-50 text-gray-700';
};

export const getMaterialTypeColor = (type) => {
  return type === 'CERAMICS' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-800';
};

export const getMaterialTypeName = (type) => {
  return type === 'GP' ? 'Porcelain' : 'Ceramic';
};

export const formatNumber = (num) => {
  return num.toLocaleString();
};

export const calculateTotalInventory = (data) => {
  return data.reduce((total, item) => total + item.qty, 0);
};

export const getPEIDescription = (peiRating) => {
  const descriptions = {
    'Class 1': 'Wall use only - No foot traffic',
    'Class 2': 'Light residential traffic - Bathroom floors',
    'Class 3': 'Light to moderate residential traffic - Most home applications',
    'Class 4': 'Moderate to heavy traffic - Commercial and residential floors',
    'Class 5': 'Heavy to extra-heavy traffic - Commercial and industrial applications'
  };
  return descriptions[peiRating] || 'Standard durability rating';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getTileImage = (series, material, qty) => {
  const seriesName = series.toLowerCase().replace(/\s+/g, '_');
  
  // Special cases with material codes or quantities to differentiate
  const specialMappings = {
    'tech_marble': {
      'A12GTCMB-BTV.X0X5P': 'tech_marble_A12GTCMB-BTV.X0X5P.png',
      'A12GTCMB-SRT.X0X5P': 'tech_marble_A12GTCMB-SRT.X0X5P.png',
      'A05GTCMB-PSB.O0X0P': 'tech_marble_A12GTCMB-WST.O0X5P.png'
    },
    'pietra_piasentina': {
      '10974': 'pietra_piasentina_10974m2.png',
      '7930': 'pietra_piasentina_7930m2.png'
    },
    'opificio': {
      'A93GOPFC-BEE.A6X5R': 'opificio_A93GOPFC-BEE.A6X5R.png'
    },
    'metropol': {
      'A48RZNUM-IV0.HDR': 'numero.png'
    }
  };

  // Check for special mappings first
  if (specialMappings[seriesName]) {
    const specialMapping = specialMappings[seriesName];
    
    if (material && specialMapping[material]) {
      return `/images/${specialMapping[material]}`;
    }
    
    if (qty && specialMapping[qty.toString()]) {
      return `/images/${specialMapping[qty.toString()]}`;
    }
  }

  // For now, return a placeholder or null since we don't have actual images
  // This prevents 404 errors in the console
  
  // Generate a consistent placeholder based on series name (for future use)
  // const defaultImage = `${seriesName.toLowerCase().replace(/\s+/g, '_')}.png`;
  
  // Since we don't have physical images yet, we'll use a data URL placeholder
  // or return null to let the component handle the fallback
  
  // You can uncomment this when you have actual images:
  // const availableImages = ['mistrey.png', 'bassano.png', /* other images */];
  // if (availableImages.includes(defaultImage)) {
  //   return `/images/${defaultImage}`;
  // }

  // Return null to trigger fallback handling in components
  return null;
};
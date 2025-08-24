# TileCraft Premium - Ceramic & Porcelain Tile Showcase

A professional, mobile-first React application for showcasing premium ceramic and porcelain tile inventory to US market buyers.

## 🏗️ Features

### Core Functionality
- **Advanced Product Filtering**: Filter by material type, surface finish, PEI rating, and application
- **Dual View Modes**: Grid view for visual browsing, list view for detailed comparison
- **Real-time Search**: Search across product series, materials, categories, and sizes
- **Professional Categorization**: Industry-standard tile classifications and PEI ratings
- **Mobile-First Design**: Optimized for mobile devices with responsive layouts

### Industry Standards
- **PEI Classification**: Proper durability ratings (Class 1-5) based on traffic requirements
- **Surface Finishes**: Accurate categorization of glazed/unglazed, matt/polished finishes
- **Material Types**: Clear distinction between ceramic and porcelain tiles
- **Professional Applications**: Commercial, residential, and specialized use cases

### Technical Features
- **React 18**: Latest React with functional components and hooks
- **Tailwind CSS**: Utility-first styling with professional color palette
- **Lucide Icons**: Modern, consistent iconography
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Performance Optimized**: Efficient filtering with useMemo hooks

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
cascade-tiles/
├── public/
│   ├── index.html              # Main HTML template
│   ├── manifest.json           # PWA manifest
│   └── favicon.ico            # Application favicon
├── src/
│   ├── components/
│   │   ├── TileCard.js        # Individual tile product card
│   │   ├── TileListItem.js    # List view tile component
│   │   ├── Header.js          # Application header with branding
│   │   ├── SearchFilters.js   # Search and filter components
│   │   └── Footer.js          # Footer with contact information
│   ├── data/
│   │   └── tileData.js        # Product inventory data
│   ├── utils/
│   │   ├── helpers.js         # Utility functions
│   │   └── constants.js       # Application constants
│   ├── styles/
│   │   └── index.css          # Global styles and Tailwind imports
│   ├── App.js                 # Main application component
│   └── index.js               # Application entry point
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## 🛠️ Customization

### Adding New Tiles
Edit `src/data/tileData.js` to add new products:

```javascript
{
  type: 'GP', // 'GP' for Porcelain, 'CERAMICS' for Ceramic
  size: 'GP60X60',
  series: 'YOUR_SERIES_NAME',
  material: 'MATERIAL_CODE',
  surface: 'Matt', // Surface finish
  qty: 10000, // Quantity in m²
  proposedSP: 25, // Price per m²
  category: 'Natural Stone Look', // Product category
  application: ['Floor', 'Wall'], // Use cases
  peiRating: 'Class 4', // Durability rating
  thickness: '10mm', // Tile thickness
  finish: 'Glazed Matt' // Detailed finish description
}
```

## 📄 License

This project is licensed under the MIT License.

---

**Built for the ceramic tile industry**
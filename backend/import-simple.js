// Simple import script - directly import the data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Your original tile data (copied from tileData.js)
const tileInventoryData = [
  {
    type: 'GP',
    size: 'SL60X120TH9',
    series: 'CALACATTA GOLD',
    material: 'B12GCTAG-WHE.M0X5R',
    surface: 'Matt',
    qty: 19763,
    proposedSP: 20,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall', 'Commercial'],
    peiRating: 'Class 4',
    thickness: '9mm',
    finish: 'Unglazed Matt',
    image: '/images/calacatta_gold.png'
  },
  {
    type: 'GP',
    size: 'SL60X120TH9',
    series: 'STARK STONE',
    material: 'B12GSRKS-OWH.M0X5R',
    surface: 'Matt',
    qty: 10308,
    proposedSP: 20,
    category: 'Natural Stone Look',
    application: ['Floor', 'Wall', 'Commercial'],
    peiRating: 'Class 4',
    thickness: '9mm',
    finish: 'Unglazed Matt',
    image: '/images/stark_stone.png'
  },
  // I'll add just a few samples first to test, then we can import all 40
  {
    type: 'GP',
    size: 'SL60X120TH9',
    series: 'TECH MARBLE',
    material: 'A12GTCMB-BTV.X0X5P',
    surface: 'Unglazed Polished',
    qty: 8302,
    proposedSP: 40,
    category: 'Engineered Stone',
    application: ['Floor', 'Wall', 'Luxury Residential'],
    peiRating: 'Class 5',
    thickness: '9mm',
    finish: 'Unglazed Polished',
    image: '/images/tech_marble_A12GTCMB-BTV.X0X5P.png'
  },
];

async function importTiles() {
  try {
    console.log('🚀 Starting simplified import...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.tile.deleteMany();

    // Import tiles
    let importCount = 0;
    for (const tile of tileInventoryData) {
      await prisma.tile.create({
        data: {
          type: tile.type,
          size: tile.size,
          series: tile.series,
          material: tile.material,
          surface: tile.surface,
          qty: tile.qty,
          proposedSP: tile.proposedSP,
          category: tile.category,
          application: JSON.stringify(tile.application),
          peiRating: tile.peiRating,
          thickness: tile.thickness,
          finish: tile.finish,
          image: tile.image,
          searchTerms: `${tile.series} ${tile.material} ${tile.category}`.toLowerCase(),
          description: `${tile.series} - ${tile.category} tile`,
          isActive: true,
        },
      });
      importCount++;
    }

    const totalInventory = tileInventoryData.reduce((sum, tile) => sum + tile.qty, 0);
    console.log(`✅ Imported ${importCount} tiles`);
    console.log(`📊 Total inventory: ${totalInventory.toLocaleString()} units`);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'IMPORT',
        entity: 'TILE',
        entityId: 'sample-import',
        adminId: null,
        changes: JSON.stringify({ importCount, totalInventory }),
      },
    });

    console.log('🎉 Import completed!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importTiles();
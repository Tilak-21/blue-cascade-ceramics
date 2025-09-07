// Database Seeding Script - Migrate existing data to new backend
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Import existing tile data
const importExistingTileData = async () => {
  try {
    // Read existing tile data from frontend
    const tileDataPath = path.join(__dirname, '../../src/data/tileData.js');
    
    // Since we can't directly import ES modules here, we'll manually create the data
    // This is a sample of your existing data structure - you'll need to copy your actual data
    const sampleTileData = [
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
      // Add more tiles here...
    ];

    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.auditLog.deleteMany();
    await prisma.tile.deleteMany();
    
    console.log('🧹 Cleared existing data');

    // Seed tiles
    let seedCount = 0;
    for (const tileData of sampleTileData) {
      await prisma.tile.create({
        data: {
          ...tileData,
          application: JSON.stringify(tileData.application),
          isActive: true,
        },
      });
      seedCount++;
    }

    console.log(`✅ Seeded ${seedCount} tiles successfully`);
    
    // Create initial audit log
    await prisma.auditLog.create({
      data: {
        action: 'SEED',
        entity: 'TILE',
        entityId: 'bulk',
        adminId: null,
        changes: JSON.stringify({ seedCount }),
      },
    });

    console.log('📝 Created initial audit log');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

// Custom seed function for manual data entry
const seedCustomData = async () => {
  try {
    console.log('🌱 Starting custom data seeding...');

    // Sample custom tiles - replace with your actual data
    const customTiles = [
      {
        type: 'GP',
        size: 'GP60X60',
        series: 'BLUE CASCADE PREMIUM',
        material: 'BCP001-NAT.M0X3L',
        surface: 'Matte',
        qty: 5000,
        proposedSP: 35.50,
        category: 'Natural Stone Look',
        application: JSON.stringify(['Floor', 'Wall', 'Commercial', 'Residential']),
        peiRating: 'Class 4',
        thickness: '10mm',
        finish: 'Unglazed Matt',
        image: '/images/blue_cascade_premium.png',
        searchTerms: 'premium natural stone ceramic',
        description: 'Premium natural stone look porcelain tile with superior durability',
        isActive: true,
      },
      {
        type: 'CERAMICS',
        size: 'CE30X30',
        series: 'PACIFIC COLLECTION',
        material: 'PC001-BLU.G2X2S',
        surface: 'Glossy',
        qty: 2500,
        proposedSP: 18.75,
        category: 'Traditional Format',
        application: JSON.stringify(['Wall', 'Backsplash', 'Residential']),
        peiRating: 'Class 3',
        thickness: '8mm',
        finish: 'Glazed',
        image: '/images/pacific_collection.png',
        searchTerms: 'traditional ceramic wall tile',
        description: 'Classic ceramic wall tile perfect for residential applications',
        isActive: true,
      },
      // Add more custom tiles as needed
    ];

    // Clear existing data
    await prisma.auditLog.deleteMany();
    await prisma.tile.deleteMany();

    // Seed custom tiles
    for (const tile of customTiles) {
      await prisma.tile.create({ data: tile });
    }

    console.log(`✅ Seeded ${customTiles.length} custom tiles successfully`);

  } catch (error) {
    console.error('❌ Custom seeding error:', error);
    throw error;
  }
};

// Main seeding function
async function main() {
  const args = process.argv.slice(2);
  const seedType = args[0] || 'custom';

  try {
    if (seedType === 'import') {
      await importExistingTileData();
    } else {
      await seedCustomData();
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

export { importExistingTileData, seedCustomData };
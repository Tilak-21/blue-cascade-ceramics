// Import real tile data from frontend to backend database
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importRealTileData() {
  try {
    console.log('🚀 Starting import of real tile data...');

    // Read the original tile data file
    const tileDataPath = path.join(__dirname, '../src/data/tileData.js');
    const fileContent = await fs.readFile(tileDataPath, 'utf8');
    
    // Extract the data array using regex (since we can't directly import ES modules here)
    const dataMatch = fileContent.match(/export const tileInventoryData = (\[[\s\S]*?\]);/);
    if (!dataMatch) {
      throw new Error('Could not parse tileInventoryData from file');
    }
    
    // Clean up the JavaScript and convert to JSON
    let dataString = dataMatch[1];
    // Replace single quotes with double quotes for JSON
    dataString = dataString.replace(/'/g, '"');
    // Fix trailing commas
    dataString = dataString.replace(/,(\s*[}\]])/g, '$1');
    
    const tileData = JSON.parse(dataString);
    
    console.log(`📊 Found ${tileData.length} tiles in original data`);

    // Clear existing data first
    console.log('🧹 Clearing existing database data...');
    await prisma.auditLog.deleteMany();
    await prisma.tile.deleteMany();

    // Import all tiles
    let importCount = 0;
    for (const tile of tileData) {
      try {
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
            images: tile.images ? JSON.stringify(tile.images) : null,
            searchTerms: `${tile.series} ${tile.material} ${tile.category} ${tile.surface}`.toLowerCase(),
            description: `${tile.series} - ${tile.category} tile with ${tile.surface} surface finish`,
            isActive: true,
          },
        });
        importCount++;
        
        if (importCount % 10 === 0) {
          console.log(`  ✅ Imported ${importCount}/${tileData.length} tiles...`);
        }
      } catch (error) {
        console.error(`❌ Error importing tile ${tile.series}:`, error.message);
      }
    }

    console.log(`✅ Successfully imported ${importCount} tiles!`);

    // Calculate total inventory
    const totalInventory = tileData.reduce((sum, tile) => sum + tile.qty, 0);
    const totalValue = tileData.reduce((sum, tile) => sum + (tile.qty * tile.proposedSP), 0);

    console.log(`📊 Total Inventory: ${totalInventory.toLocaleString()} units`);
    console.log(`💰 Total Value: $${totalValue.toLocaleString()}`);

    // Create audit log for the import
    await prisma.auditLog.create({
      data: {
        action: 'BULK_IMPORT',
        entity: 'TILE',
        entityId: 'real-data-import',
        adminId: null,
        changes: JSON.stringify({
          importCount,
          totalInventory,
          totalValue,
          source: 'tileData.js'
        }),
      },
    });

    console.log('📝 Created audit log entry');
    console.log('🎉 Real data import completed successfully!');

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

// Run the import
async function main() {
  try {
    await importRealTileData();
  } catch (error) {
    console.error('💥 Import process failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
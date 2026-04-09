/**
 * Migration Script: PartnerProfile Schema Cleanup
 * 
 * Responsibilities:
 * 1. Remove deprecated fields: destinations, budgetRange, startingPrice
 * 2. Ensure no data loss for required fields
 * 3. Add derived minRoomPrice field for optimization (optional)
 * 
 * Constraints:
 * - Idempotent (safe to run multiple times)
 * - Uses bulkWrite for performance
 * - Logs all operations clearly
 */

import mongoose from 'mongoose';
import PartnerProfile from '../models/PartnerProfile';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DEPRECATED_FIELDS = ['destinations', 'budgetRange', 'startingPrice'];

interface MigrationStats {
  totalDocuments: number;
  modifiedDocuments: number;
  fieldsRemoved: Record<string, number>;
  minRoomPriceAdded: number;
  errors: string[];
}

/**
 * Calculate minimum room price from roomTypes array
 */
const calculateMinRoomPrice = (roomTypes: Array<{ name: string; price: number }>): number | null => {
  if (!roomTypes || roomTypes.length === 0) return null;
  return Math.min(...roomTypes.map(room => room.price));
};

/**
 * Main migration function
 */
const runMigration = async (): Promise<MigrationStats> => {
  const stats: MigrationStats = {
    totalDocuments: 0,
    modifiedDocuments: 0,
    fieldsRemoved: {},
    minRoomPriceAdded: 0,
    errors: [],
  };

  // Initialize field counters
  DEPRECATED_FIELDS.forEach(field => {
    stats.fieldsRemoved[field] = 0;
  });

  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/voyagegen';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get total count
    stats.totalDocuments = await PartnerProfile.countDocuments();
    console.log(`📊 Total PartnerProfile documents: ${stats.totalDocuments}`);

    // Check if migration is needed by finding documents with deprecated fields
    const query = {
      $or: [
        { destinations: { $exists: true } },
        { budgetRange: { $exists: true } },
        { startingPrice: { $exists: true } },
      ],
    };

    const documentsNeedingMigration = await PartnerProfile.countDocuments(query);
    console.log(`📋 Documents with deprecated fields: ${documentsNeedingMigration}`);

    if (documentsNeedingMigration === 0) {
      console.log('✨ No migration needed. All documents are already clean.');
      return stats;
    }

    // Perform migration using bulkWrite for efficiency
    const cursor = PartnerProfile.find(query).cursor();
    const bulkOps: any[] = [];

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const updateOp: any = {
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $unset: {},
          },
        },
      };

      let needsUpdate = false;

      // Check and mark deprecated fields for removal
      const docAny = doc as any;
      DEPRECATED_FIELDS.forEach(field => {
        if (docAny[field] !== undefined) {
          updateOp.updateOne.update.$unset[field] = '';
          stats.fieldsRemoved[field]++;
          needsUpdate = true;
        }
      });

      // Add minRoomPrice for optimization (optional but recommended)
      if (doc.roomTypes && doc.roomTypes.length > 0) {
        const minPrice = calculateMinRoomPrice(doc.roomTypes);
        if (minPrice !== null) {
          // Only add if not already present or if it needs updating
          if (!docAny.minRoomPrice || docAny.minRoomPrice !== minPrice) {
            if (!updateOp.updateOne.update.$set) {
              updateOp.updateOne.update.$set = {};
            }
            updateOp.updateOne.update.$set.minRoomPrice = minPrice;
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        bulkOps.push(updateOp);
        stats.modifiedDocuments++;
      }

      // Execute in batches of 100
      if (bulkOps.length >= 100) {
        try {
          await PartnerProfile.bulkWrite(bulkOps, { ordered: false });
          console.log(`🔄 Processed batch of ${bulkOps.length} documents`);
        } catch (error: any) {
          console.error('❌ Batch error:', error.message);
          stats.errors.push(`Batch error: ${error.message}`);
        }
        bulkOps.length = 0;
      }
    }

    // Process remaining documents
    if (bulkOps.length > 0) {
      try {
        await PartnerProfile.bulkWrite(bulkOps, { ordered: false });
        console.log(`🔄 Processed final batch of ${bulkOps.length} documents`);
      } catch (error: any) {
        console.error('❌ Final batch error:', error.message);
        stats.errors.push(`Final batch error: ${error.message}`);
      }
    }

    // Count documents with minRoomPrice
    stats.minRoomPriceAdded = await PartnerProfile.countDocuments({ minRoomPrice: { $exists: true } });

    console.log('\n📈 Migration Summary:');
    console.log(`   Total documents processed: ${stats.totalDocuments}`);
    console.log(`   Documents modified: ${stats.modifiedDocuments}`);
    console.log('   Fields removed:');
    Object.entries(stats.fieldsRemoved).forEach(([field, count]) => {
      console.log(`     - ${field}: ${count}`);
    });
    console.log(`   Documents with minRoomPrice: ${stats.minRoomPriceAdded}`);
    
    if (stats.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`);
      stats.errors.forEach(err => console.log(`   - ${err}`));
    }

    return stats;
  } catch (error: any) {
    console.error('💥 Migration failed:', error.message);
    stats.errors.push(`Fatal error: ${error.message}`);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

/**
 * Rollback function (if needed)
 * Note: This can only restore data if backup exists
 */
const rollbackMigration = async (): Promise<void> => {
  console.log('⚠️  Rollback not implemented. Please restore from backup if needed.');
  console.log('   To rollback manually, restore the following fields from backup:');
  console.log('   - destinations, budgetRange, startingPrice');
};

// Execute migration if run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const isRollback = args.includes('--rollback');

  if (isRollback) {
    rollbackMigration().catch(console.error);
  } else {
    runMigration()
      .then(stats => {
        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
      })
      .catch(error => {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
      });
  }
}

export { runMigration, rollbackMigration };

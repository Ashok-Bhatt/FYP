import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const BATCH_SIZE = 50;
const USER_MAPPING_FILE = path.join(__dirname, '../mappings/user_map.json');
const REQUIREMENT_MAPPING_FILE = path.join(__dirname, '../mappings/requirement_map.json');
const QUOTE_MAPPING_FILE = path.join(__dirname, '../mappings/quote_map.json');

// Import Mongoose models
import Quote from '../../models/Quote';

async function migrateQuotes() {
    console.log('Starting Quote migration...');

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voyagegen');
        console.log('Connected to MongoDB');

        // Load ID mappings
        if (!fs.existsSync(USER_MAPPING_FILE)) {
            throw new Error('User mapping file not found! Run migrateUsers.ts first.');
        }
        if (!fs.existsSync(REQUIREMENT_MAPPING_FILE)) {
            throw new Error('Requirement mapping file not found! Run migrateRequirements.ts first.');
        }

        const userIdMap: Record<string, number> = JSON.parse(fs.readFileSync(USER_MAPPING_FILE, 'utf-8'));
        const requirementIdMap: Record<string, number> = JSON.parse(fs.readFileSync(REQUIREMENT_MAPPING_FILE, 'utf-8'));

        const quoteIdMap: Record<string, number> = {};
        let skip = 0;
        let totalMigrated = 0;

        while (true) {
            const quotes = await Quote.find().skip(skip).limit(BATCH_SIZE).lean();

            if (quotes.length === 0) break;

            for (const quote of quotes) {
                try {
                    const newRequirementId = requirementIdMap[quote.requirementId.toString()];
                    const newPartnerId = userIdMap[quote.partnerId.toString()];
                    const newAgentId = userIdMap[quote.agentId.toString()];

                    if (!newRequirementId || !newPartnerId || !newAgentId) {
                        console.warn(`Missing mapping for quote ${quote._id}`);
                        continue;
                    }

                    // Create quote in Postgres
                    const newQuote = await prisma.quote.create({
                        data: {
                            requirementId: newRequirementId,
                            partnerId: newPartnerId,
                            agentId: newAgentId,
                            title: quote.title || null,
                            costs: quote.costs || null,
                            status: quote.status as any,
                            // Normalized sections
                            hotels: quote.sections?.hotels && quote.sections.hotels.length > 0
                                ? {
                                    create: quote.sections.hotels.map((hotel: any) => ({
                                        name: hotel.name,
                                        city: hotel.city,
                                        roomType: hotel.roomType,
                                        nights: hotel.nights,
                                        unitPrice: hotel.unitPrice,
                                        qty: hotel.qty,
                                        total: hotel.total,
                                    }))
                                }
                                : undefined,
                            transport: quote.sections?.transport && quote.sections.transport.length > 0
                                ? {
                                    create: quote.sections.transport.map((trans: any) => ({
                                        type: trans.type,
                                        days: trans.days,
                                        unitPrice: trans.unitPrice,
                                        total: trans.total,
                                    }))
                                }
                                : undefined,
                            activities: quote.sections?.activities && quote.sections.activities.length > 0
                                ? {
                                    create: quote.sections.activities.map((act: any) => ({
                                        name: act.name,
                                        unitPrice: act.unitPrice,
                                        qty: act.qty,
                                        total: act.total,
                                    }))
                                }
                                : undefined,
                        },
                    });

                    // Map old MongoDB _id to new Postgres id
                    quoteIdMap[quote._id.toString()] = newQuote.id;
                    totalMigrated++;

                    console.log(`Migrated quote: ${quote.title || quote._id} (${totalMigrated})`);
                } catch (error: any) {
                    console.error(`Error migrating quote ${quote._id}:`, error.message);
                }
            }

            skip += BATCH_SIZE;

            // Save mapping periodically
            fs.writeFileSync(QUOTE_MAPPING_FILE, JSON.stringify(quoteIdMap, null, 2));
        }

        console.log(`\nQuote migration complete! Total migrated: ${totalMigrated}`);
        console.log(`Mapping saved to: ${QUOTE_MAPPING_FILE}`);

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        await prisma.$disconnect();
    }
}

// Run migration
migrateQuotes()
    .then(() => {
        console.log('Migration script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration script failed:', error);
        process.exit(1);
    });

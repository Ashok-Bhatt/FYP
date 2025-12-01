import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const BATCH_SIZE = 50;
const USER_MAPPING_FILE = path.join(__dirname, '../mappings/user_map.json');
const PARTNER_MAPPING_FILE = path.join(__dirname, '../mappings/partner_map.json');

// Import Mongoose models
import PartnerProfile from '../../models/PartnerProfile';

async function migratePartners() {
    console.log('Starting Partner migration...');

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voyagegen');
        console.log('Connected to MongoDB');

        // Load user ID mapping
        if (!fs.existsSync(USER_MAPPING_FILE)) {
            throw new Error('User mapping file not found! Run migrateUsers.ts first.');
        }
        const userIdMap: Record<string, number> = JSON.parse(fs.readFileSync(USER_MAPPING_FILE, 'utf-8'));

        const partnerIdMap: Record<string, number> = {};
        let skip = 0;
        let totalMigrated = 0;

        while (true) {
            const partners = await PartnerProfile.find().skip(skip).limit(BATCH_SIZE).lean();

            if (partners.length === 0) break;

            for (const partner of partners) {
                try {
                    const newUserId = userIdMap[partner.userId.toString()];
                    if (!newUserId) {
                        console.warn(`User ID not found for partner: ${partner.companyName}`);
                        continue;
                    }

                    // Collect unique amenities for upsert
                    const amenityNames = partner.amenities || [];
                    const amenityIds: number[] = [];

                    for (const amenityName of amenityNames) {
                        const amenity = await prisma.amenity.upsert({
                            where: { name: amenityName },
                            create: { name: amenityName },
                            update: {},
                        });
                        amenityIds.push(amenity.id);
                    }

                    // Create partner profile in Postgres
                    const newPartner = await prisma.partnerProfile.create({
                        data: {
                            userId: newUserId,
                            companyName: partner.companyName,
                            type: partner.type as any,
                            budgetMin: partner.budgetRange?.min || null,
                            budgetMax: partner.budgetRange?.max || null,
                            rating: partner.rating || 4.5,
                            tripsHandled: partner.tripsHandled || 0,
                            description: partner.description || null,
                            startingPrice: partner.startingPrice || null,
                            reviews: partner.reviews || 0,
                            // Normalized relations
                            destinations: partner.destinations && partner.destinations.length > 0
                                ? { create: partner.destinations.map((dest: string) => ({ name: dest })) }
                                : undefined,
                            specializations: partner.specializations && partner.specializations.length > 0
                                ? { create: partner.specializations.map((spec: string) => ({ name: spec })) }
                                : undefined,
                            images: partner.images && partner.images.length > 0
                                ? { create: partner.images.map((url: string) => ({ url })) }
                                : undefined,
                            amenities: amenityIds.length > 0
                                ? { create: amenityIds.map(amenityId => ({ amenityId })) }
                                : undefined,
                            sightSeeing: partner.sightSeeing && partner.sightSeeing.length > 0
                                ? { create: partner.sightSeeing.map((sight: string) => ({ name: sight })) }
                                : undefined,
                        },
                    });

                    // Map old MongoDB _id to new Postgres id
                    partnerIdMap[partner._id.toString()] = newPartner.id;
                    totalMigrated++;

                    console.log(`Migrated partner: ${partner.companyName} (${totalMigrated})`);
                } catch (error: any) {
                    console.error(`Error migrating partner ${partner.companyName}:`, error.message);
                }
            }

            skip += BATCH_SIZE;

            // Save mapping periodically
            fs.writeFileSync(PARTNER_MAPPING_FILE, JSON.stringify(partnerIdMap, null, 2));
        }

        console.log(`\nPartner migration complete! Total migrated: ${totalMigrated}`);
        console.log(`Mapping saved to: ${PARTNER_MAPPING_FILE}`);

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        await prisma.$disconnect();
    }
}

// Run migration
migratePartners()
    .then(() => {
        console.log('Migration script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration script failed:', error);
        process.exit(1);
    });

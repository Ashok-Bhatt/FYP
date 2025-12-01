import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const BATCH_SIZE = 100;
const REQUIREMENT_MAPPING_FILE = path.join(__dirname, '../mappings/requirement_map.json');

// Import Mongoose models
import Requirement from '../../models/Requirement';

async function migrateRequirements() {
    console.log('Starting Requirement migration...');

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voyagegen');
        console.log('Connected to MongoDB');

        const requirementIdMap: Record<string, number> = {};
        let skip = 0;
        let totalMigrated = 0;

        while (true) {
            const requirements = await Requirement.find().skip(skip).limit(BATCH_SIZE).lean();

            if (requirements.length === 0) break;

            for (const req of requirements) {
                try {
                    // Create or find contact
                    let contactId: number | null = null;
                    if (req.contactInfo) {
                        const contact = await prisma.contact.create({
                            data: {
                                name: req.contactInfo.name,
                                email: req.contactInfo.email,
                                phone: req.contactInfo.phone,
                                whatsapp: req.contactInfo.whatsapp || null,
                            },
                        });
                        contactId = contact.id;
                    }

                    // Create requirement in Postgres
                    const newRequirement = await prisma.requirement.create({
                        data: {
                            destination: req.destination,
                            tripType: req.tripType,
                            budget: req.budget,
                            startDate: req.startDate ? new Date(req.startDate) : null,
                            duration: req.duration || null,
                            adults: req.pax?.adults || 1,
                            children: req.pax?.children || 0,
                            hotelStar: req.hotelStar || null,
                            status: req.status as any,
                            contactId: contactId,
                            // Normalized preferences
                            preferences: req.preferences && req.preferences.length > 0
                                ? { create: req.preferences.map((pref: string) => ({ name: pref })) }
                                : undefined,
                        },
                    });

                    // Map old MongoDB _id to new Postgres id
                    requirementIdMap[req._id.toString()] = newRequirement.id;
                    totalMigrated++;

                    console.log(`Migrated requirement: ${req.destination} - ${req.tripType} (${totalMigrated})`);
                } catch (error: any) {
                    console.error(`Error migrating requirement ${req._id}:`, error.message);
                }
            }

            skip += BATCH_SIZE;

            // Save mapping periodically
            fs.writeFileSync(REQUIREMENT_MAPPING_FILE, JSON.stringify(requirementIdMap, null, 2));
        }

        console.log(`\nRequirement migration complete! Total migrated: ${totalMigrated}`);
        console.log(`Mapping saved to: ${REQUIREMENT_MAPPING_FILE}`);

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        await prisma.$disconnect();
    }
}

// Run migration
migrateRequirements()
    .then(() => {
        console.log('Migration script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration script failed:', error);
        process.exit(1);
    });

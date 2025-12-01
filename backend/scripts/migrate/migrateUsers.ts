import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const BATCH_SIZE = 100;
const MAPPING_FILE = path.join(__dirname, '../mappings/user_map.json');

// Import Mongoose User model
import User from '../../models/User';

async function migrateUsers() {
    console.log('Starting User migration...');

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voyagegen');
        console.log('Connected to MongoDB');

        const idMap: Record<string, number> = {};
        let skip = 0;
        let totalMigrated = 0;

        while (true) {
            const users = await User.find().skip(skip).limit(BATCH_SIZE).lean();

            if (users.length === 0) break;

            for (const user of users) {
                try {
                    // Create user in Postgres
                    const newUser = await prisma.user.create({
                        data: {
                            email: user.email,
                            password: user.password,
                            name: user.name,
                            role: user.role as any,
                            companyName: user.companyName || null,
                            // Handle destinations array
                            destinations: user.destinations && user.destinations.length > 0
                                ? {
                                    create: user.destinations.map((dest: string) => ({ city: dest }))
                                }
                                : undefined,
                        },
                    });

                    // Map old MongoDB _id to new Postgres id
                    idMap[user._id.toString()] = newUser.id;
                    totalMigrated++;

                    console.log(`Migrated user: ${user.email} (${totalMigrated})`);
                } catch (error: any) {
                    console.error(`Error migrating user ${user.email}:`, error.message);
                }
            }

            skip += BATCH_SIZE;

            // Save mapping periodically
            fs.writeFileSync(MAPPING_FILE, JSON.stringify(idMap, null, 2));
        }

        console.log(`\nUser migration complete! Total migrated: ${totalMigrated}`);
        console.log(`Mapping saved to: ${MAPPING_FILE}`);

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        await prisma.$disconnect();
    }
}

// Run migration
migrateUsers()
    .then(() => {
        console.log('Migration script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration script failed:', error);
        process.exit(1);
    });

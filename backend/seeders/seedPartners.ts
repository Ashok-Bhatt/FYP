import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import PartnerProfile from '../models/PartnerProfile';
import { internationalPartners } from '../constants/partners';
import { generateEmbeddingsBatch } from '../utils/geminiUtils';
import { MONGO_URI } from '../config/env';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const seedPartners = async () => {
    try {
        // Clear existing international partners
        const intlDestinations = ["Maldives", "Paris", "France", "Bali", "Indonesia", "Dubai", "UAE", "St. Moritz", "Switzerland", "Zurich", "Lucerne", "Tokyo", "Japan", "Singapore", "Santorini", "Greece", "Bora Bora", "French Polynesia"];
        await PartnerProfile.deleteMany({ destinations: { $in: intlDestinations } });
        console.log('Cleared existing international partners');

        // Fetch bulk embeddings for all descriptions
        console.log('Generating embeddings in batch for international partners...');
        const descriptions = internationalPartners.map(p => p.description || '');
        const embeddings = await generateEmbeddingsBatch(descriptions);

        for (let i = 0; i < internationalPartners.length; i++) {
            const partnerData = internationalPartners[i];
            const email = `${partnerData.companyName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
            const password = 'partner123';
            const { ...profileData } = partnerData as any;

            // Create User
            let user = await User.findOne({ email });

            if (!user) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user = await User.create({
                    name: profileData.companyName,
                    email,
                    password: hashedPassword,
                    role: 'PARTNER',
                });
            }

            // Create Partner Profile
            await PartnerProfile.create({
                userId: user._id,
                description_embedding: embeddings[i],
                ...profileData,
            });
        }

        console.log(`Seeded ${internationalPartners.length} International Partners Successfully`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding international partners:', error);
        process.exit(1);
    }
};

seedPartners();

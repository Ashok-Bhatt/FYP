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
        // Clear existing international partners by city names
        const intlCities = ["Maldives", "Paris", "Bali", "Dubai", "Zurich", "Lucerne", "Tokyo", "Singapore", "Santorini", "Bora Bora"];
        
        // Get existing partner profiles for international cities
        const existingProfiles = await PartnerProfile.find({ 'address.city': { $in: intlCities } });
        const userIdsToDelete = existingProfiles.map(p => p.userId);
        
        // Delete partner profiles
        await PartnerProfile.deleteMany({ 'address.city': { $in: intlCities } });
        
        // Delete corresponding users
        if (userIdsToDelete.length > 0) {
            await User.deleteMany({ _id: { $in: userIdsToDelete } });
        }
        
        console.log('Cleared existing international partners and users');

        // Fetch bulk embeddings for all descriptions
        console.log('Generating embeddings in batch for international partners...');
        const descriptions = internationalPartners.map(p => p.description || '');
        const embeddings = await generateEmbeddingsBatch(descriptions);

        for (let i = 0; i < internationalPartners.length; i++) {
            const partnerData = internationalPartners[i];
            const email = `${partnerData.companyName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
            const password = 'partner123';
            const { ...profileData } = partnerData as any;

            // Create User (no need to check for existing since we just deleted them)
            const user = await User.create({
                name: profileData.companyName,
                email,
                password, // Let the User model pre-save hook handle hashing
                role: 'PARTNER',
            });

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

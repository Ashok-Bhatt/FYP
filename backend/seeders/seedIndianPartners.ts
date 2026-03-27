import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import PartnerProfile from '../models/PartnerProfile';
import { indianPartners } from '../constants/partners';
import { generateEmbeddingsBatch } from '../utils/geminiUtils';
import { MONGO_URI } from '../config/env';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const seedIndianPartners = async () => {
    try {
        // Clear existing Indian partners
        const indianDestinations = ["Delhi", "Udaipur", "Mumbai", "Bangalore", "Shimla", "Jaipur", "Goa", "Ranthambore", "Chennai", "Srinagar", "Hyderabad", "Kumarakom", "Coorg", "Rishikesh", "Jaisalmer"];
        await PartnerProfile.deleteMany({ destinations: { $in: indianDestinations } });
        console.log('Cleared existing Indian partners');

        // Fetch bulk embeddings for all descriptions
        console.log('Generating embeddings in batch...');
        const descriptions = indianPartners.map(p => p.description || '');
        const embeddings = await generateEmbeddingsBatch(descriptions);

        for (let i = 0; i < indianPartners.length; i++) {
            const partnerData = indianPartners[i];
            const { email, password, ...profileData } = partnerData as any;

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

        console.log(`Seeded ${indianPartners.length} Indian Partners Successfully`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding Indian partners:', error);
        process.exit(1);
    }
};

seedIndianPartners();

import { Request, Response } from 'express';
import PartnerProfile from '../models/PartnerProfile';
// import { PartnerHotel, PartnerTransport, PartnerActivity } from '../models/PartnerInventory';
import { handleError } from '../utils/errorHandler';
import { generateEmbedding } from '../utils/geminiUtils';
import { cosineSimilarity } from '../utils/vectorUtils';

// @desc    Get current partner profile
// @route   GET /api/partners/profile
// @access  Private (Partner)
export const getMyProfile = async (req: Request, res: Response) => {
    try {
        const profile = await PartnerProfile.findOne({ userId: req.user!._id });
        res.json(profile);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// @desc    Create or update partner profile
// @route   POST /api/partners/profile
// @access  Private (Partner)
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { 
            companyName, destinations, type, specializations, budgetRange, 
            description, images, amenities, startingPrice, reviews,
            address, starRating, roomTypes, contactInfo, activities, 
            checkIn, checkOut, sightSeeings 
        } = req.body;

        let profile = await PartnerProfile.findOne({ userId: req.user!._id });

        // Generate comprehensive embedding using all relevant fields
        let description_embedding: number[] | undefined;
        if (description || companyName || address?.city || specializations || amenities) {
            const embeddingText = [
                description || '',
                companyName || '',
                address?.city || '',
                (specializations || []).join(' '),
                (amenities || []).join(' '),
                (activities || []).map(a => a.name + ' ' + a.description).join(' '),
                (sightSeeings || []).map(s => s.name + ' ' + s.description).join(' ')
            ].filter(Boolean).join(' ');
            
            description_embedding = await generateEmbedding(embeddingText);
        }

        if (profile) {
            // Update basic fields
            if (companyName) profile.companyName = companyName;
            if (destinations) profile.destinations = destinations;
            if (type) profile.type = type;
            if (specializations) profile.specializations = specializations;
            if (budgetRange) profile.budgetRange = budgetRange;
            if (description !== undefined) {
                profile.description = description;
                if (description_embedding) profile.description_embedding = description_embedding;
                else profile.description_embedding = [];
            }
            
            // Update hotel-specific fields
            if (images) profile.images = images;
            if (amenities) profile.amenities = amenities;
            if (startingPrice) profile.startingPrice = startingPrice;
            if (reviews !== undefined) profile.reviews = reviews;
            if (address) profile.address = address;
            if (starRating) profile.starRating = starRating;
            if (roomTypes) profile.roomTypes = roomTypes;
            if (contactInfo) profile.contactInfo = contactInfo;
            if (activities) profile.activities = activities;
            if (checkIn) profile.checkIn = checkIn;
            if (checkOut) profile.checkOut = checkOut;
            if (sightSeeings) profile.sightSeeings = sightSeeings;

            await profile.save();
        } else {
            profile = await PartnerProfile.create({
                userId: req.user!._id,
                companyName,
                destinations,
                type,
                specializations,
                budgetRange,
                description,
                description_embedding: description_embedding || [],
                images,
                amenities,
                startingPrice,
                reviews: reviews || 0,
                address,
                starRating,
                roomTypes,
                contactInfo,
                activities,
                checkIn,
                checkOut,
                sightSeeings,
                rating: 0,
                tripsHandled: 0,
            });
        }

        res.json(profile);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// @desc    Filter partners (for Agents)
// @route   POST /api/partners/filter
// @access  Private (Agent)
export const filterPartners = async (req: Request, res: Response) => {
    const { destination, budget, type, hotelStar, searchQuery } = req.body;

    try {
        const query: any = {};

        // Filter by destination (search in both city and country)
        if (destination) {
            query.$or = [
                { 'address.city': { $regex: new RegExp(destination, 'i') } },
                { 'address.country': { $regex: new RegExp(destination, 'i') } }
            ];
        }

        // Filter by partner type
        if (type) {
            query.type = type;
        }

        // Filter by budget range
        if (budget) {
            const budgetNum = Number(budget);
            const budgetQuery = {
                'budgetRange.min': { $lte: budgetNum },
                'budgetRange.max': { $gte: budgetNum }
            };
            
            // If there's already a $or from destination, we need to combine them
            if (query.$or) {
                query.$and = [
                    { $or: query.$or },
                    { $or: [budgetQuery, { budgetRange: { $exists: false } }, { 'budgetRange.min': null }, { 'budgetRange.max': null }] }
                ];
                delete query.$or;
            } else {
                query.$or = [
                    budgetQuery,
                    { budgetRange: { $exists: false } },
                    { 'budgetRange.min': null },
                    { 'budgetRange.max': null }
                ];
            }
        }

        // Filter by hotel star rating
        if (hotelStar) {
            query.starRating = { $gte: Number(hotelStar) };
        }

        let partners = await PartnerProfile.find(query).populate('userId', 'name email');

        // Apply semantic search if search query is provided
        if (searchQuery && typeof searchQuery === 'string') {
            const queryEmbedding = await generateEmbedding(searchQuery);

            if (queryEmbedding && queryEmbedding.length > 0) {
                const partnersWithScores = partners.map(partner => {
                    const embedding = partner.description_embedding || [];
                    const score = cosineSimilarity(queryEmbedding, embedding);
                    return { partner, score };
                });

                partnersWithScores.sort((a, b) => b.score - a.score);
                partners = partnersWithScores.map(pw => pw.partner);
            }
        }

        res.json(partners);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

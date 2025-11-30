import { Request, Response } from 'express';
import PartnerProfile from '../models/PartnerProfile';
import { PartnerHotel, PartnerTransport, PartnerActivity } from '../models/PartnerInventory';
import { handleError } from '../utils/errorHandler';

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
        const { companyName, destinations, type, specializations, budgetRange } = req.body;

        let profile = await PartnerProfile.findOne({ userId: req.user!._id });

        if (profile) {
            if (companyName) profile.companyName = companyName;
            if (destinations) profile.destinations = destinations;
            if (type) profile.type = type;
            if (specializations) profile.specializations = specializations;
            if (budgetRange) profile.budgetRange = budgetRange;

            await profile.save();
        } else {
            profile = await PartnerProfile.create({
                userId: req.user!._id,
                companyName,
                destinations,
                type,
                specializations,
                budgetRange,
                rating: 0,
                tripsHandled: 0,
                reviews: 0,
            });
        }

        res.json(profile);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// @desc    Add inventory item
// @route   POST /api/partners/inventory/:type
// @access  Private (Partner)
export const addInventory = async (req: Request, res: Response) => {
    const { type } = req.params; // hotel, transport, activity
    const data = { ...req.body, partnerId: req.user!._id };

    try {
        let item;
        if (type === 'hotel') {
            item = await PartnerHotel.create(data);
        } else if (type === 'transport') {
            item = await PartnerTransport.create(data);
        } else if (type === 'activity') {
            item = await PartnerActivity.create(data);
        } else {
            res.status(400).json({ message: 'Invalid inventory type' });
            return;
        }
        res.status(201).json(item);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// @desc    Filter partners (for Agents)
// @route   POST /api/partners/filter
// @access  Private (Agent)
export const filterPartners = async (req: Request, res: Response) => {
    const { destination, budget, type, hotelStar } = req.body;

    try {
        const query: any = {};

        if (destination) {
            query.destinations = { $in: [destination] };
        }
        if (type) {
            query.type = type;
        }

        if (budget) {
            const budgetNum = Number(budget);
            query.$or = [
                {
                    'budgetRange.min': { $lte: budgetNum },
                    'budgetRange.max': { $gte: budgetNum }
                },
                { budgetRange: { $exists: false } },
                { 'budgetRange.min': null },
                { 'budgetRange.max': null }
            ];
        }

        if (hotelStar) {
            query.rating = { $gte: Number(hotelStar) };
        }

        const partners = await PartnerProfile.find(query).populate('userId', 'name email');
        res.json(partners);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

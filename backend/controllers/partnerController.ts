import { Request, Response } from 'express';
import { partnerRepo, inventoryRepo } from '../db';
import prisma from '../db';
import { handleError } from '../utils/errorHandler';

// @desc    Get current partner profile
// @route   GET /api/partners/profile
// @access  Private (Partner)
export const getMyProfile = async (req: Request, res: Response) => {
    try {
        const profile = await partnerRepo.findByUserId(req.user!.id);
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

        const existingProfile = await partnerRepo.findByUserId(req.user!.id);

        if (existingProfile) {
            // Update existing profile
            const updated = await prisma.partnerProfile.update({
                where: { id: existingProfile.id },
                data: {
                    companyName: companyName || existingProfile.companyName,
                    type: type || existingProfile.type,
                    budgetMin: budgetRange?.min ?? existingProfile.budgetMin,
                    budgetMax: budgetRange?.max ?? existingProfile.budgetMax,
                    // Update destinations if provided
                    ...(destinations && {
                        destinations: {
                            deleteMany: {},
                            create: destinations.map((dest: string) => ({ name: dest })),
                        },
                    }),
                    // Update specializations if provided
                    ...(specializations && {
                        specializations: {
                            deleteMany: {},
                            create: specializations.map((spec: string) => ({ name: spec })),
                        },
                    }),
                },
                include: {
                    destinations: true,
                    specializations: true,
                },
            });
            res.json(updated);
        } else {
            // Create new profile
            const profile = await partnerRepo.create({
                user: { connect: { id: req.user!.id } },
                companyName,
                type: type || 'DMC',
                budgetMin: budgetRange?.min || null,
                budgetMax: budgetRange?.max || null,
                rating: 4.5,
                tripsHandled: 0,
                reviews: 0,
                destinations: destinations && destinations.length > 0
                    ? { create: destinations.map((dest: string) => ({ name: dest })) }
                    : undefined,
                specializations: specializations && specializations.length > 0
                    ? { create: specializations.map((spec: string) => ({ name: spec })) }
                    : undefined,
            });
            res.json(profile);
        }
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// @desc    Add inventory item
// @route   POST /api/partners/inventory/:type
// @access  Private (Partner)
export const addInventory = async (req: Request, res: Response) => {
    const { type } = req.params; // hotel, transport, activity
    const data = { ...req.body, partnerId: req.user!.id };

    try {
        let item;
        if (type === 'hotel') {
            const { name, city, starRating, amenities, roomTypes, photos } = data;
            item = await inventoryRepo.createHotel({
                partner: { connect: { id: req.user!.id } },
                name,
                city,
                starRating: starRating || null,
                amenities: amenities && amenities.length > 0
                    ? { create: amenities.map((a: string) => ({ name: a })) }
                    : undefined,
                roomTypes: roomTypes && roomTypes.length > 0
                    ? {
                        create: roomTypes.map((rt: any) => ({
                            name: rt.name,
                            price: rt.price,
                            maxOccupancy: rt.maxOccupancy,
                        }))
                    }
                    : undefined,
                photos: photos && photos.length > 0
                    ? { create: photos.map((url: string) => ({ url })) }
                    : undefined,
            });
        } else if (type === 'transport') {
            const { type: transportType, price, maxPax, city } = data;
            item = await inventoryRepo.createTransport({
                partner: { connect: { id: req.user!.id } },
                type: transportType,
                price,
                maxPax,
                city,
            });
        } else if (type === 'activity') {
            const { name, city, price, description } = data;
            item = await inventoryRepo.createActivity({
                partner: { connect: { id: req.user!.id } },
                name,
                city,
                price,
                description: description || null,
            });
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
        const where: any = {};

        if (destination) {
            where.destinations = {
                some: {
                    name: {
                        contains: destination,
                        mode: 'insensitive',
                    },
                },
            };
        }

        if (type) {
            where.type = type;
        }

        if (budget) {
            const budgetNum = Number(budget);
            where.OR = [
                {
                    AND: [
                        { budgetMin: { lte: budgetNum } },
                        { budgetMax: { gte: budgetNum } },
                    ],
                },
                { budgetMin: null },
                { budgetMax: null },
            ];
        }

        if (hotelStar) {
            where.rating = { gte: Number(hotelStar) };
        }

        const partners = await prisma.partnerProfile.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                destinations: true,
            },
        });

        res.json(partners);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

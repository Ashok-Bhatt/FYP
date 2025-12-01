import { Request, Response } from 'express';
import { quoteRepo, requirementRepo } from '../db';
import prisma from '../db';
import { handleError } from '../utils/errorHandler';

// @desc    Auto-generate quotes for selected partners
// @route   POST /api/quotes/generate
// @access  Private (Agent)
export const generateQuotes = async (req: Request, res: Response) => {
    const { requirementId, partnerIds } = req.body;

    try {
        const requirement = await requirementRepo.findById(parseInt(requirementId));
        if (!requirement) {
            res.status(404).json({ message: 'Requirement not found' });
            return;
        }

        const quotes: any[] = [];

        for (const partnerId of partnerIds) {
            // Fetch partner profile
            const partner = await prisma.partnerProfile.findFirst({
                where: { userId: parseInt(partnerId) },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    destinations: true,
                    sightSeeing: true,
                },
            });

            if (!partner) continue;

            let netCost = 0;
            const duration = requirement.duration || 6;
            const adults = requirement.adults || 2;

            const hotelData: any[] = [];
            const transportData: any[] = [];
            const activityData: any[] = [];

            // 1. Add Hotel based on partner's starting price
            if (partner.type === 'Hotel' || partner.type === 'DMC' || partner.type === 'Mixed') {
                const hotelPrice = partner.startingPrice || 5000;
                const nights = duration - 1;
                const roomCost = hotelPrice * nights;

                hotelData.push({
                    name: partner.companyName,
                    city: partner.destinations?.[0]?.name || requirement.destination || '',
                    roomType: 'Deluxe Room',
                    nights: nights,
                    unitPrice: hotelPrice,
                    qty: 1,
                    total: roomCost,
                });
                netCost += roomCost;
            }

            // 2. Add Transport
            if (partner.type === 'CabProvider' || partner.type === 'DMC' || partner.type === 'Mixed') {
                const transportPrice = 3000; // Default per day
                const days = duration;
                const transportCost = transportPrice * days;

                transportData.push({
                    type: 'Private Sedan',
                    days: days,
                    unitPrice: transportPrice,
                    total: transportCost,
                });
                netCost += transportCost;
            }

            // 3. Add Activities based on sightseeing
            if (partner.sightSeeing && partner.sightSeeing.length > 0) {
                const activitiesToAdd = partner.sightSeeing.slice(0, 3);
                activitiesToAdd.forEach((sight, index) => {
                    const activityPrice = 1500 + (index * 500);
                    const activityCost = activityPrice * adults;

                    activityData.push({
                        name: sight.name,
                        unitPrice: activityPrice,
                        qty: adults,
                        total: activityCost,
                    });
                    netCost += activityCost;
                });
            }

            // Create Quote Record
            const quote = await quoteRepo.create({
                requirement: { connect: { id: parseInt(requirementId) } },
                partner: { connect: { id: partner.userId } },
                agent: { connect: { id: req.user!.id } },
                title: `${requirement.destination} Trip - ${requirement.tripType}`,
                costs: {
                    net: netCost,
                    margin: 10,
                    final: netCost * 1.1,
                    perHead: (netCost * 1.1) / adults,
                },
                status: 'DRAFT',
                hotels: hotelData.length > 0 ? { create: hotelData } : undefined,
                transport: transportData.length > 0 ? { create: transportData } : undefined,
                activities: activityData.length > 0 ? { create: activityData } : undefined,
            });

            quotes.push(quote);
        }

        // Update Requirement Status to QUOTES_READY
        await requirementRepo.updateStatus(parseInt(requirementId), 'QUOTES_READY');

        res.status(201).json(quotes);
    } catch (error: unknown) {
        handleError(res, error, 'Quote generation error');
    }
};

// @desc    Get all quotes for agent
// @route   GET /api/quotes
// @access  Private (Agent)
export const getQuotes = async (req: Request, res: Response) => {
    try {
        const quotes = await prisma.quote.findMany({
            include: {
                requirement: {
                    select: {
                        id: true,
                        destination: true,
                        tripType: true,
                        budget: true,
                        startDate: true,
                        duration: true,
                    },
                },
                agent: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                hotels: true,
                transport: true,
                activities: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(quotes);
    } catch (error: unknown) {
        handleError(res, error, 'Error fetching quotes');
    }
};

// @desc    Get quotes for a requirement
// @route   GET /api/quotes/requirement/:id
// @access  Private (Agent)
export const getQuotesByRequirement = async (req: Request, res: Response) => {
    try {
        const quotes = await quoteRepo.findByRequirementId(parseInt(req.params.id));
        res.json(quotes);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// @desc    Get quote by ID
// @route   GET /api/quotes/:id
// @access  Private (Agent)
export const getQuoteById = async (req: Request, res: Response) => {
    try {
        const quote = await quoteRepo.findById(parseInt(req.params.id));
        if (quote) {
            res.json(quote);
        } else {
            res.status(404).json({ message: 'Quote not found' });
        }
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// @desc    Update a quote (Editor)
// @route   PUT /api/quotes/:id
// @access  Private (Agent)
export const updateQuote = async (req: Request, res: Response) => {
    try {
        const { sections, costs, status } = req.body;
        const quoteId = parseInt(req.params.id);

        const updateData: any = {};
        if (costs) updateData.costs = costs;
        if (status) updateData.status = status;

        // Update sections if provided
        if (sections) {
            if (sections.hotels) {
                updateData.hotels = {
                    deleteMany: {},
                    create: sections.hotels,
                };
            }
            if (sections.transport) {
                updateData.transport = {
                    deleteMany: {},
                    create: sections.transport,
                };
            }
            if (sections.activities) {
                updateData.activities = {
                    deleteMany: {},
                    create: sections.activities,
                };
            }
        }

        const quote = await prisma.quote.update({
            where: { id: quoteId },
            data: updateData,
            include: {
                hotels: true,
                transport: true,
                activities: true,
            },
        });

        res.json(quote);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// @desc    Delete a quote
// @route   DELETE /api/quotes/:id
// @access  Private (Agent)
export const deleteQuote = async (req: Request, res: Response) => {
    try {
        await prisma.quote.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Quote deleted successfully' });
    } catch (error: unknown) {
        handleError(res, error, 'Error deleting quote');
    }
};

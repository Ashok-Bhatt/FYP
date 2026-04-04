import { Request, Response } from 'express';
import PartnerProfile from '../models/PartnerProfile';
import Quote from '../models/Quote';
import QuoteView from '../models/QuoteView';
// import { PartnerHotel, PartnerTransport, PartnerActivity } from '../models/PartnerInventory';
import { handleError } from '../utils/errorHandler';
import { generateEmbedding } from '../utils/geminiUtils';
import { cosineSimilarity } from '../utils/vectorUtils';
import { uploadBase64Image } from '../utils/cloudinary';

// @desc    Get current partner profile
// @route   GET /api/partners/profile
// @access  Private (Partner)
export const getMyProfile = async (req: Request, res: Response) => {
    try {
        const profile = await PartnerProfile.find({ userId: req.user!._id });
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

        let profile = null;
        if (req.body._id) {
            profile = await PartnerProfile.findOne({ _id: req.body._id, userId: req.user!._id });
        }

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

// @desc    Get partner dashboard stats
// @route   GET /api/partners/dashboard
// @access  Private (Partner)
export const getPartnerDashboard = async (req: Request, res: Response) => {
    try {
        const partnerId = req.user!._id;
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

        // Main aggregation pipeline
        const statsPipeline = [
            { $match: { partnerId } },
            {
                $facet: {
                    totalStats: [
                        {
                            $group: {
                                _id: null,
                                totalQuotes: { $sum: 1 },
                                acceptedQuotes: {
                                    $sum: { $cond: [{ $eq: ['$status', 'ACCEPTED'] }, 1, 0] }
                                },
                                totalRevenue: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ['$status', 'ACCEPTED'] },
                                            '$costs.net',
                                            0
                                        ]
                                    }
                                },
                                totalViews: { $sum: '$viewCount' },
                                avgQuoteValue: { $avg: '$costs.net' }
                            }
                        }
                    ],
                    statusBreakdown: [
                        {
                            $group: {
                                _id: '$status',
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    monthlyTrend: [
                        { $match: { createdAt: { $gte: sixMonthsAgo } } },
                        {
                            $group: {
                                _id: {
                                    year: { $year: '$createdAt' },
                                    month: { $month: '$createdAt' }
                                },
                                quotes: { $sum: 1 },
                                revenue: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ['$status', 'ACCEPTED'] },
                                            '$costs.net',
                                            0
                                        ]
                                    }
                                }
                            }
                        },
                        { $sort: { '_id.year': -1, '_id.month': -1 } },
                        { $limit: 6 }
                    ],
                    recentActivity: [
                        { $sort: { updatedAt: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                quoteId: '$_id',
                                title: 1,
                                status: 1,
                                amount: '$costs.net',
                                updatedAt: 1,
                                action: {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: ['$status', 'ACCEPTED'] }, then: 'accepted' },
                                            { case: { $eq: ['$status', 'DECLINED'] }, then: 'declined' },
                                            { case: { $gt: ['$viewCount', 0] }, then: 'viewed' }
                                        ],
                                        default: 'created'
                                    }
                                }
                            }
                        }
                    ],
                    mostViewed: [
                        { $sort: { viewCount: -1 } },
                        { $limit: 1 },
                        {
                            $project: {
                                quoteId: '$_id',
                                title: 1,
                                viewCount: 1,
                                status: 1,
                                amount: '$costs.net'
                            }
                        }
                    ],
                    topDestination: [
                        {
                            $group: {
                                _id: '$title',
                                quoteCount: { $sum: 1 },
                                acceptedCount: {
                                    $sum: { $cond: [{ $eq: ['$status', 'ACCEPTED'] }, 1, 0] }
                                },
                                totalRevenue: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ['$status', 'ACCEPTED'] },
                                            '$costs.net',
                                            0
                                        ]
                                    }
                                },
                                totalViews: { $sum: '$viewCount' }
                            }
                        },
                        { $sort: { acceptedCount: -1, totalRevenue: -1 } },
                        { $limit: 1 }
                    ]
                }
            }
        ];

        const [result] = await Quote.aggregate(statsPipeline);

        // Format status breakdown
        const statusMap: Record<string, number> = {
            DRAFT: 0,
            READY: 0,
            SENT_TO_USER: 0,
            ACCEPTED: 0,
            DECLINED: 0
        };
        result.statusBreakdown.forEach((item: { _id: string; count: number }) => {
            statusMap[item._id] = item.count;
        });

        const stats = result.totalStats[0] || {
            totalQuotes: 0,
            acceptedQuotes: 0,
            totalRevenue: 0,
            totalViews: 0,
            avgQuoteValue: 0
        };

        // Format monthly trend
        const monthlyTrend = result.monthlyTrend.map((item: any) => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            quotes: item.quotes,
            revenue: item.revenue || 0
        })).reverse();

        // Generate action suggestions based on data
        const suggestions: string[] = [];
        
        // Suggestion 1: High views but not accepted
        if (stats.totalQuotes > 0) {
            const quotes = await Quote.find({ partnerId }).lean();
            const highViewNotAccepted = quotes.find(q => 
                (q.viewCount || 0) > 5 && 
                q.status !== 'ACCEPTED' && 
                q.status !== 'DECLINED'
            );
            if (highViewNotAccepted) {
                suggestions.push(`"${highViewNotAccepted.title}" has ${highViewNotAccepted.viewCount} views but not accepted. Consider reducing price by 10-15%.`);
            }

            // Suggestion 2: Low engagement quotes
            const noViewQuotes = quotes.filter(q => (q.viewCount || 0) === 0).length;
            if (noViewQuotes > 0) {
                suggestions.push(`${noViewQuotes} quote(s) have no views. Share quotes with agents or improve descriptions.`);
            }
        }

        // Suggestion 3: Conversion rate tip
        if (stats.totalQuotes > 0 && (stats.acceptedQuotes / stats.totalQuotes) < 0.3) {
            suggestions.push('Your conversion rate is below 30%. Review pricing or add more compelling inclusions.');
        }

        // Suggestion 4: Top destination tip
        const topDest = result.topDestination[0];
        if (topDest && topDest._id) {
            suggestions.push(`"${topDest._id}" is your top performer. Consider creating similar packages.`);
        }

        res.json({
            stats: {
                totalQuotes: stats.totalQuotes,
                acceptedQuotes: stats.acceptedQuotes,
                conversionRate: stats.totalQuotes > 0
                    ? Math.round((stats.acceptedQuotes / stats.totalQuotes) * 100 * 10) / 10
                    : 0,
                totalRevenue: Math.round(stats.totalRevenue || 0),
                averageQuoteValue: Math.round(stats.avgQuoteValue || 0),
                totalViews: stats.totalViews || 0
            },
            statusBreakdown: statusMap,
            recentActivity: result.recentActivity || [],
            monthlyTrend,
            mostViewedQuote: result.mostViewed[0] || null,
            topDestination: result.topDestination[0] ? {
                title: result.topDestination[0]._id,
                quoteCount: result.topDestination[0].quoteCount,
                acceptedCount: result.topDestination[0].acceptedCount,
                revenue: result.topDestination[0].totalRevenue,
                views: result.topDestination[0].totalViews
            } : null,
            suggestions
        });
    } catch (error: unknown) {
        handleError(res, error, 'Error fetching dashboard stats');
    }
};

// @desc    Get partner's quotes feed
// @route   GET /api/partners/quotes
// @access  Private (Partner)
export const getPartnerQuotes = async (req: Request, res: Response) => {
    try {
        const partnerId = req.user!._id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status as string;

        // Build query
        const query: any = { partnerId };
        if (status && ['DRAFT', 'READY', 'SENT_TO_USER', 'ACCEPTED', 'DECLINED'].includes(status)) {
            query.status = status;
        }

        // Get total count
        const total = await Quote.countDocuments(query);

        // Get quotes with requirement details - sorted by last viewed (desc), then by value (desc)
        const quotes = await Quote.find(query)
            .populate({
                path: 'requirementId',
                select: 'destination tripType duration pax startDate budget',
                options: { lean: true }
            })
            .sort({ 
                lastViewedAt: -1,  // Recently viewed first
                'costs.final': -1, // Then highest value
                createdAt: -1      // Then newest
            })
            .skip(skip)
            .limit(limit)
            .lean();

        // Transform quotes for response with engagement levels
        const transformedQuotes = quotes.map(quote => {
            const req = quote.requirementId as any;
            const viewCount = quote.viewCount || 0;
            
            // Calculate engagement level
            let engagementLevel: 'High' | 'Medium' | 'Low' = 'Low';
            if (viewCount >= 10) {
                engagementLevel = 'High';
            } else if (viewCount >= 3) {
                engagementLevel = 'Medium';
            }

            return {
                _id: quote._id,
                title: quote.title || `${req?.destination || 'Trip'} - ${req?.tripType || 'Travel'}`,
                status: quote.status,
                costs: {
                    final: quote.costs?.net || quote.costs?.final || 0,
                    perHead: quote.costs?.net && req?.pax 
                        ? quote.costs.net / ((req.pax.adults || 1) + (req.pax.children || 0))
                        : (quote.costs?.perHead || 0)
                },
                viewCount: viewCount,
                lastViewedAt: quote.lastViewedAt || null,
                createdAt: quote.createdAt,
                updatedAt: quote.updatedAt,
                engagementLevel,
                requirement: req ? {
                    destination: req.destination,
                    tripType: req.tripType,
                    duration: req.duration,
                    pax: req.pax,
                    budget: req.budget
                } : null,
                shareUrl: quote.shareToken
                    ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/quote/${quote.shareToken}`
                    : null
            };
        });

        res.json({
            quotes: transformedQuotes,
            pagination: {
                total,
                page,
                limit,
                hasMore: skip + transformedQuotes.length < total
            }
        });
    } catch (error: unknown) {
        handleError(res, error, 'Error fetching quotes');
    }
};

// @desc    Add partner image (hotel or sightseeing)
// @route   POST /api/partners/image
// @access  Private (Partner)
export const addPartnerImage = async (req: Request, res: Response) => {
    try {
        const { companyName, imageUrl, base64Image, sightseeingName } = req.body;
        
        const profile = await PartnerProfile.findOne({ userId: req.user!._id, companyName });
        if (!profile) return res.status(404).json({ message: 'Hotel not found' });

        let finalImageUrl = imageUrl;
        if (base64Image) {
            finalImageUrl = await uploadBase64Image(base64Image);
        }

        if (!finalImageUrl) return res.status(400).json({ message: 'No image provided' });

        if (sightseeingName) {
            const ss = profile.sightSeeings.find(s => s.name === sightseeingName);
            if (ss) {
                if (!ss.images) ss.images = [];
                ss.images.push(finalImageUrl);
            } else {
                return res.status(404).json({ message: 'Sightseeing not found' });
            }
        } else {
            if (!profile.images) profile.images = [];
            profile.images.push(finalImageUrl);
        }

        await profile.save();
        res.json(profile);
    } catch (error: unknown) {
        handleError(res, error, 'Error adding image');
    }
};

// @desc    Remove partner image
// @route   DELETE /api/partners/image
// @access  Private (Partner)
export const removePartnerImage = async (req: Request, res: Response) => {
    try {
        const { companyName, imageUrl, sightseeingName } = req.body;
        
        const profile = await PartnerProfile.findOne({ userId: req.user!._id, companyName });
        if (!profile) return res.status(404).json({ message: 'Hotel not found' });

        if (sightseeingName) {
            const ss = profile.sightSeeings.find(s => s.name === sightseeingName);
            if (ss && ss.images) {
                ss.images = ss.images.filter(img => img !== imageUrl);
            }
        } else {
            if (profile.images) {
                profile.images = profile.images.filter(img => img !== imageUrl);
            }
        }

        await profile.save();
        res.json(profile);
    } catch (error: unknown) {
        handleError(res, error, 'Error removing image');
    }
};

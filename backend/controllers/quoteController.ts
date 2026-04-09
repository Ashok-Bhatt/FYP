import { Request, Response } from 'express';
import crypto from 'crypto';
import Quote, { IQuote } from '../models/Quote';
import QuoteView from '../models/QuoteView';
import Requirement from '../models/Requirement';
import PartnerProfile from '../models/PartnerProfile';
import User from '../models/User';
import { QuoteSection } from '../../shared/types';
import { handleError } from '../utils/errorHandler';
import { sendQuoteEmail } from '../utils/emailUtils';
import { generateItinerary as groqGenerateItinerary } from '../utils/groqUtils';

// Comparison interfaces
interface ComparisonInsights {
    cheapestQuoteId: string;
    highestRatedQuoteId: string;
    mostActivitiesQuoteId: string;
    bestValueQuoteId: string;
    priceRange: { min: number; max: number };
    averageRating: number;
    totalQuotes: number;
}

interface HotelSummary {
    name: string;
    rating?: number;
    location: string;
    roomType: string;
    nights: number;
    amenities: string[];
    images?: string[];
}

interface ActivitySummary {
    name: string;
    duration: string;
    included: boolean;
    category: 'adventure' | 'cultural' | 'relaxation' | 'dining';
}

interface QuoteComparison {
    _id: string;
    partner: {
        _id: string;
        name: string;
        rating?: number;
        totalReviews?: number;
        logo?: string;
        specialties?: string[];
    };
    status: 'SENT' | 'READY';
    costs: {
        net: number;
        margin: number;
        final: number;
        perHead: number;
        breakdown: {
            hotels: number;
            transport: number;
            activities: number;
            other: number;
        };
    };
    hotels: HotelSummary[];
    itinerary: any[];
    activities: ActivitySummary[];
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    createdAt: string;
    validUntil?: string;
}

// Store active SSE connections
const activeConnections = new Set<Response>();

// Helper function to broadcast quote view events
export const broadcastQuoteView = (quoteId: string, timestamp: Date) => {
    const event = JSON.stringify({
        type: 'quote_viewed',
        quoteId,
        timestamp
    });

    activeConnections.forEach(connection => {
        try {
            connection.write(`data: ${event}\n\n`);
        } catch (error) {
            // Remove dead connections
            activeConnections.delete(connection);
        }
    });
};

// @desc    Auto-generate quotes for selected partners
// @route   POST /api/quotes/generate
// @access  Private (Agent)
export const generateQuotes = async (req: Request, res: Response) => {
    const { requirementId, partnerIds } = req.body;

    try {
        const requirement = await Requirement.findById(requirementId);
        if (!requirement) {
            res.status(404).json({ message: 'Requirement not found' });
            return;
        }

        const quotes: IQuote[] = [];

        for (const partnerId of partnerIds) {
            // Fetch partner profile instead of inventory
            const partner = await PartnerProfile.findOne({ userId: partnerId }).populate('userId', 'name email');
            if (!partner) continue;

            // Build quote sections using partner data
            const quoteSections: QuoteSection = {
                hotels: [],
                transport: [],
                activities: [],
            };

            let netCost = 0;
            const duration = requirement.duration || 6;
            const adults = requirement.pax?.adults || 2;

            // 1. Add Hotel based on partner's room types and pricing
            if (partner.type === 'Hotel' || partner.type === 'DMC' || partner.type === 'Mixed') {
                // Use the cheapest room type as default
                const roomTypes = partner.roomTypes || [];
                const defaultRoom = roomTypes.length > 0 ? roomTypes[0] : { name: 'Deluxe Room', price: partner.startingPrice || 5000 };
                const hotelPrice = defaultRoom.price;
                const nights = duration - 1;
                const roomCost = hotelPrice * nights;

                quoteSections.hotels.push({
                    name: partner.companyName,
                    city: partner.destinations || requirement.destination || '',
                    roomType: defaultRoom.name,
                    nights: nights,
                    unitPrice: hotelPrice,
                    qty: 1,
                    total: roomCost,
                });
                netCost += roomCost;
            }

            // 2. Add Transport (only for DMC and Mixed types since CabProvider is removed)
            if (partner.type === 'DMC' || partner.type === 'Mixed') {
                const transportPrice = 3000; // Default per day
                const days = duration;
                const transportCost = transportPrice * days;

                quoteSections.transport.push({
                    type: 'Private Sedan',
                    days: days,
                    unitPrice: transportPrice,
                    total: transportCost,
                });
                netCost += transportCost;
            }

            // 3. Add Activities based on partner's activities and sightseeings
            // Use activities first, then sightseeings as fallback
            const activitiesToAdd = partner.activities && partner.activities.length > 0 
                ? partner.activities.slice(0, 3) 
                : (partner.sightSeeings && partner.sightSeeings.length > 0 
                    ? partner.sightSeeings.slice(0, 3) 
                    : []);

            activitiesToAdd.forEach((activity: any, index: number) => {
                const activityName = activity.name || 'Activity';
                const activityPrice = activity.entryFee || 1500 + (index * 500); // Use entryFee if available
                const activityCost = activityPrice * adults;

                quoteSections.activities.push({
                    name: activityName,
                    unitPrice: activityPrice,
                    qty: adults,
                    total: activityCost,
                });
                netCost += activityCost;
            });

            // Create Quote Record
            const quote = await Quote.create({
                requirementId,
                partnerId: partner.userId._id,
                agentId: req.user!._id,
                title: `${requirement.destination} Trip - ${requirement.tripType}`,
                sections: quoteSections,
                costs: {
                    net: netCost,
                    margin: 10, // Default 10%
                    final: netCost * 1.1,
                    perHead: (netCost * 1.1) / adults,
                },
                status: 'DRAFT',
            });

            quotes.push(quote);
        }

        // Update Requirement Status to QUOTES_READY
        requirement.status = 'QUOTES_READY';
        await requirement.save();

        res.status(201).json(quotes);
    } catch (error: unknown) {
        handleError(res, error, 'Quote generation error');
    }
};

// @desc    Get user's quotes
// @route   GET /api/quotes/user
// @access  Private (User)
export const getUserQuotes = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const { requirementId } = req.query;
        
        if (requirementId) {
            // If requirementId is provided, get quotes for that specific requirement
            // Verify the requirement belongs to the user
            const requirement = await Requirement.findOne({ 
                _id: requirementId, 
                userId: req.user.id 
            });
            
            if (!requirement) {
                res.status(404).json({ message: 'Requirement not found or does not belong to user' });
                return;
            }
            
            // Get quotes for this specific requirement
            const quotes = await Quote.find({ 
                requirementId: requirementId,
                status: { $in: ['SENT_TO_USER', 'ACCEPTED', 'DECLINED'] }
            })
            .populate('partnerId', 'name companyName')
            .populate('requirementId', 'destination tripType budget duration')
            .sort({ createdAt: -1 });
            
            res.json(quotes);
            return;
        }

        // Default behavior: get all quotes for the user
        const userRequirements = await Requirement.find({ userId: req.user.id }).select('_id');
        const requirementIds = userRequirements.map(req => req._id);
        
        const quotes = await Quote.find({ 
            requirementId: { $in: requirementIds },
            status: { $in: ['SENT_TO_USER', 'ACCEPTED', 'DECLINED'] }
        })
        .populate('partnerId', 'name companyName')
        .populate('requirementId', 'destination tripType budget duration')
        .sort({ createdAt: -1 });
        
        res.json(quotes);
    } catch (error: unknown) {
        handleError(res, error, 'Error fetching user quotes');
    }
};

// @desc    Get all quotes for agent
// @route   GET /api/quotes
// @access  Private (Agent)
export const getQuotes = async (req: Request, res: Response) => {
    try {
        const query = req.user?.role === 'ADMIN' ? {} : { agentId: req.user!._id };
        const quotes = await Quote.find(query)
            .populate('requirementId', 'destination tripType budget startDate duration')
            .sort({ createdAt: -1 });
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
        const quotes = await Quote.find({ requirementId: req.params.id }).populate('partnerId', 'name companyName');
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
        const quote = await Quote.findById(req.params.id)
            .populate('partnerId', 'name companyName')
            .populate('requirementId', 'destination tripType duration pax contactInfo');
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
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            res.status(404).json({ message: 'Quote not found' });
            return;
        }

        // Update fields
        const { sections, costs, status } = req.body;
        if (sections) quote.sections = sections;
        if (costs) quote.costs = costs;
        if (status) quote.status = status;

        await quote.save();
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
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            res.status(404).json({ message: 'Quote not found' });
            return;
        }

        await Quote.findByIdAndDelete(req.params.id);
        res.json({ message: 'Quote deleted successfully' });
    } catch (error: unknown) {
        handleError(res, error, 'Error deleting quote');
    }
};

// @desc    Send Quote via Email
// @route   POST /api/quotes/:id/send
// @access  Private (Agent)
export const sendQuoteEmailController = async (req: Request, res: Response) => {
    try {
        const quote = await Quote.findById(req.params.id).populate('requirementId');
        if (!quote) {
            res.status(404).json({ message: 'Quote not found' });
            return;
        }

        // Generate shareToken if it doesn't exist
        if (!quote.shareToken) {
            quote.shareToken = crypto.randomUUID();
        }

        const requirement: any = quote.requirementId;
        const toEmail = requirement.contactInfo?.email;
        const toName = requirement.contactInfo?.name || 'Traveler';
        const destination = requirement.destination || 'your destination';

        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const quoteUrl = `${frontendBaseUrl}/quote/view/${quote.shareToken}`;

        const emailSent = toEmail
            ? await sendQuoteEmail(toEmail, toName, quoteUrl, destination)
            : false;

        quote.status = 'SENT_TO_USER';
        await quote.save();

        if (!emailSent) {
            res.status(202).json({
                message: toEmail
                    ? 'Quote marked as sent, but email delivery failed.'
                    : 'Quote marked as sent. Traveler email is missing.',
                quote,
                emailSent: false,
            });
            return;
        }

        res.json({ message: 'Quote sent successfully', quote, emailSent: true });
    } catch (error: unknown) {
        handleError(res, error, 'Error sending quote email');
    }
};

// @desc    Get Public Quote by Token
// @route   GET /api/quotes/public/:token
// @access  Public
export const getPublicQuote = async (req: Request, res: Response) => {
    try {
        const quote = await Quote.findOne({ shareToken: req.params.token })
            .populate('requirementId', 'destination tripType startDate duration pax contactInfo')
            .populate('partnerId', 'companyName starRating type');

        if (!quote) {
            res.status(404).json({ message: 'Quote not found or link expired' });
            return;
        }
        
        const currentTimestamp = new Date();
        const userAgent = req.get('User-Agent') || '';
        const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
        const ipHash = crypto.createHash('sha256').update(ip.toString()).digest('hex');
        
        // Update view tracking fields
        const isFirstView = !quote.viewedAt;
        await Quote.findByIdAndUpdate(quote._id, {
            $inc: { viewCount: 1 },
            $set: {
                lastViewedAt: currentTimestamp,
                ...(isFirstView && { viewedAt: currentTimestamp })
            }
        });

        // Create view record asynchronously (non-blocking)
        setImmediate(async () => {
            try {
                const viewRecord = new QuoteView({
                    quoteId: quote._id,
                    timestamp: currentTimestamp,
                    userAgent,
                    ipHash,
                });
                const savedView = await viewRecord.save();
                
                // Trigger SSE broadcast
                const event = JSON.stringify({
                    type: 'quote_viewed',
                    quoteId: quote._id,
                    viewId: savedView._id,
                    timestamp: currentTimestamp,
                    destination: (quote.requirementId as any).destination
                });

                activeConnections.forEach(connection => {
                    try {
                        connection.write(`data: ${event}\n\n`);
                    } catch (error) {
                        activeConnections.delete(connection);
                    }
                });
            } catch (error) {
                console.error('Failed to save quote view:', error);
            }
        });

        // Add latestViewId to response for duration tracking
        const latestView = await QuoteView.findOne({ quoteId: quote._id }).sort({ timestamp: -1 });
        const quoteObj = quote.toObject();
        (quoteObj as any).latestViewId = latestView?._id;

        res.json(quoteObj);
    } catch (error: unknown) {
        handleError(res, error, 'Error fetching public quote');
    }
};

// @desc    Update Quote View Duration
// @route   POST /api/quotes/public/:token/view-duration
// @access  Public
export const updateQuoteViewDuration = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { duration, viewId } = req.body;

        const quote = await Quote.findOne({ shareToken: token });
        if (!quote) {
            res.status(404).json({ message: 'Quote not found' });
            return;
        }

        if (viewId) {
            const update: any = { $set: { duration } };
            if (req.body.sectionEngagement) {
                update.$set.sectionEngagement = req.body.sectionEngagement;
            }
            await QuoteView.findByIdAndUpdate(viewId, update);
        }

        res.json({ message: 'Duration updated' });
    } catch (error: unknown) {
        handleError(res, error, 'Error updating view duration');
    }
};

// @desc    Update Public Quote Status (Accept/Decline)
// @route   POST /api/quotes/public/:token/status
// @access  Public
export const updatePublicQuoteStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        if (!['ACCEPTED', 'DECLINED'].includes(status)) {
            res.status(400).json({ message: 'Invalid status update' });
            return;
        }

        const quote = await Quote.findOne({ shareToken: req.params.token });
        
        if (!quote) {
            res.status(404).json({ message: 'Quote not found' });
            return;
        }

        quote.status = status as any;
        await quote.save();

        res.json({ message: `Quote has been ${status.toLowerCase()}`, quote });
    } catch (error: unknown) {
        handleError(res, error, 'Error updating quote status');
    }
};

// @desc    Generate AI day-by-day itinerary for a quote
// @route   POST /api/quotes/:id/itinerary
// @access  Private (Agent)
export const generateItinerary = async (req: Request, res: Response) => {
    try {
        // Populate both requirement and partner data
        const quote = await Quote.findById(req.params.id)
            .populate('requirementId')
            .populate({
                path: 'partnerId',
                select: 'companyName sightSeeings activities',
            });

        if (!quote) {
            res.status(404).json({ message: 'Quote not found' });
            return;
        }

        const req_data = quote.requirementId as any;
        const partner_data = quote.partnerId as any;

        // Extract all relevant data for the prompt
        const destination = req_data?.destination || 'the destination';
        const duration = req_data?.duration || 5;
        const tripType = req_data?.tripType || 'leisure';
        const adults = req_data?.pax?.adults || 2;
        const children = req_data?.pax?.children || 0;
        const description = req_data?.description || '';
        const hotelName = (quote.sections?.hotels?.[0] as any)?.name || partner_data?.companyName || 'the hotel';
        
        // Extract sightseeing and activities from new schema
        const sightseeing: string[] = partner_data?.sightSeeings?.map((s: any) => s.name) || [];
        const partnerActivities: string[] = partner_data?.activities?.map((a: any) => a.name) || [];
        const activities: string[] = (quote.sections?.activities || []).map((a: any) => a.name);
        
        // Combine partner activities with quote activities
        const allActivities = [...partnerActivities, ...activities];

        // Call Groq LLM
        const itinerary = await groqGenerateItinerary(
            destination, duration, tripType,
            adults, children, hotelName,
            sightseeing, allActivities, description
        );

        // Persist to the quote document
        (quote as any).itinerary = itinerary;
        await quote.save();

        res.json({ itinerary });
    } catch (error: unknown) {
        handleError(res, error, 'Itinerary generation error');
    }
};

// @desc    SSE endpoint for real-time quote view tracking
// @route   GET /api/quotes/stream/views
// @access  Private (Agent)
export const streamQuoteViews = async (req: Request, res: Response) => {
    // Set SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send initial connection message
    res.write('data: {"type": "connected"}\n\n');

    // Store connection
    activeConnections.add(res);

    // Remove connection on client disconnect
    req.on('close', () => {
        activeConnections.delete(res);
    });

    req.on('aborted', () => {
        activeConnections.delete(res);
    });
};

// @desc    Get quotes for comparison by token
// @route   GET /api/quotes/compare/by-token
// @access  Public (with token)
export const getQuotesForComparisonByToken = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        // Find requirement by compare token
        const requirement = await Requirement.findOne({ compareToken: token });

        if (!requirement) {
            return res.status(404).json({ error: 'Invalid comparison token' });
        }

        // Check if token is expired (7 days)
        const expiryBase = requirement.compareTokenGenerated || requirement.createdAt;
        const tokenExpiry = new Date(expiryBase as Date);
        tokenExpiry.setDate(tokenExpiry.getDate() + 7);
        
        if (tokenExpiry < new Date()) {
            return res.status(410).json({ error: 'Comparison link expired' });
        }

        // Get all quotes for this requirement that have been sent to the traveler
        const quotes = await Quote.find({
            requirementId: requirement._id,
            status: { $in: ['SENT_TO_USER'] }
        }).populate('partnerId');

        // Transform quotes for comparison (reuse existing logic)
        const transformedQuotes: QuoteComparison[] = await Promise.all(
            quotes.map(async (quote) => {
                const partner = await User.findById(quote.partnerId);
                const partnerProfile = await PartnerProfile.findOne({ userId: quote.partnerId });
                
                // Calculate cost breakdown
                const hotelsCost = quote.sections.hotels?.reduce((sum: number, hotel: any) => sum + (hotel.total || 0), 0) || 0;
                const transportCost = quote.sections.transport?.reduce((sum: number, transport: any) => sum + (transport.total || 0), 0) || 0;
                const activitiesCost = quote.sections.activities?.reduce((sum: number, activity: any) => sum + (activity.total || 0), 0) || 0;
                const otherCost = (quote.costs?.net || 0) - hotelsCost - transportCost - activitiesCost;

                // Transform hotels
                const hotels: HotelSummary[] = quote.sections.hotels?.map((hotel: any) => ({
                    name: hotel.name || 'Hotel',
                    rating: hotel.rating || undefined,
                    location: hotel.city || 'Location',
                    roomType: hotel.roomType || 'Standard',
                    nights: hotel.nights || 1,
                    amenities: hotel.amenities || [],
                    images: hotel.images || []
                })) || [];

                // Transform activities
                const activities: ActivitySummary[] = quote.sections.activities?.map((activity: any) => ({
                    name: activity.name || 'Activity',
                    duration: activity.duration || '2 hours',
                    included: true,
                    category: activity.category || 'adventure'
                })) || [];

                return {
                    _id: quote._id.toString(),
                    partner: {
                        _id: partner?._id?.toString() || quote.partnerId.toString(),
                        name: partner?.name || partnerProfile?.companyName || 'Travel Partner',
                        rating: partnerProfile?.starRating || undefined,
                        totalReviews: partnerProfile?.reviews || 0,
                        logo: (partnerProfile?.images && partnerProfile.images.length > 0) ? partnerProfile.images[0] : undefined,
                        specialties: partnerProfile?.specializations || []
                    },
                    status: quote.status as 'SENT' | 'READY',
                    costs: {
                        net: quote.costs?.net || 0,
                        margin: quote.costs?.margin || 0,
                        final: quote.costs?.final || 0,
                        perHead: quote.costs?.perHead || 0,
                        breakdown: {
                            hotels: hotelsCost,
                            transport: transportCost,
                            activities: activitiesCost,
                            other: otherCost
                        }
                    },
                    hotels,
                    itinerary: quote.itinerary || [],
                    activities,
                    highlights: (quote as any).highlights || [],
                    inclusions: (quote as any).inclusions || [],
                    exclusions: (quote as any).exclusions || [],
                    createdAt: (quote.createdAt as Date)?.toISOString() || new Date().toISOString(),
                    validUntil: (quote as any).validUntil ? new Date((quote as any).validUntil).toISOString() : undefined
                };
            })
        );

        // Calculate insights
        const insights = calculateInsights(transformedQuotes);

        const response = {
            requirement: {
                _id: requirement._id.toString(),
                destination: requirement.destination,
                duration: requirement.duration,
                pax: requirement.pax,
                contactInfo: requirement.contactInfo,
                createdAt: (requirement.createdAt as Date)?.toISOString()
            },
            quotes: transformedQuotes,
            insights,
            compareToken: requirement.compareToken
        };

        res.json(response);
    } catch (error) {
        handleError(res, error, 'Failed to fetch quotes for comparison');
    }
};

// @desc    Get quotes for comparison by requirement ID (original endpoint)
// @route   GET /api/quotes/compare/:requirementId
// @access  Public (with token)
export const getQuotesForComparison = async (req: Request, res: Response) => {
    try {
        const { requirementId } = req.params;
        const { token } = req.query;

        // Find the requirement and validate compare token
        const requirement = await Requirement.findById(requirementId);

        if (!requirement) {
            return res.status(404).json({ error: 'Requirement not found' });
        }

        // Validate compare token
        if (!(requirement as any).compareToken || (requirement as any).compareToken !== token) {
            return res.status(403).json({ error: 'Invalid comparison token' });
        }

        // Check if token is expired (7 days)
        const tokenExpiry = new Date((requirement as any).compareTokenGenerated || requirement.createdAt);
        tokenExpiry.setDate(tokenExpiry.getDate() + 7);
        
        if (tokenExpiry < new Date()) {
            return res.status(410).json({ error: 'Comparison link expired' });
        }

        // Get all quotes for this requirement that have been sent to the traveler
        const quotes = await Quote.find({
            requirementId,
            status: { $in: ['SENT_TO_USER'] }
        }).populate('partnerId');

        // Transform quotes for comparison (reuse existing logic from getQuotesForComparisonByToken)
        const transformedQuotes: QuoteComparison[] = await Promise.all(
            quotes.map(async (quote) => {
                const partner = await User.findById(quote.partnerId);
                const partnerProfile = await PartnerProfile.findOne({ userId: quote.partnerId });
                
                // Calculate cost breakdown
                const hotelsCost = quote.sections.hotels?.reduce((sum: number, hotel: any) => sum + (hotel.total || 0), 0) || 0;
                const transportCost = quote.sections.transport?.reduce((sum: number, transport: any) => sum + (transport.total || 0), 0) || 0;
                const activitiesCost = quote.sections.activities?.reduce((sum: number, activity: any) => sum + (activity.total || 0), 0) || 0;
                const otherCost = (quote.costs?.net || 0) - hotelsCost - transportCost - activitiesCost;

                // Transform hotels
                const hotels: HotelSummary[] = quote.sections.hotels?.map((hotel: any) => ({
                    name: hotel.name || 'Hotel',
                    rating: hotel.rating || undefined,
                    location: hotel.city || 'Location',
                    roomType: hotel.roomType || 'Standard',
                    nights: hotel.nights || 1,
                    amenities: hotel.amenities || [],
                    images: hotel.images || []
                })) || [];

                // Transform activities
                const activities: ActivitySummary[] = quote.sections.activities?.map((activity: any) => ({
                    name: activity.name || 'Activity',
                    duration: activity.duration || '2 hours',
                    included: true,
                    category: activity.category || 'adventure'
                })) || [];

                return {
                    _id: quote._id.toString(),
                    partner: {
                        _id: partner?._id?.toString() || quote.partnerId.toString(),
                        name: partner?.name || partnerProfile?.companyName || 'Travel Partner',
                        rating: partnerProfile?.starRating || undefined,
                        totalReviews: partnerProfile?.reviews || 0,
                        logo: (partnerProfile?.images && partnerProfile.images.length > 0) ? partnerProfile.images[0] : undefined,
                        specialties: partnerProfile?.specializations || []
                    },
                    status: quote.status as 'SENT' | 'READY',
                    costs: {
                        net: quote.costs?.net || 0,
                        margin: quote.costs?.margin || 0,
                        final: quote.costs?.final || 0,
                        perHead: quote.costs?.perHead || 0,
                        breakdown: {
                            hotels: hotelsCost,
                            transport: transportCost,
                            activities: activitiesCost,
                            other: otherCost
                        }
                    },
                    hotels,
                    itinerary: quote.itinerary || [],
                    activities,
                    highlights: (quote as any).highlights || [],
                    inclusions: (quote as any).inclusions || [],
                    exclusions: (quote as any).exclusions || [],
                    createdAt: (quote.createdAt as Date)?.toISOString() || new Date().toISOString(),
                    validUntil: (quote as any).validUntil ? new Date((quote as any).validUntil).toISOString() : undefined
                };
            })
        );

        // Calculate insights
        const insights = calculateInsights(transformedQuotes);

        const response = {
            requirement: {
                _id: requirement._id.toString(),
                destination: requirement.destination,
                duration: requirement.duration,
                pax: requirement.pax,
                contactInfo: requirement.contactInfo,
                createdAt: (requirement.createdAt as Date)?.toISOString()
            },
            quotes: transformedQuotes,
            insights,
            compareToken: (requirement as any).compareToken
        };

        res.json(response);
    } catch (error) {
        handleError(res, error, 'Failed to fetch quotes for comparison');
    }
};

// @desc    Accept a quote via compare token (auto-declines sibling quotes)
// @route   POST /api/quotes/:quoteId/accept
// @access  Public (secured by compareToken)
export const acceptQuote = async (req: Request, res: Response) => {
    try {
        const { quoteId } = req.params;
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'compareToken is required' });
        }

        // Find the quote (do NOT populate — we'll fetch requirement separately)
        const quote = await Quote.findById(quoteId);

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        // Validate the compare token against the associated requirement
        const requirement = await Requirement.findById(quote.requirementId);
        if (!requirement) {
            return res.status(404).json({ error: 'Requirement not found' });
        }
        if (!requirement.compareToken || requirement.compareToken !== token) {
            return res.status(403).json({ error: 'Invalid or expired comparison token' });
        }

        // Check token expiry (7 days)
        if (requirement.compareTokenGenerated) {
            const expiry = new Date(requirement.compareTokenGenerated);
            expiry.setDate(expiry.getDate() + 7);
            if (expiry < new Date()) {
                return res.status(410).json({ error: 'Comparison link has expired' });
            }
        }

        // Prevent double-acceptance
        if (quote.status === 'ACCEPTED') {
            return res.status(409).json({ error: 'This quote has already been accepted' });
        }

        // 1. Accept the chosen quote
        quote.status = 'ACCEPTED';
        await quote.save();

        // 2. Auto-decline all sibling quotes for the same requirement
        await Quote.updateMany(
            {
                requirementId: requirement._id,
                _id: { $ne: quote._id },
                status: { $in: ['SENT_TO_USER', 'READY', 'DRAFT'] },
            },
            { $set: { status: 'DECLINED' } }
        );

        // 3. Mark the requirement as COMPLETED
        requirement.status = 'COMPLETED';
        await requirement.save();

        res.json({
            success: true,
            message: 'Quote accepted successfully. Other options have been declined.',
            quoteId: quote._id.toString(),
        });

    } catch (error) {
        handleError(res, error, 'Failed to accept quote');
    }
};

// @desc    Generate compare token for requirement
// @route   POST /api/quotes/generate-compare-token/:requirementId
// @access  Private (Agent)
export const generateCompareToken = async (req: Request, res: Response) => {
    try {
        const { requirementId } = req.params;

        const requirement = await Requirement.findById(requirementId);
        if (!requirement) {
            return res.status(404).json({ error: 'Requirement not found' });
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');

        // Update requirement with token
        requirement.compareToken = token;
        requirement.compareTokenGenerated = new Date();
        await requirement.save();

        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.json({
            compareToken: token,
            compareUrl: `${frontendBaseUrl}/quote/compare/${token}`
        });

    } catch (error) {
        handleError(res, error, 'Failed to generate compare token');
    }
};

// Helper function to calculate comparison insights
function calculateInsights(quotes: QuoteComparison[]): ComparisonInsights {
    if (quotes.length === 0) {
        return {
            cheapestQuoteId: '',
            highestRatedQuoteId: '',
            mostActivitiesQuoteId: '',
            bestValueQuoteId: '',
            priceRange: { min: 0, max: 0 },
            averageRating: 0,
            totalQuotes: 0
        };
    }

    // Find cheapest quote
    const cheapestQuote = quotes.reduce((min, quote) => 
        quote.costs.final < min.costs.final ? quote : min
    );

    // Find highest rated quote
    const highestRatedQuote = quotes.reduce((max, quote) => 
        (quote.partner.rating || 0) > (max.partner.rating || 0) ? quote : max
    );

    // Find quote with most activities
    const mostActivitiesQuote = quotes.reduce((max, quote) => 
        quote.activities.length > max.activities.length ? quote : max
    );

    // Find best value (price:quality ratio)
    const bestValueQuote = quotes.reduce((best, quote) => {
        const score = (quote.partner.rating || 1) / (quote.costs.final / 1000);
        const bestScore = (best.partner.rating || 1) / (best.costs.final / 1000);
        return score > bestScore ? quote : best;
    });

    const prices = quotes.map(q => q.costs.final);
    const ratings = quotes.map(q => q.partner.rating || 0);

    return {
        cheapestQuoteId: cheapestQuote._id,
        highestRatedQuoteId: highestRatedQuote._id,
        mostActivitiesQuoteId: mostActivitiesQuote._id,
        bestValueQuoteId: bestValueQuote._id,
        priceRange: {
            min: Math.min(...prices),
            max: Math.max(...prices)
        },
        averageRating: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
        totalQuotes: quotes.length
    };
}

import { Request, Response } from 'express';
import crypto from 'crypto';
import Quote, { IQuote } from '../models/Quote';
import QuoteView from '../models/QuoteView';
import Requirement from '../models/Requirement';
import PartnerProfile from '../models/PartnerProfile';
import { QuoteSection } from '../../shared/types';
import { handleError } from '../utils/errorHandler';
import { sendQuoteEmail } from '../utils/emailUtils';
import { generateItinerary as groqGenerateItinerary } from '../utils/groqUtils';

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

            // 1. Add Hotel based on partner's starting price
            if (partner.type === 'Hotel' || partner.type === 'DMC' || partner.type === 'Mixed') {
                const hotelPrice = partner.startingPrice || 5000;
                const nights = duration - 1;
                const roomCost = hotelPrice * nights;

                quoteSections.hotels.push({
                    name: partner.companyName,
                    city: partner.destinations?.[0] || requirement.destination || '',
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

                quoteSections.transport.push({
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
                activitiesToAdd.forEach((sight: string, index: number) => {
                    const activityPrice = 1500 + (index * 500); // Varying prices
                    const activityCost = activityPrice * adults;

                    quoteSections.activities.push({
                        name: sight,
                        unitPrice: activityPrice,
                        qty: adults,
                        total: activityCost,
                    });
                    netCost += activityCost;
                });
            }

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

// @desc    Get all quotes for agent
// @route   GET /api/quotes
// @access  Private (Agent)
export const getQuotes = async (req: Request, res: Response) => {
    try {
        const quotes = await Quote.find({})
            .populate('requirementId', 'destination tripType budget startDate duration')
            .populate('agentId', 'name email')
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
        const quote = await Quote.findById(req.params.id).populate('partnerId', 'name companyName');
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
            .populate('partnerId', 'companyName rating type');

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
                await viewRecord.save();
                
                // Trigger SSE broadcast
                broadcastQuoteView(quote._id.toString(), currentTimestamp);
            } catch (error) {
                console.error('Failed to save quote view:', error);
            }
        });

        res.json(quote);
    } catch (error: unknown) {
        handleError(res, error, 'Error fetching public quote');
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
                select: 'companyName sightSeeing',
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
        const sightseeing: string[] = partner_data?.sightSeeing || [];
        const activities: string[] = (quote.sections?.activities || []).map((a: any) => a.name);

        // Call Groq LLM
        const itinerary = await groqGenerateItinerary(
            destination, duration, tripType,
            adults, children, hotelName,
            sightseeing, activities, description
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

import express from 'express';
import {
    generateQuotes,
    getQuotesByRequirement,
    getQuoteById,
    updateQuote,
    getQuotes,
    deleteQuote,
    sendQuoteEmailController,
    getPublicQuote,
    updatePublicQuoteStatus,
    getUserQuotes,
    generateItinerary,
    streamQuoteViews,
    getQuotesForComparisonByToken,
    getQuotesForComparison,
    generateCompareToken,
    acceptQuote,
    updateQuoteViewDuration,
} from '../controllers/quoteController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes must be defined BEFORE /:id routes
router.get('/public/:token', getPublicQuote);
router.post('/public/:token/status', updatePublicQuoteStatus);
router.post('/public/:token/view-duration', updateQuoteViewDuration);

// Multi-quote comparison routes (public, secured by compareToken)
// IMPORTANT: these must stay before /:id to avoid 'compare' being treated as a quote ID
router.get('/compare/by-token', getQuotesForComparisonByToken);
router.get('/compare/:requirementId', getQuotesForComparison);
router.post('/compare/generate-token/:requirementId', protect, authorize('AGENT', 'ADMIN'), generateCompareToken);
router.post('/:quoteId/accept', acceptQuote);

// User routes
router.get('/user', protect, authorize('USER'), getUserQuotes);

// Protected routes
router.post('/generate', protect, authorize('AGENT', 'ADMIN'), generateQuotes);
router.post('/:id/itinerary', protect, authorize('AGENT', 'ADMIN'), generateItinerary);
router.get('/', protect, authorize('AGENT', 'ADMIN'), getQuotes);
router.get('/requirement/:id', protect, authorize('AGENT', 'ADMIN'), getQuotesByRequirement);

router.post('/:id/send', protect, authorize('AGENT', 'ADMIN'), sendQuoteEmailController);
router.get('/:id', protect, authorize('AGENT', 'ADMIN'), getQuoteById);
router.put('/:id', protect, authorize('AGENT', 'ADMIN'), updateQuote);
router.delete('/:id', protect, authorize('AGENT', 'ADMIN'), deleteQuote);

// SSE endpoint for real-time quote view tracking
router.get('/stream/views', protect, authorize('AGENT', 'ADMIN'), streamQuoteViews);

export default router;

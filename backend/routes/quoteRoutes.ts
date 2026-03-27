import express from 'express';
import {
    generateQuotes,
    getQuotesByRequirement,
    getQuoteById,
    updateQuote,
    getQuotes,
    deleteQuote,
    generateItinerary,
} from '../controllers/quoteController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/generate', protect, authorize('AGENT', 'ADMIN'), generateQuotes);
router.post('/:id/itinerary', protect, authorize('AGENT', 'ADMIN'), generateItinerary);
router.get('/', protect, authorize('AGENT', 'ADMIN'), getQuotes);
router.get('/requirement/:id', protect, authorize('AGENT', 'ADMIN'), getQuotesByRequirement);
router.get('/:id', protect, authorize('AGENT', 'ADMIN'), getQuoteById);
router.put('/:id', protect, authorize('AGENT', 'ADMIN'), updateQuote);
router.delete('/:id', protect, authorize('AGENT', 'ADMIN'), deleteQuote);

export default router;

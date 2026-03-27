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
    updatePublicQuoteStatus
} from '../controllers/quoteController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes must be defined BEFORE /:id routes
router.get('/public/:token', getPublicQuote);
router.post('/public/:token/status', updatePublicQuoteStatus);

router.post('/generate', protect, authorize('AGENT', 'ADMIN'), generateQuotes);
router.get('/', protect, authorize('AGENT', 'ADMIN'), getQuotes);
router.get('/requirement/:id', protect, authorize('AGENT', 'ADMIN'), getQuotesByRequirement);

router.post('/:id/send', protect, authorize('AGENT', 'ADMIN'), sendQuoteEmailController);
router.get('/:id', protect, authorize('AGENT', 'ADMIN'), getQuoteById);
router.put('/:id', protect, authorize('AGENT', 'ADMIN'), updateQuote);
router.delete('/:id', protect, authorize('AGENT', 'ADMIN'), deleteQuote);

export default router;

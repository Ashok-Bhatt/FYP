import express from 'express';
import {
    getMyProfile,
    updateProfile,
    filterPartners,
} from '../controllers/partnerController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Partner Routes
router.get('/me', protect, authorize('PARTNER'), getMyProfile);
router.post('/profile', protect, authorize('PARTNER'), updateProfile);

// Agent Routes
router.post('/filter', protect, authorize('AGENT', 'ADMIN'), filterPartners);

export default router;

import express from 'express';
import {
    getMyProfile,
    updateProfile,
    addInventory,
    filterPartners,
} from '../controllers/partnerController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Partner Routes
router.get('/me', protect, authorize('PARTNER'), getMyProfile);
router.post('/profile', protect, authorize('PARTNER'), updateProfile);
router.post('/inventory/:type', protect, authorize('PARTNER'), addInventory);

// Agent Routes
router.post('/filter', protect, authorize('AGENT', 'ADMIN'), filterPartners);

export default router;

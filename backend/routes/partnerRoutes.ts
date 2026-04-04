import express from 'express';
import {
    getMyProfile,
    updateProfile,
    filterPartners,
    getPartnerDashboard,
    getPartnerQuotes,
    addPartnerImage,
    removePartnerImage,
} from '../controllers/partnerController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Partner Routes
router.get('/me', protect, authorize('PARTNER'), getMyProfile);
router.post('/profile', protect, authorize('PARTNER'), updateProfile);
router.get('/dashboard', protect, authorize('PARTNER'), getPartnerDashboard);
router.get('/quotes', protect, authorize('PARTNER'), getPartnerQuotes);
router.post('/image', protect, authorize('PARTNER'), addPartnerImage);
router.delete('/image', protect, authorize('PARTNER'), removePartnerImage);

// Agent Routes
router.post('/filter', protect, authorize('AGENT', 'ADMIN'), filterPartners);

export default router;

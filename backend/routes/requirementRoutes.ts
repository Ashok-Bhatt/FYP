import express from 'express';
import {
    createRequirement,
    getRequirements,
    getRequirementById,
    updateRequirementStatus,
    deleteRequirement,
    getUserRequirements,
} from '../controllers/requirementController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createRequirement);
router.get('/', protect, authorize('AGENT', 'ADMIN'), getRequirements);
router.get('/user', protect, authorize('USER'), getUserRequirements);
router.get('/:id', protect, authorize('USER', 'AGENT', 'ADMIN'), getRequirementById);
router.put('/:id', protect, authorize('AGENT', 'ADMIN'), updateRequirementStatus);
router.delete('/:id', protect, authorize('AGENT', 'ADMIN'), deleteRequirement);

export default router;

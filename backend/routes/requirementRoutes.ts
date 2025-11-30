import express from 'express';
import {
    createRequirement,
    getRequirements,
    getRequirementById,
    updateRequirementStatus,
    deleteRequirement,
} from '../controllers/requirementController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', createRequirement);
router.get('/', protect, authorize('AGENT', 'ADMIN'), getRequirements);
router.get('/:id', protect, authorize('USER', 'AGENT', 'ADMIN'), getRequirementById);
router.put('/:id', protect, authorize('AGENT', 'ADMIN'), updateRequirementStatus);
router.delete('/:id', protect, authorize('AGENT', 'ADMIN'), deleteRequirement);

export default router;

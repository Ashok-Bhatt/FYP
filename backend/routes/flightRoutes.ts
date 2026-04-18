import express from 'express';
import { searchFlights, getAirports } from '../controllers/flightController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes
router.post('/search', protect as express.RequestHandler, searchFlights as express.RequestHandler);
router.get('/airports', getAirports as express.RequestHandler);

export default router;

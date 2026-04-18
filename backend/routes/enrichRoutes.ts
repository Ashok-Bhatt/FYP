import { Router, Request, Response } from 'express';
import { enrichDaySummary } from '../utils/groqUtils';

const router = Router();

/**
 * POST /api/enrich/day
 * Enriches a single itinerary day with Groq-generated prose, food notes, and cultural tips.
 * No authentication required — output is informational only.
 * Backend-architect patterns: idempotency cache in groqUtils, retry, graceful fallback.
 */
router.post('/day', async (req: Request, res: Response) => {
    const { destination, dayTitle, activities, highlight } = req.body;

    if (!destination || !dayTitle) {
        return res.status(400).json({ error: 'destination and dayTitle are required' });
    }

    try {
        const result = await enrichDaySummary(
            String(destination),
            String(dayTitle),
            Array.isArray(activities) ? activities.map(String) : [],
            String(highlight || '')
        );

        return res.json(result);
    } catch (err) {
        console.error('[enrichRoutes] Unexpected error:', err);
        // Graceful degradation — return empty strings so PDF still renders
        return res.json({ prose: '', foodNote: '', culturalTip: '' });
    }
});

export default router;

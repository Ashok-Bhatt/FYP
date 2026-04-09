import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '../config/env';
import { ItineraryDay } from '../../shared/types';
import crypto from 'crypto';

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

// In-memory enrichment cache (backend-architect idempotency pattern)
// TTL: 1 hour — clears naturally on server restart
interface EnrichResult {
    prose: string;
    foodNote: string;
    culturalTip: string;
}
const enrichCache = new Map<string, { result: EnrichResult; expiresAt: number }>();

async function groqCallWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 2,
    baseDelayMs = 500
): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            if (attempt < maxRetries) {
                await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, attempt)));
            }
        }
    }
    throw lastError;
}

export async function generateItinerary(
    destination: string,
    duration: number,
    tripType: string,
    adults: number,
    children: number,
    hotelName: string,
    sightseeing: string[],
    activities: string[],
    description: string
): Promise<ItineraryDay[]> {
    if (!groq) {
        throw new Error('GROQ_API_KEY is not configured.');
    }

    const systemPrompt = `You are an expert luxury travel planner with deep knowledge of global destinations. 
You will generate a highly detailed, immersive, and realistic day-by-day travel itinerary.
Always respond ONLY with valid JSON matching this exact schema — no markdown, no explanation:
{
  "days": [
    {
      "day": 1,
      "title": "Arrival & First Impressions",
      "highlight": "One vivid sentence describing the day's spirit",
      "activities": ["activity 1", "activity 2", "activity 3"],
      "accommodation": "Hotel name",
      "meals": ["Breakfast: ...", "Lunch: ...", "Dinner: ..."],
      "tips": "A practical insider tip for this day"
    }
  ]
}`;

    const userPrompt = `Create a detailed ${duration}-day ${tripType} travel itinerary for ${destination}.

Trip Details:
- Travelers: ${adults} adult(s), ${children} child(ren)
- Hotel: ${hotelName}
- Sightseeing spots available: ${sightseeing.length > 0 ? sightseeing.join(', ') : 'popular local attractions'}
- Booked activities: ${activities.length > 0 ? activities.join(', ') : 'to be explored'}
- Special notes from traveler: ${description || 'none'}

Important: 
- Use real, specific place names, local restaurants, and landmarks.
- Distribute sightseeing spots naturally across the days.
- Day 1 should be arrival + light exploration, last day should be departure.
- Include morning, afternoon, and evening activities each day.
- Make meal recommendations authentic to the destination's cuisine.
- The highlight should be one evocative, inspiring sentence that captures the day's essence.`;

    const completion = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 4096,
    });

    const raw = completion.choices[0]?.message?.content || '{"days":[]}';
    const parsed = JSON.parse(raw);
    return parsed.days as ItineraryDay[];
}

/**
 * Enriches a single itinerary day with vivid prose, food notes, and cultural tips.
 * Uses idempotency cache + exponential backoff retry (backend-architect patterns).
 * Gracefully returns empty strings if Groq is unavailable.
 */
export async function enrichDaySummary(
    destination: string,
    dayTitle: string,
    activities: string[],
    highlight: string
): Promise<EnrichResult> {
    const emptyResult: EnrichResult = { prose: '', foodNote: '', culturalTip: '' };

    if (!groq) return emptyResult;

    // Cache key: SHA1 of destination + title + first 2 activities
    const cacheInput = `${destination}::${dayTitle}::${activities.slice(0, 2).join(',')}`;
    const cacheKey = crypto.createHash('sha1').update(cacheInput).digest('hex');

    const cached = enrichCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
        return cached.result;
    }

    try {
        const systemPrompt = `You are a luxury travel writer. Output ONLY valid JSON with keys: prose, foodNote, culturalTip. No markdown.`;

        const userPrompt = `Write for a premium travel itinerary PDF:
- Destination: ${destination}
- Day title: ${dayTitle}
- Highlight: ${highlight || 'A memorable day of exploration'}
- Activities: ${activities.slice(0, 4).join(', ')}

Rules:
- prose: exactly 2-3 evocative sentences describing the day's atmosphere and what makes it special
- foodNote: one sentence recommending what to eat or a local dish to try this day
- culturalTip: one practical insider tip about local customs, timing, or etiquette`;

        const result = await groqCallWithRetry(async () => {
            const completion = await groq!.chat.completions.create({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.75,
                max_tokens: 512,
            });
            return completion;
        }, 2, 500);

        const raw = result.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(raw);

        const enrichResult: EnrichResult = {
            prose: parsed.prose || '',
            foodNote: parsed.foodNote || '',
            culturalTip: parsed.culturalTip || '',
        };

        // Cache for 1 hour
        enrichCache.set(cacheKey, { result: enrichResult, expiresAt: Date.now() + 60 * 60 * 1000 });
        return enrichResult;
    } catch (err) {
        console.error('[groqUtils] enrichDaySummary failed, returning empty result:', err);
        return emptyResult; // graceful degradation
    }
}

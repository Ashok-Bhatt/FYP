import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '../config/env';
import { ItineraryDay } from '../../shared/types';

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

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

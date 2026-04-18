/**
 * pexelsService.ts
 * Smart Pexels image fetching with per-day unique queries and in-session caching.
 * Applies the backend-architect caching pattern on the frontend side.
 */

const sessionCache = new Map<string, string | null>();

/**
 * Builds a smart Pexels search query from destination + day context.
 * Example: "Maldives coral reef snorkeling underwater"
 */
export function buildDayQuery(
    destination: string,
    dayTitle: string,
    firstActivity?: string
): string {
    const base = destination.split(',')[0].trim();

    // Strip generic words from activity to get the visual noun
    const activityKeyword = firstActivity
        ? firstActivity
              .replace(/\b(visit|explore|tour|enjoy|discover|experience|take|a|an|the|and|to|at|in|of|on|for|with|by)\b/gi, '')
              .trim()
              .split(/\s+/)
              .slice(0, 3)
              .join(' ')
        : '';

    const titleKeyword = dayTitle
        .replace(/day \d+/gi, '')
        .replace(/arrival|departure|check[- ]in|check[- ]out/gi, 'travel')
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(' ');

    const query = [base, titleKeyword, activityKeyword]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

    return query.length > 4 ? query : base;
}

/**
 * Fetches a single high-quality Pexels landscape image URL for the given query.
 * Returns null if the API key is missing, the query returns nothing, or fetch fails.
 */
export async function fetchPexelsImage(
    query: string,
    apiKey: string,
    pageOffset = 0
): Promise<string | null> {
    if (!apiKey) return null;

    const cacheKey = `${query}::${pageOffset}`;
    if (sessionCache.has(cacheKey)) {
        return sessionCache.get(cacheKey) ?? null;
    }

    try {
        const params = new URLSearchParams({
            query,
            orientation: 'landscape',
            per_page: '8',
            page: String(1 + pageOffset),
        });

        const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
            headers: { Authorization: apiKey },
        });

        if (!res.ok) {
            sessionCache.set(cacheKey, null);
            return null;
        }

        const json = await res.json();
        const photos: any[] = json.photos ?? [];

        if (photos.length === 0) {
            // Fallback: try destination-only query
            const fallbackKey = `${query.split(' ')[0]}::0`;
            if (!sessionCache.has(fallbackKey)) {
                const result = await fetchPexelsImage(query.split(' ')[0], apiKey, 0);
                sessionCache.set(cacheKey, result);
                return result;
            }
            sessionCache.set(cacheKey, null);
            return null;
        }

        // Pick a varied photo based on offset so each day gets something different
        const pick = photos[pageOffset % photos.length];
        const url: string = pick.src?.large2x ?? pick.src?.large ?? pick.src?.original ?? null;
        sessionCache.set(cacheKey, url);
        return url;
    } catch {
        sessionCache.set(cacheKey, null);
        return null;
    }
}

/**
 * Fetches unique Pexels images for all days in parallel.
 * Each day gets a different page offset so images don't repeat.
 * Returns a map of dayIndex (0-based) → image URL or null.
 */
export async function fetchAllDayImages(
    days: Array<{ title: string; activities: string[] }>,
    destination: string,
    apiKey: string
): Promise<Record<number, string | null>> {
    if (!apiKey) return {};

    const results = await Promise.allSettled(
        days.map((day, index) => {
            const query = buildDayQuery(destination, day.title, day.activities?.[0]);
            return fetchPexelsImage(query, apiKey, index % 4);
        })
    );

    const imageMap: Record<number, string | null> = {};
    results.forEach((result, index) => {
        imageMap[index] = result.status === 'fulfilled' ? result.value : null;
    });

    return imageMap;
}

/**
 * Converts a remote image URL to a base64 data URI via an offscreen canvas,
 * cropping it to exact targetW × targetH pixels (eliminates PDF stretch).
 * Returns null if fetch or canvas fails.
 */
export async function fetchAndCropImage(
    url: string,
    targetW = 1860,
    targetH = 800
): Promise<{ data: string; format: 'JPEG' } | null> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');
                if (!ctx) { resolve(null); return; }

                // Cover-crop: scale so shortest side fills, then center-crop
                const srcRatio = img.width / img.height;
                const dstRatio = targetW / targetH;
                let drawW: number, drawH: number, offsetX: number, offsetY: number;

                if (srcRatio > dstRatio) {
                    drawH = targetH;
                    drawW = img.width * (targetH / img.height);
                    offsetX = -(drawW - targetW) / 2;
                    offsetY = 0;
                } else {
                    drawW = targetW;
                    drawH = img.height * (targetW / img.width);
                    offsetX = 0;
                    offsetY = -(drawH - targetH) / 2;
                }

                ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
                const data = canvas.toDataURL('image/jpeg', 0.88);
                resolve({ data, format: 'JPEG' });
            } catch {
                resolve(null);
            }
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

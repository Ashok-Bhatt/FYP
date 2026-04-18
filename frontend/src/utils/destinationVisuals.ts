import { destinations } from '../data/destinations';

type DestinationRecord = {
    name: string;
    image?: string;
    category?: string;
    brief?: string;
};

type DestinationVisual = {
    key: string;
    imageUrl: string | null;
    category: string | null;
    brief: string | null;
    displayName: string;
    source: 'curated' | 'none';
};

const curatedDestinations = destinations as DestinationRecord[];

const manualAliases: Record<string, string[]> = {
    kashmir: ['srinagar', 'gulmarg', 'sonmarg', 'pahalgam'],
    udaipur: ['lake pichola', 'mewar'],
    munnar: ['kerala hills', 'tea estates'],
    'bora bora': ['french polynesia'],
    maldives: ['male', 'atoll', 'noonu', 'dhoni'],
    zermatt: ['switzerland', 'matterhorn'],
    'amalfi coast': ['amalfi', 'positano', 'ravello', 'sorrento'],
    kyoto: ['japan', 'arashiyama', 'gion', 'fushimi'],
};

function normalizeValue(value: string): string {
    return value
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function createAliases(record: DestinationRecord): string[] {
    const normalizedName = normalizeValue(record.name);
    const primaryName = normalizeValue(record.name.split(',')[0] || record.name);
    const manual = manualAliases[primaryName] || [];

    return Array.from(
        new Set([
            normalizedName,
            primaryName,
            ...manual.map(normalizeValue),
        ])
    );
}

function toAbsoluteUrl(path: string | undefined): string | null {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    if (typeof window === 'undefined') return path;
    return new URL(path, window.location.origin).toString();
}

export function resolveDestinationVisual(destination: string): DestinationVisual {
    const normalizedDestination = normalizeValue(destination);

    const match = curatedDestinations.find((record) => {
        const aliases = createAliases(record);
        return aliases.some((alias) =>
            normalizedDestination === alias ||
            normalizedDestination.includes(alias) ||
            alias.includes(normalizedDestination)
        );
    });

    if (!match) {
        return {
            key: normalizedDestination || 'unknown',
            imageUrl: null,
            category: null,
            brief: null,
            displayName: destination || 'Destination',
            source: 'none',
        };
    }

    return {
        key: normalizeValue(match.name.split(',')[0] || match.name),
        imageUrl: toAbsoluteUrl(match.image),
        category: match.category || null,
        brief: match.brief || null,
        displayName: match.name,
        source: match.image ? 'curated' : 'none',
    };
}

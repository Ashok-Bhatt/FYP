import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUtensils, FaLightbulb, FaSyncAlt, FaSpinner, FaStar } from 'react-icons/fa';
import { ItineraryDay } from '../types';

interface Props {
    days: ItineraryDay[];
    destination: string;
    onRegenerate?: () => void;
    isRegenerating?: boolean;
}

const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY as string;

// Build a focused search query: "<activity keyword>, <destination>"
function buildQuery(activity: string, destination: string): string {
    // Extract the most meaningful words from the activity (skip common filler)
    const stop = new Set(['to', 'at', 'the', 'a', 'an', 'in', 'of', 'and', 'by', 'via', 'for', 'private', 'hotel']);
    const keywords = activity
        .split(/[\s,]+/)
        .filter(w => w.length > 3 && !stop.has(w.toLowerCase()))
        .slice(0, 3)
        .join(' ');
    return `${keywords} ${destination}`.trim();
}

// Fetch a single Pexels landscape photo URL for a given query
async function fetchPexelsPhoto(query: string): Promise<string | null> {
    if (!PEXELS_KEY) return null;
    try {
        const res = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&size=large`,
            { headers: { Authorization: PEXELS_KEY } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const photos: { src: { large2x: string } }[] = data.photos || [];
        if (photos.length === 0) return null;
        // Pick a photo based on the query hash for variety within a trip
        const pick = Math.abs(query.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)) % photos.length;
        return photos[pick].src.large2x;
    } catch {
        return null;
    }
}

// Reliable fallback image
function getFallbackImage(seed: number): string {
    return `https://picsum.photos/seed/${(seed * 37 + 7) % 1000}/800/360`;
}

const DAY_COLORS = [
    { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', badge: 'bg-emerald-500', text: 'text-emerald-400' },
    { bg: 'bg-blue-500/20',    border: 'border-blue-500/40',    badge: 'bg-blue-500',    text: 'text-blue-400'    },
    { bg: 'bg-purple-500/20',  border: 'border-purple-500/40',  badge: 'bg-purple-500',  text: 'text-purple-400'  },
    { bg: 'bg-amber-500/20',   border: 'border-amber-500/40',   badge: 'bg-amber-500',   text: 'text-amber-400'   },
    { bg: 'bg-rose-500/20',    border: 'border-rose-500/40',    badge: 'bg-rose-500',    text: 'text-rose-400'    },
    { bg: 'bg-teal-500/20',    border: 'border-teal-500/40',    badge: 'bg-teal-500',    text: 'text-teal-400'    },
    { bg: 'bg-indigo-500/20',  border: 'border-indigo-500/40',  badge: 'bg-indigo-500',  text: 'text-indigo-400'  },
];

const ItineraryTimeline: React.FC<Props> = ({ days, destination, onRegenerate, isRegenerating }) => {
    const itineraryKey = useMemo(
        () => JSON.stringify({ destination, days: days.map(day => ({ day: day.day, title: day.title, activities: day.activities })) }),
        [days, destination]
    );

    const [imageState, setImageState] = useState<{ key: string; images: Record<number, string> }>({
        key: '',
        images: {},
    });
    const images = imageState.key === itineraryKey ? imageState.images : {};

    // Fetch all Pexels images in parallel when days change
    useEffect(() => {
        if (!days.length) return;

        let cancelled = false;
        const activeKey = itineraryKey;

        days.forEach((day, idx) => {
            // Build query from the most interesting activity of the day + destination
            const query = buildQuery(day.activities[0] || destination, destination);
            fetchPexelsPhoto(query).then(url => {
                if (cancelled) return;
                setImageState(prev => {
                    const baseImages = prev.key === activeKey ? prev.images : {};
                    return {
                        key: activeKey,
                        images: {
                            ...baseImages,
                            [idx]: url ?? getFallbackImage(idx),
                        },
                    };
                });
            });
        });

        return () => {
            cancelled = true;
        };
    }, [days, destination, itineraryKey]);

    return (
        <div className="w-full">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                            🗓️
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-purple-400 font-semibold">AI-Generated</span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold bg-linear-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                        Day-by-Day Itinerary
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {days.length}-day curated travel plan for <span className="text-white">{destination}</span>
                    </p>
                </div>

                {onRegenerate && (
                    <button
                        onClick={onRegenerate}
                        disabled={isRegenerating}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-all text-sm font-medium disabled:opacity-50 no-print"
                    >
                        {isRegenerating ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
                        {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                    </button>
                )}
            </motion.div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical glowing connector */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-purple-500/50 via-pink-500/30 to-transparent hidden md:block" />

                <div className="space-y-8">
                    {days.map((day, index) => {
                        const color = DAY_COLORS[index % DAY_COLORS.length];
                        const imageUrl = images[index]; // undefined while loading

                        return (
                            <motion.div
                                key={day.day}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.08, ease: 'easeOut' }}
                                className="relative md:pl-16"
                            >
                                {/* Timeline badge */}
                                <div className={`absolute left-0 top-6 w-12 h-12 rounded-full ${color.badge} hidden md:flex flex-col items-center justify-center text-black text-xs font-extrabold shadow-lg z-10 leading-tight`}>
                                    <span className="text-[9px] font-bold opacity-80">Day</span>
                                    <span className="text-base">{day.day}</span>
                                </div>

                                {/* Card */}
                                <div className={`rounded-2xl border ${color.border} bg-zinc-900/60 backdrop-blur-sm overflow-hidden`}>

                                    {/* Hero image area */}
                                    <div className="relative h-52 overflow-hidden bg-zinc-800">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={`${destination} - ${day.title}`}
                                                className="w-full h-full object-cover transition-opacity duration-500"
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            /* Skeleton shimmer while loading */
                                            <div className="w-full h-full animate-pulse bg-linear-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-size-[200%_100%]" />
                                        )}

                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

                                        {/* Day badge on image */}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-black ${color.badge} shadow-lg`}>
                                                Day {day.day}
                                            </span>
                                        </div>

                                        {/* Photo credit */}
                                        {imageUrl && PEXELS_KEY && (
                                            <div className="absolute top-4 right-4">
                                                <span className="text-[10px] text-white/50 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                                                    📷 Pexels
                                                </span>
                                            </div>
                                        )}

                                        {/* Title overlay */}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white drop-shadow-lg">{day.title}</h3>
                                            {day.highlight && (
                                                <p className="text-sm text-gray-300 mt-1 italic drop-shadow">"{day.highlight}"</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="p-6 space-y-5">

                                        {/* Activities */}
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                                <FaMapMarkerAlt className={color.text} /> Activities
                                            </h4>
                                            <ul className="space-y-2">
                                                {day.activities.map((activity: string, ai: number) => (
                                                    <li key={ai} className="flex items-start gap-3 text-sm text-gray-300">
                                                        <span className={`mt-0.5 w-5 h-5 rounded-full ${color.badge} shrink-0 flex items-center justify-center text-black text-xs font-bold`}>
                                                            {ai + 1}
                                                        </span>
                                                        {activity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Meals */}
                                            {day.meals && day.meals.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                                        <FaUtensils className="text-orange-400" /> Meals
                                                    </h4>
                                                    <ul className="space-y-1.5">
                                                        {day.meals.map((meal: string, mi: number) => (
                                                            <li key={mi} className="text-sm text-gray-400 flex items-start gap-2">
                                                                <span className="text-orange-400 mt-0.5">🍽</span> {meal}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Accommodation */}
                                            <div>
                                                <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                                    <FaStar className="text-yellow-400" /> Stay
                                                </h4>
                                                <div className="flex items-start gap-2 text-sm text-gray-300">
                                                    <span className="text-yellow-400 mt-0.5">🏨</span>
                                                    <span>{day.accommodation}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pro Tip */}
                                        {day.tips && (
                                            <div className={`${color.bg} border ${color.border} rounded-xl px-4 py-3 flex items-start gap-3`}>
                                                <FaLightbulb className={`${color.text} mt-0.5 shrink-0`} />
                                                <div>
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${color.text}`}>Pro Tip</span>
                                                    <p className="text-sm text-gray-300 mt-0.5">{day.tips}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: days.length * 0.08 + 0.3 }}
                className="mt-10 flex items-center justify-center gap-3 text-gray-600 text-sm"
            >
                <div className="h-px flex-1 bg-white/5" />
                <span className="px-4">✨ Generated by AI · Powered by Llama 4 Scout via Groq</span>
                <div className="h-px flex-1 bg-white/5" />
            </motion.div>
        </div>
    );
};

export default ItineraryTimeline;


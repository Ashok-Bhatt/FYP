/**
 * ItineraryTimeline.tsx
 *
 * Skills applied:
 *  - frontend-design  : Luxury travel editorial aesthetic, dark glass cards
 *  - design-spells    : Shimmer skeleton while images load, crossfade reveal
 *  - animejs-animation: Staggered card entrance with spring easing
 */

import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { motion } from 'framer-motion';
import {
    FaMapMarkerAlt, FaUtensils, FaLightbulb, FaSyncAlt,
    FaSpinner, FaStar, FaCheckCircle, FaCamera,
} from 'react-icons/fa';
import { ItineraryDay } from '../types';
import { resolveDestinationVisual } from '../utils/destinationVisuals';
import { fetchAllDayImages } from '../utils/pexelsService';

interface Props {
    days: ItineraryDay[];
    destination: string;
    pexelsKey?: string;
    onRegenerate?: () => void;
    isRegenerating?: boolean;
}

const DAY_PALETTES = [
    { border: 'border-emerald-400/25', accent: 'bg-emerald-400', soft: 'bg-emerald-400/10', text: 'text-emerald-300', hex: '#34d399' },
    { border: 'border-sky-400/25',     accent: 'bg-sky-400',     soft: 'bg-sky-400/10',     text: 'text-sky-300',     hex: '#60a5fa' },
    { border: 'border-violet-400/25',  accent: 'bg-violet-400',  soft: 'bg-violet-400/10',  text: 'text-violet-300',  hex: '#a78bfa' },
    { border: 'border-amber-400/25',   accent: 'bg-amber-400',   soft: 'bg-amber-400/10',   text: 'text-amber-300',   hex: '#fbbf24' },
    { border: 'border-rose-400/25',    accent: 'bg-rose-400',    soft: 'bg-rose-400/10',    text: 'text-rose-300',    hex: '#fb7185' },
    { border: 'border-teal-400/25',    accent: 'bg-teal-400',    soft: 'bg-teal-400/10',    text: 'text-teal-300',    hex: '#2dd4bf' },
    { border: 'border-indigo-400/25',  accent: 'bg-indigo-400',  soft: 'bg-indigo-400/10',  text: 'text-indigo-300',  hex: '#818cf8' },
];

// ── Shimmer skeleton (design-spells) ─────────────────────────────────────────
const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div
        className={`relative overflow-hidden bg-zinc-800/60 ${className}`}
        style={{ '--shimmer-color': '#2a2a36' } as React.CSSProperties}
    >
        <div
            className="absolute inset-0"
            style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'itinerary-shimmer 1.6s infinite linear',
            }}
        />
        <style>{`
            @keyframes itinerary-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        `}</style>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const ItineraryTimeline: React.FC<Props> = ({
    days, destination, pexelsKey, onRegenerate, isRegenerating,
}) => {
    const destVisual = resolveDestinationVisual(destination);
    const [dayImages, setDayImages] = useState<Record<number, string | null>>({});
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const cardsRef = useRef<HTMLDivElement>(null);
    const animatedRef = useRef(false);

    // Fetch unique Pexels images for each day (design-spells: async fade-in)
    useEffect(() => {
        if (!pexelsKey || !days.length) {
            setImagesLoaded(true);
            return;
        }
        setImagesLoaded(false);
        fetchAllDayImages(days, destination, pexelsKey).then(map => {
            setDayImages(map);
            setImagesLoaded(true);
        });
    }, [days, destination, pexelsKey]);

    // Anime.js staggered card entrance (animejs-animation skill)
    useEffect(() => {
        if (!cardsRef.current || animatedRef.current) return;
        const cards = cardsRef.current.querySelectorAll<HTMLElement>('.day-card');
        if (!cards.length) return;

        animatedRef.current = true;
        anime({
            targets: cards,
            translateY: [48, 0],
            opacity: [0, 1],
            duration: 700,
            delay: anime.stagger(90, { start: 60 }),
            easing: 'spring(1, 80, 10, 0)',
        });
    }, [days, imagesLoaded]);

    return (
        <div className="w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center"
            >
                <div>
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-bold text-black shadow-lg shadow-emerald-400/20">
                            AI
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">
                            AI-generated itinerary
                        </span>
                    </div>
                    <h2 className="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-3xl font-serif font-bold text-transparent">
                        Day-by-Day Journey
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-white/50">
                        Built for <span className="text-white">{destination}</span> with live destination photography and AI-crafted narrative.
                    </p>
                </div>

                {onRegenerate ? (
                    <button
                        onClick={onRegenerate}
                        disabled={isRegenerating}
                        className="no-print inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition-all hover:border-emerald-300/40 hover:bg-emerald-400/15 disabled:opacity-50"
                    >
                        {isRegenerating ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
                        {isRegenerating ? 'Regenerating…' : 'Regenerate'}
                    </button>
                ) : null}
            </motion.div>

            {/* Timeline */}
            <div className="relative" ref={cardsRef}>
                {/* Vertical connector line */}
                <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-emerald-400/40 via-cyan-400/20 to-transparent md:block" />

                <div className="space-y-8">
                    {days.map((day, index) => {
                        const palette = DAY_PALETTES[index % DAY_PALETTES.length];
                        const pexelsUrl = dayImages[index] ?? null;
                        // Fall back to curated destination image if no Pexels result
                        const imgSrc = pexelsUrl ?? destVisual.imageUrl;
                        const isLivePhoto = !!pexelsUrl;

                        return (
                            <div
                                key={`${day.day}-${day.title}`}
                                className="day-card relative md:pl-16"
                                style={{ opacity: 0 }} // Anime.js will animate this to 1
                            >
                                {/* Day badge on timeline */}
                                <div className={`absolute left-0 top-6 z-10 hidden h-12 w-12 flex-col items-center justify-center rounded-full ${palette.accent} text-xs font-extrabold text-black shadow-lg md:flex`}>
                                    <span className="text-[9px] uppercase opacity-70">Day</span>
                                    <span className="text-base">{day.day}</span>
                                </div>

                                <div className={`overflow-hidden rounded-[28px] border ${palette.border} bg-zinc-900/80 backdrop-blur-xl shadow-[0_20px_64px_rgba(0,0,0,0.35)]`}>

                                    {/* Image section */}
                                    <div className="relative h-60 overflow-hidden">
                                        {/* Shimmer while loading (design-spells) */}
                                        {!imagesLoaded && (
                                            <Shimmer className="absolute inset-0 rounded-none h-full w-full" />
                                        )}

                                        {imagesLoaded && imgSrc ? (
                                            <img
                                                src={imgSrc}
                                                alt={`${destination} — ${day.title}`}
                                                className="h-full w-full object-cover transition-opacity duration-700"
                                                style={{ objectPosition: 'center 40%' }}
                                            />
                                        ) : imagesLoaded ? (
                                            // No image available — styled color gradient
                                            <div
                                                className="h-full w-full"
                                                style={{
                                                    background: `radial-gradient(circle at 30% 40%, ${palette.hex}28, transparent 55%), linear-gradient(145deg, #0f172a, #070c17)`,
                                                }}
                                            />
                                        ) : null}

                                        {/* Bottom gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                                        {/* Badges */}
                                        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                                            <span className={`rounded-full px-3 py-1.5 text-xs font-bold text-black ${palette.accent}`}>
                                                Day {day.day}
                                            </span>
                                            {isLivePhoto ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
                                                    <FaCamera className="text-sky-300" size={10} /> Live Photo
                                                </span>
                                            ) : destVisual.source === 'curated' ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
                                                    <FaCheckCircle className="text-emerald-300" size={10} /> Verified Visual
                                                </span>
                                            ) : null}
                                        </div>

                                        {/* Title overlay */}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            {destVisual.category && !isLivePhoto && (
                                                <div className={`mb-2 inline-flex items-center rounded-full border border-white/10 ${palette.soft} px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${palette.text}`}>
                                                    {destVisual.category}
                                                </div>
                                            )}
                                            <h3 className="text-2xl font-bold text-white drop-shadow-lg">{day.title}</h3>
                                            {day.highlight ? (
                                                <p className="mt-2 max-w-3xl text-sm italic text-white/70 drop-shadow">
                                                    "{day.highlight}"
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Content grid */}
                                    <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">

                                        {/* Activities */}
                                        <div>
                                            <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                                                <FaMapMarkerAlt className={palette.text} /> Activities
                                            </h4>
                                            <ul className="space-y-3">
                                                {day.activities.map((activity, ai) => (
                                                    <li key={`${activity}-${ai}`} className="flex items-start gap-3 text-sm text-gray-300">
                                                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${palette.accent} text-xs font-bold text-black`}>
                                                            {ai + 1}
                                                        </span>
                                                        <span className="leading-6">{activity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Meals & Stay */}
                                        <div className="space-y-4">
                                            {day.meals?.length ? (
                                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                                    <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                                                        <FaUtensils className="text-amber-300" /> Meals
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {day.meals.map((meal, mi) => (
                                                            <li key={`${meal}-${mi}`} className="text-sm text-gray-300 leading-5">
                                                                {meal}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : null}

                                            {day.accommodation ? (
                                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                                    <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                                                        <FaStar className="text-yellow-300" /> Stay
                                                    </h4>
                                                    <p className="text-sm leading-6 text-gray-300">{day.accommodation}</p>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Pro Tip */}
                                    {day.tips ? (
                                        <div className="px-6 pb-6">
                                            <div className={`flex items-start gap-3 rounded-2xl border ${palette.border} ${palette.soft} px-4 py-4`}>
                                                <FaLightbulb className={`${palette.text} mt-0.5 shrink-0`} />
                                                <div>
                                                    <span className={`text-xs font-bold uppercase tracking-[0.2em] ${palette.text}`}>Pro Tip</span>
                                                    <p className="mt-1 text-sm leading-6 text-gray-300">{day.tips}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: days.length * 0.09 + 0.3 }}
                className="mt-10 flex items-center justify-center gap-3 text-sm text-white/30"
            >
                <div className="h-px flex-1 bg-white/6" />
                <span className="px-4">Styled by VoyageGen AI · Live photography from Pexels</span>
                <div className="h-px flex-1 bg-white/6" />
            </motion.div>
        </div>
    );
};

export default ItineraryTimeline;

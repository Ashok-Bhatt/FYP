import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUtensils, FaLightbulb, FaSyncAlt, FaSpinner, FaStar, FaCheckCircle } from 'react-icons/fa';
import { ItineraryDay } from '../types';
import { resolveDestinationVisual } from '../utils/destinationVisuals';

interface Props {
    days: ItineraryDay[];
    destination: string;
    onRegenerate?: () => void;
    isRegenerating?: boolean;
}

const DAY_COLORS = [
    {
        border: 'border-emerald-400/30',
        accent: 'bg-emerald-400',
        soft: 'bg-emerald-400/10',
        text: 'text-emerald-300',
        ring: 'ring-emerald-400/25',
    },
    {
        border: 'border-sky-400/30',
        accent: 'bg-sky-400',
        soft: 'bg-sky-400/10',
        text: 'text-sky-300',
        ring: 'ring-sky-400/25',
    },
    {
        border: 'border-violet-400/30',
        accent: 'bg-violet-400',
        soft: 'bg-violet-400/10',
        text: 'text-violet-300',
        ring: 'ring-violet-400/25',
    },
    {
        border: 'border-amber-400/30',
        accent: 'bg-amber-400',
        soft: 'bg-amber-400/10',
        text: 'text-amber-300',
        ring: 'ring-amber-400/25',
    },
    {
        border: 'border-rose-400/30',
        accent: 'bg-rose-400',
        soft: 'bg-rose-400/10',
        text: 'text-rose-300',
        ring: 'ring-rose-400/25',
    },
];

const ItineraryTimeline: React.FC<Props> = ({ days, destination, onRegenerate, isRegenerating }) => {
    const destinationVisual = resolveDestinationVisual(destination);

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center"
            >
                <div>
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm text-black shadow-lg shadow-emerald-400/20">
                            AI
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">AI-generated itinerary</span>
                    </div>
                    <h2 className="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-3xl font-serif font-bold text-transparent">
                        Day-by-Day Journey
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-white/55">
                        Built for <span className="text-white">{destination}</span> with verified destination visuals so the storytelling and imagery stay aligned.
                    </p>
                </div>

                {onRegenerate ? (
                    <button
                        onClick={onRegenerate}
                        disabled={isRegenerating}
                        className="no-print inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition-all hover:border-emerald-300/40 hover:bg-emerald-400/15 disabled:opacity-50"
                    >
                        {isRegenerating ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
                        {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                    </button>
                ) : null}
            </motion.div>

            <div className="relative">
                <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-emerald-400/40 via-cyan-400/20 to-transparent md:block" />

                <div className="space-y-8">
                    {days.map((day, index) => {
                        const palette = DAY_COLORS[index % DAY_COLORS.length];

                        return (
                            <motion.div
                                key={`${day.day}-${day.title}`}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.08, ease: 'easeOut' }}
                                className="relative md:pl-16"
                            >
                                <div className={`absolute left-0 top-6 z-10 hidden h-12 w-12 flex-col items-center justify-center rounded-full ${palette.accent} text-xs font-extrabold text-black shadow-lg md:flex`}>
                                    <span className="text-[9px] uppercase opacity-70">Day</span>
                                    <span className="text-base">{day.day}</span>
                                </div>

                                <div className={`overflow-hidden rounded-[28px] border ${palette.border} bg-zinc-900/75 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.28)]`}>
                                    <div className="relative h-60 overflow-hidden">
                                        {destinationVisual.imageUrl ? (
                                            <img
                                                src={destinationVisual.imageUrl}
                                                alt={`${destination} - ${day.title}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.28),_transparent_36%),linear-gradient(145deg,rgba(15,23,42,0.98),rgba(7,12,23,0.98))]" />
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent" />

                                        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                                            <span className={`rounded-full px-3 py-1.5 text-xs font-bold text-black ${palette.accent}`}>
                                                Day {day.day}
                                            </span>
                                            {destinationVisual.source === 'curated' ? (
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
                                                    <FaCheckCircle className="text-emerald-300" />
                                                    Verified Destination Visual
                                                </span>
                                            ) : (
                                                <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
                                                    Destination-safe layout
                                                </span>
                                            )}
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4">
                                            {destinationVisual.category ? (
                                                <div className={`mb-3 inline-flex items-center rounded-full border border-white/10 ${palette.soft} px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${palette.text}`}>
                                                    {destinationVisual.category}
                                                </div>
                                            ) : null}
                                            <h3 className="text-2xl font-bold text-white drop-shadow-lg">{day.title}</h3>
                                            {day.highlight ? (
                                                <p className="mt-2 max-w-3xl text-sm italic text-white/75 drop-shadow">
                                                    "{day.highlight}"
                                                </p>
                                            ) : destinationVisual.brief ? (
                                                <p className="mt-2 max-w-3xl text-sm text-white/70 drop-shadow">
                                                    {destinationVisual.brief}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
                                        <div>
                                            <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                                                <FaMapMarkerAlt className={palette.text} /> Activities
                                            </h4>
                                            <ul className="space-y-3">
                                                {day.activities.map((activity, activityIndex) => (
                                                    <li key={`${activity}-${activityIndex}`} className="flex items-start gap-3 text-sm text-gray-300">
                                                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${palette.accent} text-xs font-bold text-black`}>
                                                            {activityIndex + 1}
                                                        </span>
                                                        <span className="leading-6">{activity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            {day.meals?.length ? (
                                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                                    <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                                                        <FaUtensils className="text-amber-300" /> Meals
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {day.meals.map((meal, mealIndex) => (
                                                            <li key={`${meal}-${mealIndex}`} className="text-sm text-gray-300">
                                                                {meal}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : null}

                                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                                <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                                                    <FaStar className="text-yellow-300" /> Stay
                                                </h4>
                                                <p className="text-sm leading-6 text-gray-300">{day.accommodation}</p>
                                            </div>
                                        </div>
                                    </div>

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
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: days.length * 0.08 + 0.3 }}
                className="mt-10 flex items-center justify-center gap-3 text-sm text-white/35"
            >
                <div className="h-px flex-1 bg-white/6" />
                <span className="px-4">Styled by VoyageGen AI and grounded to curated destination visuals</span>
                <div className="h-px flex-1 bg-white/6" />
            </motion.div>
        </div>
    );
};

export default ItineraryTimeline;

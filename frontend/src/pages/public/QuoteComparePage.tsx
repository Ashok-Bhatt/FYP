import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSpinner, FaTimesCircle, FaHotel, FaTicketAlt,
    FaCheckCircle, FaStar, FaMapMarkerAlt, FaChevronDown, FaChevronUp,
    FaMoneyBillWave, FaUsers, FaCalendarAlt, FaTrophy, FaTh,
} from 'react-icons/fa';

// ─── Types ───────────────────────────────────────────────────────────────────

interface HotelSummary {
    name: string;
    rating?: number;
    location: string;
    roomType: string;
    nights: number;
    amenities: string[];
}

interface ActivitySummary {
    name: string;
    duration: string;
    included: boolean;
    category: string;
}

interface QuoteData {
    _id: string;
    partner: {
        _id: string;
        name: string;
        rating?: number;
        totalReviews?: number;
        logo?: string;
        specialties?: string[];
    };
    costs: {
        net: number;
        margin: number;
        final: number;
        perHead: number;
        breakdown: {
            hotels: number;
            transport: number;
            activities: number;
            other: number;
        };
    };
    hotels: HotelSummary[];
    itinerary: any[];
    activities: ActivitySummary[];
}

interface ComparisonInsights {
    cheapestQuoteId: string;
    highestRatedQuoteId: string;
    mostActivitiesQuoteId: string;
    bestValueQuoteId: string;
    priceRange: { min: number; max: number };
    averageRating: number;
    totalQuotes: number;
}

interface ComparisonData {
    requirement: {
        _id: string;
        destination: string;
        duration?: number;
        pax?: { adults: number; children: number };
        contactInfo?: { name?: string };
    };
    quotes: QuoteData[];
    insights: ComparisonInsights;
    compareToken: string;
}

// ─── Badge Component ─────────────────────────────────────────────────────────

const Badge = ({ label, icon, color }: { label: string; icon: React.ReactNode; color: string }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
        {icon} {label}
    </span>
);

// ─── Star Rating Component ────────────────────────────────────────────────────

const StarRating = ({ rating }: { rating?: number }) => {
    if (!rating) return <span className="text-gray-600 text-xs">No rating</span>;
    return (
        <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
            <FaStar /> {rating.toFixed(1)}
        </span>
    );
};

// ─── Itinerary Accordion ─────────────────────────────────────────────────────

const ItineraryAccordion = ({ itinerary }: { itinerary: any[] }) => {
    const [open, setOpen] = useState(false);
    if (!itinerary || itinerary.length === 0) {
        return <p className="text-gray-600 text-sm italic">No itinerary generated yet</p>;
    }
    return (
        <div>
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-white transition-colors py-2 border-b border-white/10"
            >
                <span className="font-medium">{itinerary.length}-Day Itinerary</span>
                {open ? <FaChevronUp className="text-xs text-emerald-400" /> : <FaChevronDown className="text-xs text-gray-500" />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {itinerary.map((day: any, i: number) => (
                                <div key={i} className="flex gap-2 text-xs">
                                    <span className="shrink-0 w-14 text-emerald-400 font-bold">Day {day.day}</span>
                                    <div>
                                        <p className="text-gray-200 font-medium">{day.title}</p>
                                        {day.highlight && <p className="text-gray-500">{day.highlight}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Quote Column ─────────────────────────────────────────────────────────────

interface QuoteColumnProps {
    quote: QuoteData;
    insights: ComparisonInsights;
    cheapestFinal: number;
    accepted: string | null;
    accepting: string | null;
    onAccept: (quoteId: string) => void;
}

const QuoteColumn: React.FC<QuoteColumnProps> = ({ quote, insights, cheapestFinal, accepted, accepting, onAccept }) => {
    const isCheapest = insights.cheapestQuoteId === quote._id;
    const isTopRated = insights.highestRatedQuoteId === quote._id;
    const isMostActivities = insights.mostActivitiesQuoteId === quote._id;
    const isBestValue = insights.bestValueQuoteId === quote._id;
    const priceDiff = quote.costs.final - cheapestFinal;
    const isAccepted = accepted === quote._id;
    const isOtherAccepted = accepted !== null && accepted !== quote._id;
    const isAccepting = accepting === quote._id;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative flex flex-col rounded-2xl border transition-all duration-500 overflow-hidden ${
                isAccepted
                    ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20 ring-1 ring-emerald-500/40'
                    : isOtherAccepted
                    ? 'border-white/5 opacity-40 scale-[0.98]'
                    : isCheapest
                    ? 'border-emerald-500/30 shadow-xl shadow-emerald-500/10'
                    : 'border-white/10 hover:border-white/20 hover:shadow-xl'
            }`}
        >
            {/* Accepted overlay banner */}
            {isAccepted && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-emerald-500 text-black text-center py-2 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaCheckCircle /> You chose this package
                </div>
            )}

            {/* Top accent line */}
            <div className={`h-1 w-full ${
                isAccepted ? 'bg-emerald-400' :
                isBestValue ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                isCheapest ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                isTopRated ? 'bg-gradient-to-r from-blue-400 to-purple-400' :
                'bg-white/10'
            }`} />

            <div className={`flex-1 flex flex-col p-6 space-y-5 bg-zinc-900/80 ${isAccepted ? 'pt-10' : ''}`}>

                {/* Partner Header */}
                <div>
                    <h3 className="text-lg font-serif font-bold text-white leading-tight">{quote.partner.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <StarRating rating={quote.partner.rating} />
                        {quote.partner.totalReviews ? (
                            <span className="text-gray-600 text-xs">({quote.partner.totalReviews} reviews)</span>
                        ) : null}
                    </div>

                    {/* Specialties */}
                    {quote.partner.specialties && quote.partner.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {quote.partner.specialties.slice(0, 3).map((s, i) => (
                                <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-gray-400">
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Comparison Badges */}
                <div className="flex flex-wrap gap-1.5">
                    {isCheapest && <Badge label="Best Price" icon="💰" color="border-emerald-500/40 text-emerald-400 bg-emerald-500/10" />}
                    {isTopRated && <Badge label="Top Rated" icon="⭐" color="border-blue-500/40 text-blue-400 bg-blue-500/10" />}
                    {isMostActivities && <Badge label="Most Activities" icon="🏄" color="border-purple-500/40 text-purple-400 bg-purple-500/10" />}
                    {isBestValue && !isCheapest && <Badge label="Best Value" icon="✨" color="border-yellow-500/40 text-yellow-400 bg-yellow-500/10" />}
                </div>

                {/* Price Block */}
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Price</p>
                            <p className="text-3xl font-black text-white">
                                ₹{quote.costs.final.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">per person</p>
                            <p className="text-lg font-bold text-emerald-400">
                                ₹{Math.round(quote.costs.perHead).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>

                    {/* Price difference callout */}
                    {priceDiff > 0 && !isCheapest && (
                        <p className="mt-2 text-xs text-amber-400/80 font-medium">
                            +₹{priceDiff.toLocaleString('en-IN')} vs cheapest option
                        </p>
                    )}

                    {/* Cost breakdown mini-bars */}
                    <div className="mt-3 space-y-1.5">
                        {[
                            { label: 'Hotel', val: quote.costs.breakdown.hotels, color: 'bg-blue-500' },
                            { label: 'Transport', val: quote.costs.breakdown.transport, color: 'bg-purple-500' },
                            { label: 'Activities', val: quote.costs.breakdown.activities, color: 'bg-emerald-500' },
                        ].filter(b => b.val > 0).map(b => (
                            <div key={b.label} className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="w-14 shrink-0">{b.label}</span>
                                <div className="flex-1 bg-white/5 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full ${b.color}`}
                                        style={{ width: `${Math.min(100, (b.val / quote.costs.net) * 100)}%` }}
                                    />
                                </div>
                                <span className="w-20 text-right shrink-0">₹{b.val.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hotels */}
                {quote.hotels.length > 0 && (
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2 mb-2">
                            <FaHotel className="text-blue-400" /> Accommodation
                        </p>
                        <div className="space-y-2">
                            {quote.hotels.map((h, i) => (
                                <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/5">
                                    <p className="text-sm font-semibold text-white">{h.name}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                        <FaMapMarkerAlt className="text-gray-600" />
                                        {h.location} · {h.roomType} · {h.nights} nights
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Activities */}
                {quote.activities.length > 0 && (
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2 mb-2">
                            <FaTicketAlt className="text-purple-400" /> Activities
                        </p>
                        <ul className="space-y-1">
                            {quote.activities.map((a, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                    <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
                                    {a.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Itinerary Accordion */}
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2 mb-2">
                        <FaCalendarAlt className="text-emerald-400" /> Itinerary Preview
                    </p>
                    <ItineraryAccordion itinerary={quote.itinerary} />
                </div>

                {/* Spacer to push CTA to bottom */}
                <div className="flex-1" />

                {/* Accept CTA */}
                {!isOtherAccepted && !isAccepted && (
                    <button
                        onClick={() => onAccept(quote._id)}
                        disabled={isAccepting || accepted !== null}
                        className={`w-full py-4 rounded-xl font-black text-base transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${
                            isCheapest
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-black shadow-emerald-500/30 hover:shadow-emerald-500/50'
                                : 'bg-white hover:bg-emerald-400 text-black shadow-white/10 hover:shadow-emerald-400/30'
                        }`}
                    >
                        {isAccepting ? (
                            <><FaSpinner className="animate-spin" /> Confirming...</>
                        ) : (
                            'Accept This Quote'
                        )}
                    </button>
                )}

                {isAccepted && (
                    <div className="w-full py-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-base flex items-center justify-center gap-2">
                        <FaCheckCircle /> Quote Accepted!
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const QuoteComparePage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [data, setData] = useState<ComparisonData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accepting, setAccepting] = useState<string | null>(null);
    const [accepted, setAccepted] = useState<string | null>(null);

    useEffect(() => {
        const fetchComparison = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/quotes/compare/by-token?token=${token}`
                );
                setData(res.data);
            } catch (err: any) {
                const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to load comparison';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchComparison();
    }, [token]);

    const handleAccept = async (quoteId: string) => {
        if (!data || accepted) return;
        setAccepting(quoteId);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/quotes/${quoteId}/accept`,
                { token: data.compareToken }
            );
            setAccepted(quoteId);
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Failed to accept quote. Please try again.';
            alert(msg);
        } finally {
            setAccepting(null);
        }
    };

    // ── Loading ──────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
                <FaSpinner className="animate-spin text-4xl text-emerald-500" />
                <p className="text-gray-500 text-sm">Loading your comparison…</p>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────
    if (error || !data) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center gap-6">
                <FaTimesCircle className="text-6xl text-red-500" />
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Link Unavailable</h1>
                    <p className="text-gray-400 max-w-sm">{error || 'This comparison link is invalid or has expired.'}</p>
                </div>
                <p className="text-gray-600 text-sm">Please contact your travel agent for a new link.</p>
            </div>
        );
    }

    const { requirement, quotes, insights } = data;
    const cheapestFinal = quotes.length > 0 ? Math.min(...quotes.map(q => q.costs.final)) : 0;
    const hasQuotes = quotes.length > 0;

    // ── No quotes sent yet ────────────────────────────────────
    if (!hasQuotes) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center gap-6">
                <FaTh className="text-6xl text-gray-700" />
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">No Quotes Ready Yet</h1>
                    <p className="text-gray-400 max-w-sm">
                        Your travel agent hasn't sent any quotes for this trip yet. Check back soon!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-gray-200 font-sans selection:bg-emerald-500 selection:text-white">

            {/* ── Page Header ── */}
            <div className="relative overflow-hidden border-b border-white/5 bg-black/50">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-blue-950/20" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-3">
                            VoyageGen · Travel Quote Comparison
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
                            Choose Your Perfect Trip to{' '}
                            <span className="text-emerald-400">{requirement.destination}</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Compare {quotes.length} curated package{quotes.length > 1 ? 's' : ''} and accept the one that's right for you.
                        </p>
                    </motion.div>

                    {/* Trip metadata chips */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-3 mt-6"
                    >
                        {requirement.duration && (
                            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300">
                                <FaCalendarAlt className="text-emerald-400" />
                                {requirement.duration} Days
                            </span>
                        )}
                        {requirement.pax && (
                            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300">
                                <FaUsers className="text-emerald-400" />
                                {requirement.pax.adults} Adult{requirement.pax.adults !== 1 ? 's' : ''}
                                {requirement.pax.children > 0 ? `, ${requirement.pax.children} Child${requirement.pax.children !== 1 ? 'ren' : ''}` : ''}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300">
                            <FaMoneyBillWave className="text-emerald-400" />
                            {quotes.length} Packages
                        </span>
                        {insights.priceRange.min > 0 && (
                            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300">
                                <FaTrophy className="text-yellow-400" />
                                ₹{insights.priceRange.min.toLocaleString('en-IN')} – ₹{insights.priceRange.max.toLocaleString('en-IN')}
                            </span>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* ── Accepted Banner ── */}
            <AnimatePresence>
                {accepted && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-emerald-500 text-black text-center py-3 font-bold text-sm flex items-center justify-center gap-2"
                    >
                        <FaCheckCircle />
                        You've accepted a quote! Your travel agent will be in touch shortly. All other options have been automatically declined.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Comparison Grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* Mobile hint */}
                <p className="text-center text-xs text-gray-600 mb-6 md:hidden">
                    ← Scroll horizontally to compare all packages →
                </p>

                <div className="overflow-x-auto pb-4">
                    <div
                        className="grid gap-6"
                        style={{
                            gridTemplateColumns: `repeat(${quotes.length}, minmax(280px, 1fr))`,
                            minWidth: quotes.length > 1 ? `${quotes.length * 300}px` : '100%',
                        }}
                    >
                        {quotes.map((quote, idx) => (
                            <motion.div
                                key={quote._id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <QuoteColumn
                                    quote={quote}
                                    insights={insights}
                                    cheapestFinal={cheapestFinal}
                                    accepted={accepted}
                                    accepting={accepting}
                                    onAccept={handleAccept}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── After accept message ── */}
                {accepted && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 max-w-xl mx-auto text-center bg-zinc-900 border border-emerald-500/20 rounded-2xl p-8"
                    >
                        <FaCheckCircle className="text-5xl text-emerald-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">You're all set!</h2>
                        <p className="text-gray-400">
                            Your travel agent has been notified. They'll connect with you at{' '}
                            <span className="text-white font-medium">
                                {requirement.contactInfo?.name ? `${requirement.contactInfo.name}'s` : 'your'} contact details
                            </span>{' '}
                            to finalize bookings and payment.
                        </p>
                        <p className="text-gray-600 text-sm mt-4">
                            All other quotes for this trip have been automatically declined.
                        </p>
                    </motion.div>
                )}

                {/* ── Footer note ── */}
                <div className="mt-12 text-center text-gray-600 text-xs">
                    <p>Prices are indicative and subject to availability. Contact your agent for confirmation.</p>
                    <p className="mt-1">This comparison link is valid for 7 days and is unique to your trip enquiry.</p>
                </div>
            </div>
        </div>
    );
};

export default QuoteComparePage;

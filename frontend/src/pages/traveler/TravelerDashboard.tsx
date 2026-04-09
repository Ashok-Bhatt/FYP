import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
    FaMapMarkerAlt,
    FaUsers,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaSuitcase,
    FaClock,
    FaStar,
    FaArrowRight,
    FaPlane,
    FaEye,
    FaFileInvoiceDollar,
} from 'react-icons/fa';

const TravelerDashboard: React.FC = () => {
    const { user } = useAuth();
    const token = user?.token || '';
    const [requirements, setRequirements] = useState<any[]>([]);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const [requirementsResponse, quotesResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/requirements/user`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/quotes/user`, { headers }),
                ]);

                setRequirements(requirementsResponse.data);
                setQuotes(quotesResponse.data);
            } catch (error) {
                console.error('Error fetching traveler dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    const getStatusTheme = (status: string) => {
        switch (status) {
            case 'NEW':
                return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
            case 'IN_PROGRESS':
                return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            case 'QUOTES_READY':
                return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
            case 'SENT_TO_USER':
                return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            case 'COMPLETED':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getRequirementQuoteCount = (requirementId: string) =>
        quotes.filter((quote) => quote.requirementId?._id === requirementId || quote.requirementId === requirementId).length;

    const activeRequestsCount = requirements.filter((requirement) =>
        ['NEW', 'IN_PROGRESS', 'QUOTES_READY', 'SENT_TO_USER'].includes(requirement.status)
    ).length;
    const readyQuotesCount = quotes.filter((quote) => quote.status === 'SENT_TO_USER').length;
    const acceptedQuotesCount = quotes.filter((quote) => quote.status === 'ACCEPTED').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-emerald-400 mx-auto mb-4" />
                    <div className="text-white text-xl font-medium">Loading your dashboard...</div>
                    <div className="text-gray-400 text-sm mt-2">Fetching your trips and live quote updates</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/55 bg-clip-text text-transparent mb-2">
                        My Trips
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Track every request, see how many quotes are ready, and jump straight into the offers that matter.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12"
                >
                    {[
                        { label: 'Trip Requests', value: requirements.length, icon: <FaSuitcase />, color: 'text-sky-300' },
                        { label: 'Quotes Received', value: quotes.length, icon: <FaFileInvoiceDollar />, color: 'text-emerald-300' },
                        { label: 'Awaiting Review', value: readyQuotesCount, icon: <FaEye />, color: 'text-amber-300' },
                        { label: 'Accepted Trips', value: acceptedQuotesCount, icon: <FaStar />, color: 'text-fuchsia-300' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + index * 0.08 }}
                            className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_38%),linear-gradient(180deg,rgba(24,24,27,0.94),rgba(10,10,12,0.94))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                            </div>
                            <p className="text-sm font-medium text-white/60">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.45fr_0.95fr]"
                >
                    <div className="rounded-[32px] border border-emerald-400/15 bg-[linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,24,40,0.94)_60%)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
                        <div className="mb-8 flex items-start justify-between gap-6">
                            <div>
                                <div className="mb-3 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                                    Returning Traveler
                                </div>
                                <h2 className="text-3xl font-semibold text-white">
                                    You have {quotes.length} quote{quotes.length === 1 ? '' : 's'} across {requirements.length} trip plan{requirements.length === 1 ? '' : 's'}.
                                </h2>
                                <p className="mt-3 max-w-2xl text-base text-white/65">
                                    Open your latest quotes in one click or send a new trip brief if you want more options.
                                </p>
                            </div>
                            <div className="hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-4 lg:block">
                                <div className="text-xs uppercase tracking-[0.22em] text-white/35">Open Requests</div>
                                <div className="mt-2 text-4xl font-bold text-white">{activeRequestsCount}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/traveler/quotes"
                                className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition-transform hover:scale-[1.02]"
                            >
                                <FaEye />
                                See My Quotes
                            </Link>
                            <Link
                                to="/traveler/plan-journey"
                                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:border-emerald-300/40 hover:bg-white/10"
                            >
                                <FaPlane />
                                Plan Another Trip
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-white/10 bg-zinc-900/85 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/40">Snapshot</h3>
                        <div className="mt-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-white/8 pb-4">
                                <span className="text-white/65">Requests in motion</span>
                                <span className="text-2xl font-semibold text-white">{activeRequestsCount}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/8 pb-4">
                                <span className="text-white/65">Quotes ready to review</span>
                                <span className="text-2xl font-semibold text-white">{readyQuotesCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/65">Trips booked</span>
                                <span className="text-2xl font-semibold text-white">{acceptedQuotesCount}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">My Trip Requests</h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Every card shows the current trip status and how many quotes have already been generated.
                            </p>
                        </div>
                        <Link
                            to="/traveler/quotes"
                            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                        >
                            Open all quotes
                            <FaArrowRight />
                        </Link>
                    </div>

                    {requirements.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-12 text-center"
                        >
                            <FaSuitcase className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">No trips yet</h3>
                            <p className="text-gray-500 mb-6">Start planning your first journey and your quotes will show up here.</p>
                            <Link
                                to="/traveler/plan-journey"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-400 transition-colors"
                            >
                                <FaPlane />
                                Plan Your First Journey
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid gap-6">
                            {requirements.map((requirement, index) => {
                                const quoteCount = getRequirementQuoteCount(requirement._id);

                                return (
                                    <motion.div
                                        key={requirement._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 + index * 0.08 }}
                                    >
                                        <div className="rounded-[28px] border border-zinc-800/60 bg-zinc-900/70 p-8 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/25">
                                            <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-4 flex items-center gap-4">
                                                        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-3">
                                                            <FaMapMarkerAlt className="text-emerald-300 text-lg" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-white">{requirement.destination}</h3>
                                                            <p className="text-gray-400">{requirement.tripType}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                                                            <FaUsers className="text-emerald-300 text-sm" />
                                                            <span className="text-sm text-gray-300">
                                                                {requirement.pax.adults} Adults{requirement.pax.children > 0 ? `, ${requirement.pax.children} Children` : ''}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                                                            <FaCalendarAlt className="text-emerald-300 text-sm" />
                                                            <span className="text-sm text-gray-300">{requirement.duration || 0} Days</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                                                            <FaMoneyBillWave className="text-emerald-300 text-sm" />
                                                            <span className="text-sm text-gray-300">Rs {requirement.budget?.toLocaleString() || 'Not specified'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                                                            <FaStar className="text-emerald-300 text-sm" />
                                                            <span className="text-sm text-gray-300">{requirement.hotelStar || 0} Star Hotel</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-start gap-3 lg:items-end">
                                                    <span className={`rounded-full border px-4 py-2 text-sm font-bold ${getStatusTheme(requirement.status)}`}>
                                                        {requirement.status.replace(/_/g, ' ')}
                                                    </span>
                                                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                                                        {quoteCount} Quote{quoteCount === 1 ? '' : 's'}
                                                    </div>
                                                </div>
                                            </div>

                                            {requirement.description && (
                                                <div className="border-t border-white/8 pt-4">
                                                    <p className="text-sm text-gray-400 line-clamp-2">{requirement.description}</p>
                                                </div>
                                            )}

                                            <div className="mt-4 border-t border-white/8 pt-4">
                                                {quoteCount > 0 ? (
                                                    <Link
                                                        to={`/traveler/quotes/${requirement._id}`}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 font-medium text-emerald-300 transition-colors hover:bg-emerald-400/15"
                                                    >
                                                        <FaEye size={14} />
                                                        View {quoteCount} Quote{quoteCount === 1 ? '' : 's'}
                                                    </Link>
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/55">
                                                        <FaClock size={14} />
                                                        Quotes are still being prepared
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default TravelerDashboard;

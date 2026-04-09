import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    FaMapMarkerAlt, FaCalendarAlt, FaUser, FaHotel, FaPlane, FaTicketAlt,
    FaCheckCircle, FaTimesCircle, FaSpinner
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const PublicQuoteView: React.FC = () => {
    const { token } = useParams();
    const { isDark } = useTheme();
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/quotes/public/${token}`);
                setQuote(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load quote');
            } finally {
                setLoading(false);
            }
        };
        fetchQuote();
    }, [token]);

    const handleAction = async (status: 'ACCEPTED' | 'DECLINED') => {
        setActionLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/quotes/public/${token}/status`, { status });
            setQuote({ ...quote, status });
        } catch (err) {
            alert('Failed to update quote status. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-shell flex min-h-screen items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-shell flex min-h-screen flex-col items-center justify-center p-4">
                <FaTimesCircle className="mb-4 text-6xl text-red-500" />
                <h1 className="mb-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Oops!</h1>
                <p className="text-center" style={{ color: 'var(--text-muted)' }}>{error}</p>
            </div>
        );
    }

    if (!quote) return null;

    const requirement = quote.requirementId;

    return (
        <div className="page-shell min-h-screen px-4 py-12 font-sans selection:bg-emerald-500 selection:text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl p-8 text-center md:p-12"
                    style={{ background: 'var(--surface-strong)', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-soft)' }}
                >
                    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-400 to-blue-500" />

                    <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl" style={{ color: 'var(--text-primary)' }}>
                        Your Trip to {requirement.destination}
                    </h1>

                    <div className="mb-8 flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-2 rounded-full px-4 py-2" style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-soft)' }}>
                            <FaUser className="text-emerald-400" /> {requirement.contactInfo?.name}
                        </span>
                        <span className="flex items-center gap-2 rounded-full px-4 py-2" style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-soft)' }}>
                            <FaCalendarAlt className="text-emerald-400" /> {requirement.duration} Days
                        </span>
                        <span className="flex items-center gap-2 rounded-full px-4 py-2" style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-soft)' }}>
                            <FaMapMarkerAlt className="text-emerald-400" /> {requirement.tripType}
                        </span>
                    </div>

                    {quote.status === 'ACCEPTED' && (
                        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-6 py-3 font-bold text-emerald-400">
                            <FaCheckCircle className="text-xl" /> You have ACCEPTED this quote!
                        </div>
                    )}
                    {quote.status === 'DECLINED' && (
                        <div className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/20 px-6 py-3 font-bold text-red-400">
                            <FaTimesCircle className="text-xl" /> You have DECLINED this quote.
                        </div>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="space-y-6 md:col-span-2">
                        {quote.sections.hotels?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-2xl p-6"
                                style={{ background: 'var(--surface-strong)', border: '1px solid var(--border-soft)' }}
                            >
                                <h3 className="mb-4 flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                    <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400"><FaHotel /></span>
                                    Accommodation
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections.hotels.map((h: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: 'var(--border-soft)' }}>
                                            <div>
                                                <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{h.name}</h4>
                                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{h.city} • {h.roomType}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-emerald-400">{h.nights} Nights</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {quote.sections.transport?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-2xl p-6"
                                style={{ background: 'var(--surface-strong)', border: '1px solid var(--border-soft)' }}
                            >
                                <h3 className="mb-4 flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                    <span className="rounded-lg bg-blue-500/10 p-2 text-blue-400"><FaPlane /></span>
                                    Transportation
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections.transport.map((t: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: 'var(--border-soft)' }}>
                                            <div>
                                                <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t.type}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-emerald-400">{t.days} Days</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {quote.sections.activities?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-2xl p-6"
                                style={{ background: 'var(--surface-strong)', border: '1px solid var(--border-soft)' }}
                            >
                                <h3 className="mb-4 flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                    <span className="rounded-lg bg-purple-500/10 p-2 text-purple-400"><FaTicketAlt /></span>
                                    Activities & Sightseeing
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections.activities.map((a: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: 'var(--border-soft)' }}>
                                            <div>
                                                <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{a.name}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="sticky top-8 rounded-3xl p-6"
                            style={{ background: isDark ? '#000000' : 'var(--surface-strong)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-soft)' }}
                        >
                            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quote Summary</h3>

                            <div className="mb-8 space-y-4">
                                <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                                    <span>Travelers</span>
                                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{requirement.pax?.adults || 2} Adults</span>
                                </div>
                                <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                                    <span>Duration</span>
                                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{requirement.duration} Days</span>
                                </div>
                                <div className="border-t pt-4" style={{ borderColor: 'var(--border-soft)' }}>
                                    <div className="flex items-end justify-between">
                                        <span className="text-lg" style={{ color: 'var(--text-primary)' }}>Total Price</span>
                                        <span className="text-3xl font-bold text-emerald-400">Rs {quote.costs.final?.toLocaleString()}</span>
                                    </div>
                                    <p className="mt-2 text-right text-xs" style={{ color: 'var(--text-muted)' }}>Inclusive of all taxes & fees</p>
                                </div>
                            </div>

                            {quote.status !== 'ACCEPTED' && quote.status !== 'DECLINED' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleAction('ACCEPTED')}
                                        disabled={actionLoading}
                                        className="flex w-full items-center justify-center rounded-xl bg-emerald-500 py-4 font-bold text-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 hover:bg-emerald-400"
                                    >
                                        {actionLoading ? <FaSpinner className="animate-spin" /> : 'Accept Quote'}
                                    </button>
                                    <button
                                        onClick={() => handleAction('DECLINED')}
                                        disabled={actionLoading}
                                        className="w-full rounded-xl py-4 font-medium transition-all active:scale-95 disabled:opacity-50"
                                        style={{ color: 'var(--text-muted)', border: '1px solid var(--border-soft)', background: 'transparent' }}
                                    >
                                        Decline
                                    </button>
                                </div>
                            )}

                            {(quote.status === 'ACCEPTED' || quote.status === 'DECLINED') && (
                                <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                                    This quote can no longer be modified. Please contact your travel agent for further assistance.
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicQuoteView;

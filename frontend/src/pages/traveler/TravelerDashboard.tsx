import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
    FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaMoneyBillWave,
    FaSuitcase, FaClock, FaStar, FaPlane, FaEye
} from 'react-icons/fa';

const TravelerDashboard: React.FC = () => {
    const { user } = useAuth();
    const token = user?.token || '';
    const [requirements, setRequirements] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/requirements/user`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRequirements(data);
        } catch (error) {
            console.error('Error fetching requirements:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusTheme = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'IN_PROGRESS': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'QUOTES_READY': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'SENT_TO_USER': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <div className="page-shell flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="mx-auto mb-4 animate-spin text-4xl text-blue-400" />
                    <div className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>Loading your dashboard...</div>
                    <div className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Fetching your travel journeys</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="mb-2 bg-gradient-to-r from-[var(--text-primary)] to-slate-400 bg-clip-text text-4xl font-bold text-transparent">
                        Traveler Dashboard
                    </h1>
                    <p className="text-lg" style={{ color: 'var(--text-muted)' }}>Manage your travel plans and explore amazing destinations</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4"
                >
                    {[
                        { label: 'Total Journeys', value: requirements.length, icon: <FaSuitcase />, color: 'text-blue-400' },
                        { label: 'New Requests', value: requirements.filter(r => r.status === 'NEW').length, icon: <FaClock />, color: 'text-yellow-400' },
                        { label: 'In Progress', value: requirements.filter(r => r.status === 'IN_PROGRESS').length, icon: <FaStar />, color: 'text-purple-400' },
                        { label: 'Completed', value: requirements.filter(r => r.status === 'COMPLETED').length, icon: <FaMoneyBillWave />, color: 'text-emerald-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.1 }}
                            className="theme-surface rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
                                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</span>
                            </div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Recent Journeys</h2>

                    {requirements.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="theme-surface rounded-2xl p-12 text-center"
                        >
                            <FaSuitcase className="mx-auto mb-4 text-6xl" style={{ color: 'var(--text-muted)' }} />
                            <h3 className="mb-2 text-xl font-semibold" style={{ color: 'var(--text-secondary)' }}>No journeys yet</h3>
                            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Start planning your first adventure to see it here</p>
                            <Link
                                to="/traveler/plan-journey"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
                            >
                                <FaPlane />
                                Plan Your First Journey
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid gap-6">
                            {requirements.map((req, index) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <div className="theme-surface rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
                                        <div className="mb-6 flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="mb-3 flex items-center gap-4">
                                                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                                                        <FaMapMarkerAlt className="text-lg text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                                            {req.destination}
                                                        </h3>
                                                        <p style={{ color: 'var(--text-muted)' }}>{req.tripType}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                                    <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'color-mix(in srgb, var(--surface-soft) 88%, transparent)' }}>
                                                        <FaUsers className="text-sm text-blue-400" />
                                                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                            {req.pax.adults} Adults{req.pax.children > 0 && `, ${req.pax.children} Children`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'color-mix(in srgb, var(--surface-soft) 88%, transparent)' }}>
                                                        <FaCalendarAlt className="text-sm text-blue-400" />
                                                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{req.duration || 0} Days</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'color-mix(in srgb, var(--surface-soft) 88%, transparent)' }}>
                                                        <FaMoneyBillWave className="text-sm text-blue-400" />
                                                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rs {req.budget?.toLocaleString() || 'Not specified'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'color-mix(in srgb, var(--surface-soft) 88%, transparent)' }}>
                                                        <FaStar className="text-sm text-blue-400" />
                                                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{req.hotelStar || 0} Star Hotel</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ml-6 flex flex-col items-end gap-3">
                                                <span className={`rounded-full border px-4 py-2 text-sm font-bold ${getStatusTheme(req.status)}`}>
                                                    {req.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        {req.description && (
                                            <div className="border-t pt-4" style={{ borderColor: 'var(--border-soft)' }}>
                                                <p className="line-clamp-2 text-sm" style={{ color: 'var(--text-muted)' }}>{req.description}</p>
                                            </div>
                                        )}

                                        <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border-soft)' }}>
                                            <Link
                                                to={`/traveler/quotes/${req._id}`}
                                                className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 font-medium text-blue-400 transition-colors hover:bg-blue-500/20"
                                            >
                                                <FaEye size={14} />
                                                See Quotes
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default TravelerDashboard;

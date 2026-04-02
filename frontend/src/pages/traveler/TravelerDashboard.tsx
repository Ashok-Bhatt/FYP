import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { 
    FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaMoneyBillWave, 
    FaSuitcase, FaClock, FaStar, FaArrowRight, FaPlane, FaEye
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-400 mx-auto mb-4" />
                    <div className="text-white text-xl font-medium">Loading your dashboard...</div>
                    <div className="text-gray-400 text-sm mt-2">Fetching your travel journeys</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                        Traveler Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg">Manage your travel plans and explore amazing destinations</p>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
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
                            className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 hover:border-zinc-700/50 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                            </div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            to="/traveler/plan-journey"
                            className="group bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Plan New Journey</h3>
                                    <p className="text-blue-100">Start planning your next adventure</p>
                                </div>
                                <FaPlane className="text-4xl text-white/80 group-hover:scale-110 transition-transform" />
                            </div>
                        </Link>
                        <Link
                            to="/traveler/quotes"
                            className="group bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">View My Quotes</h3>
                                    <p className="text-gray-400">Check your travel quotations</p>
                                </div>
                                <FaArrowRight className="text-4xl text-blue-400 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </motion.div> */}

                {/* Recent Journeys */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Recent Journeys</h2>
                    
                    {requirements.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-12 text-center"
                        >
                            <FaSuitcase className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">No journeys yet</h3>
                            <p className="text-gray-500 mb-6">Start planning your first adventure to see it here</p>
                            <Link
                                to="/traveler/plan-journey"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
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
                                    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                                        <FaMapMarkerAlt className="text-blue-400 text-lg" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white">
                                                            {req.destination}
                                                        </h3>
                                                        <p className="text-gray-400">{req.tripType}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaUsers className="text-blue-400 text-sm" />
                                                        <span className="text-sm text-gray-300">
                                                            {req.pax.adults} Adults{req.pax.children > 0 && `, ${req.pax.children} Children`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaCalendarAlt className="text-blue-400 text-sm" />
                                                        <span className="text-sm text-gray-300">{req.duration || 0} Days</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaMoneyBillWave className="text-blue-400 text-sm" />
                                                        <span className="text-sm text-gray-300">₹{req.budget?.toLocaleString() || 'Not specified'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaStar className="text-blue-400 text-sm" />
                                                        <span className="text-sm text-gray-300">{req.hotelStar || 0}⭐ Hotel</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-end gap-3 ml-6">
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusTheme(req.status)}`}>
                                                    {req.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {req.description && (
                                            <div className="border-t border-zinc-800/50 pt-4">
                                                <p className="text-gray-400 text-sm line-clamp-2">{req.description}</p>
                                            </div>
                                        )}
                                        
                                        <div className="border-t border-zinc-800/50 pt-4 mt-4">
                                            <Link
                                                to={`/traveler/quotes/${req._id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 font-medium rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20"
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

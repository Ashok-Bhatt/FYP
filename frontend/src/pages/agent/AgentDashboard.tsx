import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Requirement } from '../../types';
import { motion } from 'framer-motion';
import { 
    FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaMoneyBillWave, 
    FaSuitcase, FaClock, FaStar, FaArrowRight 
} from 'react-icons/fa';

const AgentDashboard: React.FC = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) return;

            const { token } = JSON.parse(userInfo);
            const { data } = await axios.get<Requirement[]>(
                `${import.meta.env.VITE_API_URL}/api/requirements`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRequirements(data);
        } catch (error) {
            console.error('Error fetching requirements:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading dashboard...</div>
            </div>
        );
    }

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
                        Agent Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg">Manage travel requirements and create amazing quotes</p>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
                >
                    {[
                        { label: 'Total Requirements', value: requirements.length, icon: <FaSuitcase />, color: 'text-blue-400' },
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

                {/* Requirements List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Recent Requirements</h2>
                    
                    {requirements.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-12 text-center"
                        >
                            <FaSuitcase className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">No requirements yet</h3>
                            <p className="text-gray-500">Travel requirements will appear here once customers submit them</p>
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
                                    <Link
                                        to={`/agent/requirement/${req._id}`}
                                        className="group block bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                                        <FaMapMarkerAlt className="text-emerald-400 text-lg" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                            {req.destination}
                                                        </h3>
                                                        <p className="text-gray-400">{req.tripType}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaUsers className="text-emerald-400 text-sm" />
                                                        <span className="text-sm text-gray-300">
                                                            {req.pax.adults} Adults{req.pax.children > 0 && `, ${req.pax.children} Children`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaCalendarAlt className="text-emerald-400 text-sm" />
                                                        <span className="text-sm text-gray-300">{req.duration || 0} Days</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaMoneyBillWave className="text-emerald-400 text-sm" />
                                                        <span className="text-sm text-gray-300">₹{req.budget?.toLocaleString() || 'Not specified'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaStar className="text-emerald-400 text-sm" />
                                                        <span className="text-sm text-gray-300">{req.hotelStar || 0}⭐ Hotel</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-end gap-3 ml-6">
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusTheme(req.status)}`}>
                                                    {req.status.replace(/_/g, ' ')}
                                                </span>
                                                <div className="flex items-center gap-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-sm font-medium">View Details</span>
                                                    <FaArrowRight className="text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {req.description && (
                                            <div className="border-t border-zinc-800/50 pt-4">
                                                <p className="text-gray-400 text-sm line-clamp-2">{req.description}</p>
                                            </div>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AgentDashboard;

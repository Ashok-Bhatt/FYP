import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    FaChartLine,
    FaCheckCircle,
    FaEye,
    FaDollarSign,
    FaQuoteRight,
    FaLightbulb,
    FaArrowDown,
    FaMapMarkerAlt,
    FaCalendarAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
    totalQuotes: number;
    acceptedQuotes: number;
    conversionRate: number;
    totalRevenue: number;
    averageQuoteValue: number;
    totalViews: number;
}

interface MostViewedQuote {
    quoteId: string;
    title: string;
    viewCount: number;
    status: string;
    amount: number;
}

interface TopDestination {
    title: string;
    quoteCount: number;
    acceptedCount: number;
    revenue: number;
    views: number;
}

interface RecentActivity {
    quoteId: string;
    title: string;
    status: string;
    amount: number;
    updatedAt: string;
    action: 'accepted' | 'declined' | 'viewed' | 'created';
}

interface MonthlyTrend {
    month: string;
    quotes: number;
    revenue: number;
}

interface DashboardData {
    stats: DashboardStats;
    statusBreakdown: Record<string, number>;
    recentActivity: RecentActivity[];
    monthlyTrend: MonthlyTrend[];
    mostViewedQuote: MostViewedQuote | null;
    topDestination: TopDestination | null;
    topDestination: TopDestination | null;
}

const PartnerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/partners/dashboard`, config);
            setDashboardData(res.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getEngagementColor = (action: string) => {
        switch (action) {
            case 'accepted': return 'text-emerald-400 bg-emerald-400/10';
            case 'declined': return 'text-red-400 bg-red-400/10';
            case 'viewed': return 'text-blue-400 bg-blue-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return 'text-emerald-400';
            case 'DECLINED': return 'text-red-400';
            case 'SENT_TO_USER': return 'text-blue-400';
            case 'READY': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="p-8">
                <p className="text-red-400">Failed to load dashboard data. Please try again.</p>
            </div>
        );
    }

    const { stats, statusBreakdown, recentActivity, monthlyTrend, mostViewedQuote, topDestination } = dashboardData;

    const maxQuotes = Math.max(...monthlyTrend.map(m => m.quotes), 1);
    const maxRevenue = Math.max(...monthlyTrend.map(m => m.revenue), 1);

    const funnelData = Object.entries(statusBreakdown).map(([status, count]) => ({
        name: status,
        value: count,
    }));
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Partner Dashboard</h1>
                    <p className="text-gray-400 mt-1">Track your performance and manage your quotes</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg"><FaQuoteRight className="text-blue-400" /></div>
                        <p className="text-gray-400 text-sm">Total Quotes</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalQuotes}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg"><FaCheckCircle className="text-emerald-400" /></div>
                        <p className="text-gray-400 text-sm">Accepted</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.acceptedQuotes}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg"><FaChartLine className="text-purple-400" /></div>
                        <p className="text-gray-400 text-sm">Conversion</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg"><FaDollarSign className="text-amber-400" /></div>
                        <p className="text-gray-400 text-sm">Revenue</p>
                    </div>
                    <p className="text-2xl font-bold text-white">₹{(stats.totalRevenue / 1000).toFixed(0)}k</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-pink-500/20 rounded-lg"><FaDollarSign className="text-pink-400" /></div>
                        <p className="text-gray-400 text-sm">Avg Quote</p>
                    </div>
                    <p className="text-2xl font-bold text-white">₹{(stats.averageQuoteValue / 1000).toFixed(0)}k</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg"><FaEye className="text-cyan-400" /></div>
                        <p className="text-gray-400 text-sm">Total Views</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status & Activity */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FaChartLine className="text-emerald-400" />Quote Status
                        </h3>
                        <div className="h-48 relative mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={funnelData}
                                        dataKey="value"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={8}
                                        stroke="none"
                                    >
                                        {funnelData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3">
                            {funnelData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-gray-300 text-sm">{item.name.replace(/_/g, ' ')}</span>
                                    </div>
                                    <span className="text-white font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-400" />Recent Activity
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {recentActivity.length === 0 ? (
                                <p className="text-gray-400 text-sm">No recent activity</p>
                            ) : (
                                recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-black/40 rounded-xl">
                                        <div className={`p-2 rounded-lg ${getEngagementColor(activity.action)}`}>
                                            {activity.action === 'accepted' && <FaCheckCircle />}
                                            {activity.action === 'declined' && <FaArrowDown />}
                                            {activity.action === 'viewed' && <FaEye />}
                                            {activity.action === 'created' && <FaQuoteRight />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{activity.title}</p>
                                            <p className={`text-xs ${getStatusColor(activity.status)}`}>
                                                {activity.action} • ₹{(activity.amount / 1000).toFixed(0)}k
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Trends & Insights */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FaChartLine className="text-purple-400" />6-Month Trend
                        </h3>
                        <div className="space-y-4">
                            {monthlyTrend.map((month, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">{month.month}</span>
                                        <span className="text-white">{month.quotes} quotes • ₹{(month.revenue / 1000).toFixed(0)}k</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(month.quotes / maxQuotes) * 100}%` }} />
                                        </div>
                                        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(month.revenue / maxRevenue) * 100}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {mostViewedQuote && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FaEye className="text-cyan-400" />Most Viewed
                            </h3>
                            <div className="p-4 bg-black/40 rounded-xl">
                                <p className="text-white font-medium mb-2">{mostViewedQuote.title}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-cyan-400 flex items-center gap-1"><FaEye /> {mostViewedQuote.viewCount} views</span>
                                    <span className={getStatusColor(mostViewedQuote.status)}>{mostViewedQuote.status}</span>
                                    <span className="text-emerald-400">₹{(mostViewedQuote.amount / 1000).toFixed(0)}k</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {topDestination && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-amber-400" />Top Performer
                            </h3>
                            <div className="p-4 bg-black/40 rounded-xl">
                                <p className="text-white font-medium mb-3">{topDestination.title}</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2"><FaQuoteRight className="text-blue-400" /><span className="text-gray-400">{topDestination.quoteCount} quotes</span></div>
                                    <div className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400" /><span className="text-gray-400">{topDestination.acceptedCount} accepted</span></div>
                                    <div className="flex items-center gap-2"><FaDollarSign className="text-amber-400" /><span className="text-gray-400">₹{(topDestination.revenue / 1000).toFixed(0)}k</span></div>
                                    <div className="flex items-center gap-2"><FaEye className="text-cyan-400" /><span className="text-gray-400">{topDestination.views} views</span></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PartnerDashboard;

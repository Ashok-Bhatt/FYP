import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    FaEye,
    FaQuoteRight,
    FaMapMarkerAlt,
    FaUsers,
    FaCalendarAlt,
    FaShare,
    FaFilter,
    FaChevronLeft,
    FaChevronRight,
    FaFire,
    FaCircle,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaPaperPlane
} from 'react-icons/fa';
import { motion } from 'framer-motion';

interface QuoteRequirement {
    destination: string;
    tripType: string;
    duration: number;
    pax: {
        adults: number;
        children: number;
    };
    budget: number;
}

interface Quote {
    _id: string;
    title: string;
    status: 'DRAFT' | 'READY' | 'SENT_TO_USER' | 'ACCEPTED' | 'DECLINED';
    costs: {
        final: number;
        perHead: number;
    };
    viewCount: number;
    lastViewedAt: string | null;
    createdAt: string;
    updatedAt: string;
    engagementLevel: 'High' | 'Medium' | 'Low';
    requirement: QuoteRequirement | null;
    shareUrl: string | null;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

interface QuotesResponse {
    quotes: Quote[];
    pagination: Pagination;
}

const PartnerQuotes: React.FC = () => {
    const { user } = useAuth();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, hasMore: false });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        fetchQuotes(1);
    }, [statusFilter]);

    const fetchQuotes = async (page: number) => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '10');
            if (statusFilter) params.append('status', statusFilter);

            const res = await axios.get<QuotesResponse>(
                `${import.meta.env.VITE_API_URL}/api/partners/quotes?${params}`,
                config
            );
            setQuotes(res.data.quotes);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return <FaCheckCircle className="text-emerald-400" />;
            case 'DECLINED': return <FaTimesCircle className="text-red-400" />;
            case 'SENT_TO_USER': return <FaPaperPlane className="text-blue-400" />;
            case 'READY': return <FaCheckCircle className="text-yellow-400" />;
            default: return <FaClock className="text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'DECLINED': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'SENT_TO_USER': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'READY': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getEngagementIcon = (level: string) => {
        switch (level) {
            case 'High': return <FaFire className="text-orange-400" />;
            case 'Medium': return <FaEye className="text-blue-400" />;
            default: return <FaCircle className="text-gray-500 text-xs" />;
        }
    };

    const getEngagementColor = (level: string) => {
        switch (level) {
            case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'Medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const handleCopyShareUrl = (url: string | null) => {
        if (url) {
            navigator.clipboard.writeText(url);
            // Could add toast notification here
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (loading && quotes.length === 0) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Quotes</h1>
                    <p className="text-gray-400 mt-1">Manage and track all your submitted quotes</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white text-sm focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="READY">Ready</option>
                            <option value="SENT_TO_USER">Sent</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="DECLINED">Declined</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">{pagination.total}</p>
                </div>
                <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">High Engagement</p>
                    <p className="text-2xl font-bold text-orange-400">
                        {quotes.filter(q => q.engagementLevel === 'High').length}
                    </p>
                </div>
                <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Accepted</p>
                    <p className="text-2xl font-bold text-emerald-400">
                        {quotes.filter(q => q.status === 'ACCEPTED').length}
                    </p>
                </div>
                <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-amber-400">
                        ₹{(quotes.reduce((sum, q) => sum + q.costs.final, 0) / 1000).toFixed(0)}k
                    </p>
                </div>
            </div>

            {/* Quotes List */}
            <div className="space-y-4">
                {quotes.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900/50 border border-white/10 rounded-2xl">
                        <FaQuoteRight className="mx-auto text-4xl text-gray-600 mb-4" />
                        <p className="text-gray-400">No quotes found</p>
                        <p className="text-gray-500 text-sm mt-1">Quotes you submit will appear here</p>
                    </div>
                ) : (
                    quotes.map((quote, index) => (
                        <motion.div
                            key={quote._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                {/* Left: Quote Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-white">{quote.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                                            <span className="flex items-center gap-1">
                                                {getStatusIcon(quote.status)}
                                                {quote.status.replace(/_/g, ' ')}
                                            </span>
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEngagementColor(quote.engagementLevel)}`}>
                                            <span className="flex items-center gap-1">
                                                {getEngagementIcon(quote.engagementLevel)}
                                                {quote.engagementLevel} Engagement
                                            </span>
                                        </span>
                                    </div>

                                    {quote.requirement && (
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-emerald-400" />
                                                {quote.requirement.destination}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt className="text-blue-400" />
                                                {quote.requirement.duration} days
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaUsers className="text-purple-400" />
                                                {quote.requirement.pax.adults} adults
                                                {quote.requirement.pax.children > 0 && `, ${quote.requirement.pax.children} children`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Middle: Stats */}
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-emerald-400">₹{(quote.costs.final / 1000).toFixed(0)}k</p>
                                        <p className="text-xs text-gray-500">Total Value</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-400">₹{(quote.costs.perHead / 1000).toFixed(0)}k</p>
                                        <p className="text-xs text-gray-500">Per Person</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-cyan-400">{quote.viewCount}</p>
                                        <p className="text-xs text-gray-500">Views</p>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center gap-3">
                                    <div className="text-right mr-4">
                                        <p className="text-xs text-gray-500">Last viewed</p>
                                        <p className="text-sm text-gray-300">{formatDate(quote.lastViewedAt)}</p>
                                    </div>
                                    {quote.shareUrl && (
                                        <button
                                            onClick={() => handleCopyShareUrl(quote.shareUrl)}
                                            className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-colors"
                                            title="Copy share link"
                                        >
                                            <FaShare />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-gray-400 text-sm">
                        Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} quotes
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchQuotes(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-2 bg-zinc-900 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                        >
                            <FaChevronLeft />
                        </button>
                        <span className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white">
                            Page {pagination.page}
                        </span>
                        <button
                            onClick={() => fetchQuotes(pagination.page + 1)}
                            disabled={!pagination.hasMore}
                            className="p-2 bg-zinc-900 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerQuotes;

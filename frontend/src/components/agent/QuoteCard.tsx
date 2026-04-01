import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaEye, FaDownload, FaShareAlt, FaTrashAlt, 
    FaEnvelope, FaWhatsapp, FaInstagram, FaMapMarkerAlt, 
    FaCalendarAlt, FaUsers, FaHotel, FaWalking 
} from 'react-icons/fa';

// ... Props interface remains the same ...

const QuoteCard: React.FC<QuoteCardProps> = ({
    quote,
    shareDropdown,
    setShareDropdown,
    onView,
    onDownload,
    onDelete,
    onShare,
    getViewStatusColor,
    getViewStatusClasses
}) => {
    const getTimeAgo = (lastViewedAt: string | null) => {
        if (!lastViewedAt) return 'Never viewed';
        
        const now = new Date();
        const lastViewed = new Date(lastViewedAt);
        const diffMs = now.getTime() - lastViewed.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const getStatusTheme = (status: string) => {
        const themes: Record<string, string> = {
            'DRAFT': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            'READY': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            'SENT_TO_USER': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'ACCEPTED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            'DECLINED': 'bg-red-500/10 text-red-500 border-red-500/20',
        };
        return themes[status] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    };

    const viewStatus = getViewStatusColor(quote.lastViewedAt);
    const viewClasses = getViewStatusClasses(viewStatus);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden group"
        >
            {/* Premium gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main card with glassmorphism */}
            <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/10">
                
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Header: Identity & Status */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase bg-zinc-800/50 px-2 py-1 rounded-lg">
                                #{quote._id.slice(-6)}
                            </span>
                            <span className={`px-3 py-1 text-[9px] rounded-full font-bold tracking-wider uppercase border ${getStatusTheme(quote.status)}`}>
                                {quote.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-medium bg-zinc-800/30 px-2 py-1 rounded-lg">
                                Created {new Date(quote.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors tracking-tight">
                            {quote.requirementId?.contactInfo?.name || quote.title || 'Anonymous Traveler'}
                        </h3>
                    </div>
                    
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-600 uppercase font-black tracking-tighter mb-1">Quote Value</p>
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl" />
                            <p className="relative text-2xl font-black text-emerald-400">
                                ₹{(quote.costs?.final || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

            {/* Main Details Row */}
                <div className="flex items-center justify-between py-4 border-y border-zinc-700/30">
                    <div className="flex items-center gap-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-xl">
                            <FaMapMarkerAlt className="text-emerald-500/80 text-xs" />
                            <span className="font-medium">{quote.requirementId?.destination || quote.destination || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-xl">
                            <FaCalendarAlt className="text-emerald-500/80 text-xs" />
                            <span className="font-medium">{quote.requirementId?.duration || quote.duration || 0} Days</span>
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-xl">
                            <FaHotel className="text-emerald-500/80 text-xs" />
                            <span className="font-medium">{quote.sections?.hotels?.length || 0} Hotels</span>
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-xl">
                            <FaWalking className="text-emerald-500/80 text-xs" />
                            <span className="font-medium">{quote.sections?.activities?.length || 0} Activities</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-2 rounded-xl border border-blue-500/20">
                            <FaEye className="text-blue-400 text-xs" />
                            <span className="text-xs font-bold text-blue-300">{quote.viewCount || 0}</span>
                        </div>
                        <span className={`px-3 py-2 text-[10px] rounded-xl border font-medium ${viewClasses.bg} ${viewClasses.text} ${viewClasses.border}`}>
                            {getTimeAgo(quote.lastViewedAt)}
                        </span>
                    </div>
                </div>

                {/* Footer: Actions */}
                <div className="mt-6 flex items-center gap-3">
                    <button
                        onClick={() => onView(quote._id)}
                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-zinc-950 text-sm font-bold hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                    >
                        View Full Details
                    </button>
                    
                    <button onClick={() => onDownload(quote)} className="p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 transition-all duration-300 border border-zinc-700/30 hover:border-zinc-600/50">
                        <FaDownload />
                    </button>

                    <div className="relative">
                        <button 
                            onClick={() => setShareDropdown(shareDropdown === quote._id ? null : quote._id)}
                            className={`p-3 rounded-xl transition-all duration-300 border ${shareDropdown === quote._id ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-zinc-800/50 border-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50 hover:border-zinc-600/50'}`}
                        >
                            <FaShareAlt />
                        </button>
                        
                        <AnimatePresence>
                            {shareDropdown === quote._id && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="absolute right-0 bottom-full mb-3 bg-zinc-800 border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden z-20 min-w-40 backdrop-blur-xl"
                                >
                                    {[
                                        { id: 'email', icon: <FaEnvelope />, label: 'Email', color: 'hover:text-blue-400' },
                                        { id: 'whatsapp', icon: <FaWhatsapp />, label: 'WhatsApp', color: 'hover:text-green-400' },
                                        { id: 'instagram', icon: <FaInstagram />, label: 'Instagram', color: 'hover:text-pink-400' }
                                    ].map((platform) => (
                                        <button 
                                            key={platform.id}
                                            onClick={() => onShare(quote, platform.id)}
                                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-700/50 text-xs text-zinc-300 transition-colors ${platform.color}`}
                                        >
                                            {platform.icon} {platform.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button 
                        onClick={() => onDelete(quote._id)}
                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
                    >
                        <FaTrashAlt />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default QuoteCard;
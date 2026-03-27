import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaHotel, FaPlane, FaTicketAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const PublicQuoteView: React.FC = () => {
    const { token } = useParams();
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
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
                <FaTimesCircle className="text-6xl text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
                <p className="text-gray-400 text-center">{error}</p>
            </div>
        );
    }

    if (!quote) return null;

    const requirement = quote.requirementId;

    return (
        <div className="min-h-screen bg-zinc-950 text-gray-200 font-sans selection:bg-emerald-500 selection:text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-white/5 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500" />
                    
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Your Trip to {requirement.destination}
                    </h1>
                    
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
                        <span className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/5">
                            <FaUser className="text-emerald-400" /> {requirement.contactInfo?.name}
                        </span>
                        <span className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/5">
                            <FaCalendarAlt className="text-emerald-400" /> {requirement.duration} Days
                        </span>
                        <span className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/5">
                            <FaMapMarkerAlt className="text-emerald-400" /> {requirement.tripType}
                        </span>
                    </div>

                    {/* Status Banner */}
                    {quote.status === 'ACCEPTED' && (
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-6 py-3 rounded-xl font-bold border border-emerald-500/30">
                            <FaCheckCircle className="text-xl" /> You have ACCEPTED this quote!
                        </div>
                    )}
                    {quote.status === 'DECLINED' && (
                        <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-6 py-3 rounded-xl font-bold border border-red-500/30">
                            <FaTimesCircle className="text-xl" /> You have DECLINED this quote.
                        </div>
                    )}
                </motion.div>

                {/* Itinerary Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    <div className="md:col-span-2 space-y-6">
                        {/* Hotel Info */}
                        {quote.sections.hotels?.length > 0 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><FaHotel /></span>
                                    Accommodation
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections.hotels.map((h: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <h4 className="font-bold text-lg text-white">{h.name}</h4>
                                                <p className="text-sm text-gray-400">{h.city} • {h.roomType}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-emerald-400">{h.nights} Nights</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Transport Info */}
                        {quote.sections.transport?.length > 0 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FaPlane /></span>
                                    Transportation
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections.transport.map((t: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <h4 className="font-bold text-lg text-white">{t.type}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-emerald-400">{t.days} Days</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Activities Info */}
                        {quote.sections.activities?.length > 0 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-zinc-900 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><FaTicketAlt /></span>
                                    Activities & Sightseeing
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections.activities.map((a: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <h4 className="font-bold text-lg text-white">{a.name}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="md:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: 0.4 }}
                            className="bg-black border border-white/10 rounded-3xl p-6 sticky top-8 shadow-2xl shadow-emerald-500/5 group hover:border-emerald-500/30 transition-all"
                        >
                            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-6">Quote Summary</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400">
                                    <span>Travelers</span>
                                    <span className="text-white font-medium">{requirement.pax?.adults || 2} Adults</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Duration</span>
                                    <span className="text-white font-medium">{requirement.duration} Days</span>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg text-white">Total Price</span>
                                        <span className="text-3xl font-bold text-emerald-400">₹{quote.costs.final?.toLocaleString()}</span>
                                    </div>
                                    <p className="text-right text-xs text-gray-500 mt-2">Inclusive of all taxes & fees</p>
                                </div>
                            </div>

                            {quote.status !== 'ACCEPTED' && quote.status !== 'DECLINED' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleAction('ACCEPTED')}
                                        disabled={actionLoading}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {actionLoading ? <FaSpinner className="animate-spin" /> : 'Accept Quote'}
                                    </button>
                                    <button
                                        onClick={() => handleAction('DECLINED')}
                                        disabled={actionLoading}
                                        className="w-full bg-transparent hover:bg-white/5 text-gray-400 border border-white/10 font-medium py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        Decline
                                    </button>
                                </div>
                            )}

                            {(quote.status === 'ACCEPTED' || quote.status === 'DECLINED') && (
                                <div className="mt-6 text-center text-sm text-gray-500">
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

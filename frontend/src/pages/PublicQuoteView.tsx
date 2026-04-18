import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaHotel, FaPlane, FaTicketAlt, FaCheckCircle, FaTimesCircle, FaSpinner, FaMoon, FaCity, FaBed, FaClock, FaFilePdf } from 'react-icons/fa';
import ItineraryTimeline from '../components/ItineraryTimeline';
import { generateItineraryPDF } from '../utils/generatePDF';

const PublicQuoteView: React.FC = () => {
    const { token } = useParams();
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const sectionDurations = useRef<Record<string, number>>({});
    const activeSection = useRef<string | null>(null);

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

    const handleDownloadPdf = async () => {
        if (!quote.itinerary || quote.itinerary.length === 0) {
            alert('No itinerary available for this quote to generate a PDF.');
            return;
        }
        setDownloadingPdf(true);
        try {
            const requirement = quote.requirementId;
            await generateItineraryPDF({
                destination: requirement.destination || 'Trip',
                duration: requirement.duration || quote.itinerary.length,
                tripType: requirement.tripType || 'Leisure',
                clientName: requirement.contactInfo?.name || 'Valued Traveler',
                hotel: quote.sections?.hotels?.[0]?.name || 'Your Hotel',
                finalCost: quote.costs?.final || 0,
                itinerary: quote.itinerary,
                pexelsKey: import.meta.env.VITE_PEXELS_API_KEY as string,
                apiBaseUrl: import.meta.env.VITE_API_URL as string,
            });
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloadingPdf(false);
        }
    };

// Time tracking logic
    useEffect(() => {
        if (!quote || !quote.latestViewId) return;

        let startTime = Date.now();
        let totalDuration = 0;

        const updateDuration = async () => {
            const currentDuration = Math.round((Date.now() - startTime) / 1000);
            totalDuration += currentDuration;
            startTime = Date.now();

            // Add current section's duration
            if (activeSection.current) {
                sectionDurations.current[activeSection.current] = (sectionDurations.current[activeSection.current] || 0) + currentDuration;
            }

            try {
                const engagement = Object.entries(sectionDurations.current).map(([section, duration]) => ({
                    section,
                    duration
                }));

                await axios.post(`${import.meta.env.VITE_API_URL}/api/quotes/public/${token}/view-duration`, {
                    duration: totalDuration,
                    viewId: quote.latestViewId,
                    sectionEngagement: engagement
                });
            } catch (err) {
                console.error('Failed to update duration', err);
            }
        };

        const interval = setInterval(updateDuration, 10000);

        // Intersection Observer for sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Update previous section before switching
                    if (activeSection.current && activeSection.current !== entry.target.id) {
                        const now = Date.now();
                        const spent = Math.round((now - startTime) / 1000);
                        sectionDurations.current[activeSection.current] = (sectionDurations.current[activeSection.current] || 0) + spent;
                        startTime = now;
                    }
                    activeSection.current = entry.target.id;
                }
            });
        }, { threshold: 0.5 });

        // Observe sections
        const sections = ['header', 'accommodation', 'transport', 'activities', 'summary'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        const handleVisibilityChange = () => {
            if (document.hidden) {
                updateDuration();
            } else {
                startTime = Date.now();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            updateDuration();
            observer.disconnect();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [quote, token]);

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
                    id="header"
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
                            <motion.div 
                                id="accommodation"
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.1 }} 
                                className="bg-zinc-900 p-6 rounded-2xl border border-white/5"
                            >
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><FaHotel /></span>
                                    Accommodation
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections.hotels.map((h: any, i: number) => (
                                        <div key={i} className="group flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-white/5 bg-black/40 p-4 rounded-xl hover:border-emerald-500/30 transition-all">
                                            <div>
                                                <h4 className="font-bold text-lg text-white flex items-center gap-2">
                                                    {h.name}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1.5"><FaCity className="text-emerald-500/70 text-xs" /> {h.city}</span>
                                                    <span className="flex items-center gap-1.5"><FaBed className="text-emerald-500/70 text-xs" /> {h.roomType}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 sm:justify-end sm:text-right bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 w-fit">
                                                <FaMoon className="text-emerald-400" />
                                                <span className="font-bold text-emerald-400">{h.nights} Nights</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Transport Info */}
                        {quote.sections.transport?.length > 0 && (
                            <motion.div 
                                id="transport"
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.2 }} 
                                className="bg-zinc-900 p-6 rounded-2xl border border-white/5"
                            >
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FaPlane /></span>
                                    Transportation
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections.transport.map((t: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center border border-white/5 bg-black/40 p-4 rounded-xl hover:border-blue-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex justify-center items-center text-blue-400">
                                                    <FaPlane className="text-xl" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-white">{t.type}</h4>
                                                    <p className="text-xs tracking-wider text-gray-500 uppercase mt-1">Transfer service</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-right bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
                                                <FaClock className="text-blue-400 text-sm" />
                                                <span className="font-bold text-blue-400">{t.days} Days</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Activities Info */}
                        {quote.sections.activities?.length > 0 && (
                            <motion.div 
                                id="activities"
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.3 }} 
                                className="bg-zinc-900 p-6 rounded-2xl border border-white/5"
                            >
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><FaTicketAlt /></span>
                                    Activities & Sightseeing
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections.activities.map((a: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center border border-white/5 bg-black/40 p-4 rounded-xl hover:border-purple-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex flex-col justify-center items-center text-purple-400">
                                                    <span className="text-xs font-bold">ACT</span>
                                                    <span className="text-[10px] opacity-80">{i + 1}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-white">{a.name}</h4>
                                                    <p className="text-xs tracking-wider text-gray-500 uppercase mt-1">Included</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* AI Itinerary Section */}
                        {quote.itinerary && quote.itinerary.length > 0 && (
                            <motion.div 
                                id="itinerary"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="pt-8 border-t border-white/10"
                            >
                                <ItineraryTimeline 
                                    days={quote.itinerary} 
                                    destination={requirement.destination}
                                    pexelsKey={import.meta.env.VITE_PEXELS_API_KEY}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="md:col-span-1" id="summary">
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

                            {quote.itinerary && quote.itinerary.length > 0 && (
                                <div className="space-y-3 mt-6 border-t border-white/10 pt-6">
                                    <button
                                        onClick={handleDownloadPdf}
                                        disabled={downloadingPdf}
                                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {downloadingPdf ? <FaSpinner className="animate-spin" /> : <FaFilePdf className="text-red-400" />}
                                        Download Proposal PDF
                                    </button>
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

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    FaMapMarkerAlt, FaUsers, FaCalendarAlt, 
    FaHotel, FaWalking, FaStar, FaClock, 
    FaArrowRight, FaExclamationTriangle 
} from 'react-icons/fa';
import { FaShield } from "react-icons/fa6";

// Types
interface ComparisonInsights {
    cheapestQuoteId: string;
    highestRatedQuoteId: string;
    mostActivitiesQuoteId: string;
    bestValueQuoteId: string;
    priceRange: { min: number; max: number };
    averageRating: number;
    totalQuotes: number;
}

interface QuoteComparison {
    _id: string;
    partner: {
        _id: string;
        name: string;
        rating?: number;
        totalReviews?: number;
        logo?: string;
        specialties?: string[];
    };
    status: 'SENT' | 'READY';
    costs: {
        net: number;
        margin: number;
        final: number;
        perHead: number;
        breakdown: {
            hotels: number;
            transport: number;
            activities: number;
            other: number;
        };
    };
    hotels: any[];
    itinerary: any[];
    activities: any[];
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    createdAt: string;
    validUntil?: string;
}

interface CompareData {
    requirement: {
        _id: string;
        destination: string;
        duration: number;
        pax: { adults: number; children: number };
        contactInfo: { name: string; email: string };
        createdAt: string;
    };
    quotes: QuoteComparison[];
    insights: ComparisonInsights;
    compareToken: string;
}

const CompareView: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<CompareData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [acceptingQuote, setAcceptingQuote] = useState<string | null>(null);
    const [showAcceptModal, setShowAcceptModal] = useState<QuoteComparison | null>(null);

    useEffect(() => {
        if (token) {
            fetchComparisonData();
        }
    }, [token]);

    const fetchComparisonData = async () => {
        try {
            // First, we need to get the requirement ID from the token
            // For now, let's assume we can fetch with the token directly
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/quotes/compare/by-token?token=${token}`
            );
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load comparison');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptQuote = async (quote: QuoteComparison) => {
        setAcceptingQuote(quote._id);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/quotes/${quote._id}/accept`,
                { token }
            );
            
            if (response.data.success) {
                navigate(`/quote/accepted/${quote._id}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to accept quote');
        } finally {
            setAcceptingQuote(null);
            setShowAcceptModal(null);
        }
    };

    const getQuoteBadges = (quote: QuoteComparison) => {
        const badges = [];
        const { insights } = data!;

        if (insights.cheapestQuoteId === quote._id) {
            badges.push({ icon: '💰', text: 'Lowest Price', color: 'emerald' });
        }
        
        if (insights.highestRatedQuoteId === quote._id) {
            badges.push({ icon: '⭐', text: 'Top Rated', color: 'amber' });
        }
        
        if (insights.mostActivitiesQuoteId === quote._id) {
            badges.push({ icon: '🎯', text: 'Most Activities', color: 'blue' });
        }
        
        if (insights.bestValueQuoteId === quote._id) {
            badges.push({ icon: '👑', text: 'Best Value', color: 'purple' });
        }

        return badges;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-800 font-medium">Preparing comparison...</p>
                    <p className="text-gray-600 text-sm mt-2">Analyzing your travel quotes</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparison Unavailable</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const { requirement, quotes, insights } = data;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Compare Travel Quotes
                            </h1>
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-emerald-600" />
                                    <span>{requirement.destination}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-emerald-600" />
                                    <span>{requirement.duration} Days</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaUsers className="text-emerald-600" />
                                    <span>{requirement.pax.adults + requirement.pax.children} Travelers</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">For {requirement.contactInfo.name}</div>
                            <div className="text-xs text-gray-400">
                                {quotes.length} quotes available
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {quotes.length === 0 ? (
                    <div className="text-center py-12">
                        <FaHotel className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quotes Available</h3>
                        <p className="text-gray-600">Check back later for available quotes</p>
                    </div>
                ) : (
                    <div className={`grid ${
                        quotes.length === 1 ? 'md:grid-cols-1' : 
                        quotes.length === 2 ? 'md:grid-cols-2' : 
                        'lg:grid-cols-3'
                    } gap-6`}>
                        {quotes.map((quote, index) => (
                            <motion.div
                                key={quote._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {/* Quote Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {quote.partner.name}
                                            </h3>
                                            {quote.partner.rating && (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`text-sm ${
                                                                    i < Math.floor(quote.partner.rating!)
                                                                        ? 'text-amber-400 fill-current'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        {quote.partner.rating} ({quote.partner.totalReviews || 0} reviews)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Badges */}
                                        <div className="flex flex-col gap-2">
                                            {getQuoteBadges(quote).map((badge, i) => (
                                                <div
                                                    key={i}
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}
                                                >
                                                    <span>{badge.icon}</span>
                                                    <span>{badge.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            ₹{quote.costs.final.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            ₹{quote.costs.perHead.toLocaleString()} per person
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* Hotels */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <FaHotel className="text-emerald-600" />
                                            Hotels ({quote.hotels.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {quote.hotels.slice(0, 2).map((hotel, i) => (
                                                <div key={i} className="text-sm text-gray-600">
                                                    {hotel.name} - {hotel.location}
                                                </div>
                                            ))}
                                            {quote.hotels.length > 2 && (
                                                <div className="text-sm text-gray-500">
                                                    +{quote.hotels.length - 2} more hotels
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Activities */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <FaWalking className="text-emerald-600" />
                                            Activities ({quote.activities.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {quote.activities.slice(0, 3).map((activity, i) => (
                                                <div key={i} className="text-sm text-gray-600">
                                                    {activity.name}
                                                </div>
                                            ))}
                                            {quote.activities.length > 3 && (
                                                <div className="text-sm text-gray-500">
                                                    +{quote.activities.length - 3} more activities
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <FaShield className="text-green-600" />
                                            Secure Payment
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <FaClock className="text-blue-600" />
                                            Free Cancellation
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="p-6 border-t border-gray-100">
                                    <button
                                        onClick={() => setShowAcceptModal(quote)}
                                        disabled={acceptingQuote === quote._id}
                                        className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {acceptingQuote === quote._id ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Accept This Quote
                                                <FaArrowRight />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Accept Modal */}
            <AnimatePresence>
                {showAcceptModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowAcceptModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="text-6xl mb-4">✈️</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Ready to book?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    You're about to accept the quote from {showAcceptModal.partner.name} for 
                                    {' '}₹{showAcceptModal.costs.final.toLocaleString()}
                                </p>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                    <h4 className="font-semibold mb-2">What happens next:</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Payment link will be sent to your email</li>
                                        <li>• {showAcceptModal.partner.name} will contact you within 24 hours</li>
                                        <li>• Free cancellation up to 48 hours before travel</li>
                                    </ul>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowAcceptModal(null)}
                                        className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                                    >
                                        Review More
                                    </button>
                                    <button
                                        onClick={() => handleAcceptQuote(showAcceptModal)}
                                        className="flex-1 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700"
                                    >
                                        Confirm & Pay
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CompareView;

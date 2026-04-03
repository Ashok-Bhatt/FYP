import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaFilter, FaSearch, FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaStar, FaEye, FaTimes, FaCalendarAlt, FaUserFriends, FaMoneyBillWave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const RequirementDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [requirement, setRequirement] = useState<any>(null);
    const [partners, setPartners] = useState<any[]>([]);
    const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [viewingPartner, setViewingPartner] = useState<any>(null);

    // Filter State
    const [filters, setFilters] = useState({
        destination: '',
        budget: '',
        startDate: '',
        duration: '',
        adults: 1,
        hotelStar: 4,
        searchQuery: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token} ` } };

                // Fetch Requirement
                const reqRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/requirements/${id}`, config);
                setRequirement(reqRes.data);

                // Auto-fill filters
                setFilters({
                    destination: reqRes.data.destination,
                    budget: reqRes.data.budget,
                    startDate: reqRes.data.startDate ? reqRes.data.startDate.split('T')[0] : '',
                    duration: reqRes.data.duration,
                    adults: reqRes.data.pax.adults,
                    hotelStar: reqRes.data.hotelStar,
                    searchQuery: reqRes.data.description || '',
                });

                // Initial Partner Fetch
                fetchPartners({
                    destination: reqRes.data.destination,
                    tripType: reqRes.data.tripType,
                    budget: reqRes.data.budget,
                    startDate: reqRes.data.startDate,
                    duration: reqRes.data.duration,
                    adults: reqRes.data.pax.adults,
                    hotelStar: reqRes.data.hotelStar,
                    searchQuery: reqRes.data.description || '',
                }, config);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [id, user]);

    const fetchPartners = async (filterParams: any, config: any) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/partners/filter`, filterParams, config);
            setPartners(res.data);
        } catch (error) {
            console.error('Error filtering partners:', error);
        }
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        fetchPartners(filters, config);
    };

    const togglePartner = (partnerId: string) => {
        setSelectedPartners(prev =>
            prev.includes(partnerId)
                ? prev.filter(id => id !== partnerId)
                : [...prev, partnerId].slice(0, 3) // Max 3
        );
    };

    const handleGenerateQuotes = async () => {
        if (selectedPartners.length === 0) return;
        setGenerating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/quotes/generate`, {
                requirementId: id,
                partnerIds: selectedPartners,
            }, config);

            navigate('/agent/quotes');
        } catch (error) {
            console.error('Error generating quotes:', error);
            alert('Failed to generate quotes');
        } finally {
            setGenerating(false);
        }
    };

    if (loading || !requirement) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-emerald-400" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-white">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Requirement Details
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${requirement.status === 'PENDING' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' :
                                    requirement.status === 'QUOTED' ? 'border-blue-500/50 text-blue-500 bg-blue-500/10' :
                                        'border-emerald-500/50 text-emerald-500 bg-emerald-500/10'
                                }`}>
                                {requirement.status}
                            </span>
                        </div>
                        <p className="text-gray-400 font-mono text-sm">ID: {requirement._id}</p>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Traveler Info */}
                    <div className="group bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FaUserFriends className="text-emerald-400 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 text-white">Traveler Info</h3>
                        <div className="space-y-3 text-gray-400">
                            <p className="flex justify-between"><span className="text-gray-500">Name</span> <span className="text-white font-medium">{requirement.contactInfo.name}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Email</span> <span className="text-white font-medium">{requirement.contactInfo.email}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Phone</span> <span className="text-white font-medium">{requirement.contactInfo.phone}</span></p>
                        </div>
                    </div>

                    {/* Trip Details */}
                    <div className="group bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FaMapMarkerAlt className="text-blue-400 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 text-white">Trip Details</h3>
                        <div className="space-y-3 text-gray-400">
                            <p className="flex justify-between"><span className="text-gray-500">Destination</span> <span className="text-white font-medium">{requirement.destination}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Type</span> <span className="text-white font-medium">{requirement.tripType}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Duration</span> <span className="text-white font-medium">{requirement.duration} Days</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Pax</span> <span className="text-white font-medium">{requirement.pax.adults} Ad, {requirement.pax.children} Ch</span></p>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="group bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FaStar className="text-purple-400 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 text-white">Preferences</h3>
                        <div className="space-y-3 text-gray-400">
                            <p className="flex justify-between"><span className="text-gray-500">Budget</span> <span className="text-white font-medium">₹{requirement.budget.toLocaleString()}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Hotel</span> <span className="text-white font-medium">{requirement.hotelStar} Star</span></p>
                            <div className="pt-2 flex flex-wrap gap-2">
                                {requirement.preferences.map((pref: string, i: number) => (
                                    <span key={i} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-gray-300">{pref}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Query Description */}
                {requirement.description && (
                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-emerald-500/20 p-8 rounded-3xl mb-12 hover:border-emerald-500/40 transition-all">
                        <h3 className="text-lg font-bold mb-4 text-emerald-400 flex items-center gap-2">
                            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                            User Requirements
                        </h3>
                        <p className="text-gray-300 italic leading-relaxed">"{requirement.description}"</p>
                    </div>
                )}

                {/* Match Partners Section */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-white mb-2">Match Partners</h2>
                            <p className="text-gray-400">Select up to 3 partners to generate quotes</p>
                        </div>
                        <button
                            onClick={handleGenerateQuotes}
                            disabled={selectedPartners.length === 0 || generating}
                            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {generating ? (
                                <>
                                    <FaSpinner className="animate-spin" /> Generating...
                                </>
                            ) : (
                                `Generate Quotes (${selectedPartners.length})`
                            )}
                        </button>
                    </div>

                    {/* Filter Bar - Fixed Overlapping Stars */}
                    <form onSubmit={handleFilter} className="space-y-6 mb-8 bg-black/40 p-6 rounded-2xl border border-white/5">
                        {/* Main Filters Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={filters.destination}
                                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="Anywhere"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</label>
                            <div className="relative">
                                <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="number"
                                    value={filters.budget}
                                    onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="Max Budget"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="number"
                                    value={filters.duration}
                                    onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="Days"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 lg:col-span-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel Rating</label>
                            <div className="flex gap-2">
                                {[3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFilters({ ...filters, hotelStar: star })}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm font-medium transition-all ${filters.hotelStar === star
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <span>{star}</span>
                                        <FaStar className={filters.hotelStar === star ? 'text-white' : 'text-gray-600'} size={12} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        </div>

                        {/* Smart Search Row */}
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Smart Search (AI Powered)</label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={filters.searchQuery}
                                        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="Ex: 'Luxury villas with private pool and ocean view' or 'Family friendly resorts with kids club'..."
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-8 py-3 bg-white hover:bg-emerald-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 group"
                            >
                                <FaFilter size={14} className="group-hover:rotate-12 transition-transform" />
                                Search Partners
                            </button>
                        </div>
                    </form>


                    {/* Partners Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {partners.map(partner => (
                            <div
                                key={partner._id}
                                className={`group relative bg-black/40 border rounded-2xl overflow-hidden transition-all duration-300 ${selectedPartners.includes(partner.userId)
                                        ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-2xl shadow-emerald-500/10'
                                        : 'border-white/10 hover:border-white/30 hover:shadow-xl hover:-translate-y-1'
                                    }`}
                            >
                                {/* Image */}
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={partner.images && partner.images.length > 0 ? partner.images[0] : 'https://placehold.co/600x400?text=No+Image'}
                                        alt={partner.companyName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 flex items-center gap-1 border border-white/10">
                                        <FaStar /> {partner.rating}
                                    </div>

                                    {selectedPartners.includes(partner.userId) && (
                                        <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                                            <FaCheckCircle /> Selected
                                        </div>
                                    )}

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-xl font-serif font-bold text-white mb-1">{partner.companyName}</h3>
                                        <p className="text-xs text-gray-300 flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-emerald-400" /> 
                                            {partner.address?.city ? `${partner.address.city}${partner.address?.country ? ', ' + partner.address.country : ''}` : 'Location not specified'}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10 leading-relaxed">{partner.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-6 h-16 overflow-hidden content-start">
                                        {partner.amenities && partner.amenities.slice(0, 4).map((am: string, i: number) => (
                                            <span key={i} className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md text-gray-400 border border-white/5">{am}</span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Starting from</p>
                                            <p className="text-lg font-bold text-emerald-400">₹{partner.startingPrice ? partner.startingPrice.toLocaleString() : 'N/A'}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setViewingPartner(partner)}
                                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => togglePartner(partner.userId)}
                                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedPartners.includes(partner.userId)
                                                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50'
                                                        : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10'
                                                    }`}
                                            >
                                                {selectedPartners.includes(partner.userId) ? 'Remove' : 'Select'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {partners.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaFilter className="text-gray-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Partners Found</h3>
                            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Partner Details Modal */}
            <AnimatePresence>
                {viewingPartner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setViewingPartner(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-zinc-800"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="relative h-72 md:h-96">
                                <img
                                    src={viewingPartner.images && viewingPartner.images.length > 0 ? viewingPartner.images[0] : 'https://placehold.co/800x400'}
                                    alt={viewingPartner.companyName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                                <button
                                    onClick={() => setViewingPartner(null)}
                                    className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10 hover:rotate-90"
                                >
                                    <FaTimes />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{viewingPartner.companyName}</h2>
                                    <div className="flex items-center gap-4 text-sm">
                                        <p className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                            <FaMapMarkerAlt /> {viewingPartner.destinations.join(', ')}
                                        </p>
                                        <p className="text-yellow-400 flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                            <FaStar /> {viewingPartner.rating} Rating
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                                            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                                            About Partner
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed text-lg">{viewingPartner.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                                            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                            Amenities
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {viewingPartner.amenities && viewingPartner.amenities.map((am: string, i: number) => (
                                                <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors">
                                                    {am}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                            Nearby Sightseeing
                                        </h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {viewingPartner.sightSeeing && viewingPartner.sightSeeing.map((sight: string, i: number) => (
                                                <li key={i} className="flex items-center gap-2 text-gray-300">
                                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                                    {sight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/10 sticky top-6">
                                        <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider">Starting Price</p>
                                        <p className="text-4xl font-bold text-emerald-400 mb-6">₹{viewingPartner.startingPrice ? viewingPartner.startingPrice.toLocaleString() : 'N/A'}</p>

                                        <button
                                            onClick={() => {
                                                togglePartner(viewingPartner.userId);
                                                setViewingPartner(null);
                                            }}
                                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${selectedPartners.includes(viewingPartner.userId)
                                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50'
                                                    : 'bg-white text-black hover:bg-emerald-400 hover:text-black hover:shadow-emerald-500/20'
                                                }`}
                                        >
                                            {selectedPartners.includes(viewingPartner.userId) ? 'Remove Selection' : 'Select Partner'}
                                        </button>
                                    </div>

                                    <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/10">
                                        <h4 className="font-bold mb-4 text-white">Specializations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingPartner.specializations && viewingPartner.specializations.map((spec: string, i: number) => (
                                                <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RequirementDetails;

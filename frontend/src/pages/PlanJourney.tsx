import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlane, FaCalendarAlt, FaUserFriends, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlanJourney: React.FC = () => {
    const navigate = useNavigate();
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        tripType: '',
        budget: '',
        startDate: '',
        duration: '',
        pax: { adults: 2, children: 0 },
        hotelStar: 4,
        preferences: [] as string[],
        description: '',
        contactInfo: { name: '', email: '', phone: '', whatsapp: '' }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...(prev as any)[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleStarClick = (rating: number) => {
        setFormData(prev => ({ ...prev, hotelStar: rating }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/requirements`, formData);
            setLoading(false);
            navigate('/thank-you');
        } catch (error) {
            console.error('Error submitting requirement:', error);
            setLoading(false);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <main className="flex-grow flex items-center justify-center p-4 md:p-8 mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-3xl bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/10 bg-zinc-900/80">
                        <h1 className="text-3xl md:text-4xl font-serif text-white text-center">Plan Your Journey</h1>
                        <p className="text-gray-400 text-center mt-2">Tell us your preferences and we'll craft the perfect itinerary.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                            {/* Destination */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Where to?</label>
                                <div className="relative">
                                    <FaPlane className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                                    <input
                                        type="text"
                                        name="destination"
                                        value={formData.destination}
                                        onChange={handleChange}
                                        placeholder="e.g., Italy, Maldives, Japan"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Trip Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Trip Type</label>
                                <select
                                    name="tripType"
                                    value={formData.tripType}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none"
                                    required
                                >
                                    <option value="" disabled hidden>Select Trip</option>
                                    <option>Honeymoon</option>
                                    <option>Family</option>
                                    <option>Business</option>
                                    <option>Friends</option>
                                    <option>Solo</option>
                                </select>
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Budget (Total)</label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="e.g., 100000"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none"
                                    required
                                />
                            </div>

                            {/* Dates */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                        <div className="relative group">
                            {/* Interactive Icon Layer */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center cursor-pointer z-30"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    try {
                                        (dateInputRef.current as any)?.showPicker();
                                    } catch (err) {
                                        dateInputRef.current?.focus();
                                    }
                                }}
                            >
                                <FaCalendarAlt className="text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                            </div>



                            {/* Date Input Layer */}
                            <input
                                ref={dateInputRef}
                                type="date"
                                name="startDate"
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 outline-none hide-calendar-picker z-10 relative"
                                required
                            />
                        </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Duration (Days)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="e.g., 7"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none"
                                    required
                                />
                            </div>

                            {/* Pax */}
                            <div className="col-span-2 grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Adults</label>
                                    <div className="relative">
                                        <FaUserFriends className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                                        <input
                                            type="number"
                                            name="pax.adults"
                                            value={formData.pax.adults}
                                            onChange={handleChange}
                                            min="1"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Children</label>
                                    <input
                                        type="number"
                                        name="pax.children"
                                        value={formData.pax.children}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Description / Smart Query */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Special Requirements / Describe your dream trip
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange as any}
                                    placeholder="e.g., I want a quiet beachfront villa with a private pool and vegetarian dining options..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none h-32 resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    💡 We will use this description to find the best matching partners for you.
                                </p>
                            </div>

                            {/* Hotel Star Rating */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Hotel Preference (Stars)</label>
                                <div className="flex gap-4">
                                    {[3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleStarClick(star)}
                                            className={`flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${formData.hotelStar === star
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                                : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30'
                                                }`}
                                        >
                                            <span className="font-bold text-lg">{star}</span>
                                            <FaStar className={formData.hotelStar === star ? 'text-emerald-400' : 'text-gray-600'} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="col-span-2 border-t border-white/10 pt-6 mt-2">
                                <h3 className="text-lg font-serif text-white mb-4">Contact Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        name="contactInfo.name"
                                        value={formData.contactInfo.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="contactInfo.email"
                                        value={formData.contactInfo.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="contactInfo.phone"
                                        value={formData.contactInfo.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-emerald-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-400/20"
                        >
                            {loading ? 'Submitting...' : 'Get My Free Quote'}
                        </button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
};

export default PlanJourney;

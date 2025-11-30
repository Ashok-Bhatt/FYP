import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaHotel, FaCar, FaUmbrellaBeach, FaMapMarkerAlt, FaStar, FaMoneyBillWave, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AgentHeader from '../../components/AgentHeader';

const Inventory: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('hotel');
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/partners/inventory/${activeTab}`, formData, config);
            setSuccess(true);
            setFormData({}); // Reset form
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error adding inventory:', error);
            alert('Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    const tabVariants = {
        active: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', scale: 1.05 },
        inactive: { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#9ca3af', scale: 1 }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-white">
            <AgentHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
                        Inventory Management
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Expand your offerings by adding new hotels, transport options, and exclusive activities to your portfolio.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* Tabs */}
                    <div className="flex justify-center gap-4 mb-10">
                        <motion.button
                            variants={tabVariants}
                            animate={activeTab === 'hotel' ? 'active' : 'inactive'}
                            onClick={() => setActiveTab('hotel')}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border border-white/5 hover:border-emerald-500/30"
                        >
                            <FaHotel className="text-xl" /> Hotels
                        </motion.button>
                        <motion.button
                            variants={tabVariants}
                            animate={activeTab === 'transport' ? 'active' : 'inactive'}
                            onClick={() => setActiveTab('transport')}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border border-white/5 hover:border-emerald-500/30"
                        >
                            <FaCar className="text-xl" /> Transport
                        </motion.button>
                        <motion.button
                            variants={tabVariants}
                            animate={activeTab === 'activity' ? 'active' : 'inactive'}
                            onClick={() => setActiveTab('activity')}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border border-white/5 hover:border-emerald-500/30"
                        >
                            <FaUmbrellaBeach className="text-xl" /> Activities
                        </motion.button>
                    </div>

                    {/* Form Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={activeTab}
                        className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-xl"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className={`p-4 rounded-2xl ${activeTab === 'hotel' ? 'bg-emerald-500/20 text-emerald-400' :
                                    activeTab === 'transport' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-purple-500/20 text-purple-400'
                                }`}>
                                {activeTab === 'hotel' && <FaHotel className="text-2xl" />}
                                {activeTab === 'transport' && <FaCar className="text-2xl" />}
                                {activeTab === 'activity' && <FaUmbrellaBeach className="text-2xl" />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white capitalize">Add New {activeTab}</h3>
                                <p className="text-gray-400 text-sm">Fill in the details to add to your inventory</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {activeTab === 'hotel' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Hotel Name</label>
                                            <div className="relative">
                                                <FaHotel className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name || ''}
                                                    placeholder="e.g. Grand Hyatt"
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">City</label>
                                            <div className="relative">
                                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city || ''}
                                                    placeholder="e.g. Mumbai"
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Star Rating</label>
                                            <div className="relative">
                                                <FaStar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <select
                                                    name="starRating"
                                                    value={formData.starRating || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select Rating</option>
                                                    <option value="3">3 Star</option>
                                                    <option value="4">4 Star</option>
                                                    <option value="5">5 Star</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Price per Night (Avg)</label>
                                            <div className="relative">
                                                <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price || ''}
                                                    placeholder="e.g. 5000"
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'transport' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Vehicle Type</label>
                                            <div className="relative">
                                                <FaCar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="text"
                                                    name="type"
                                                    value={formData.type || ''}
                                                    placeholder="e.g. SUV, Sedan"
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Price Per Day</label>
                                            <div className="relative">
                                                <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price || ''}
                                                    placeholder="e.g. 2500"
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 ml-1">City / Region</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city || ''}
                                                placeholder="e.g. Delhi NCR"
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 ml-1">Activity Name</label>
                                        <div className="relative">
                                            <FaUmbrellaBeach className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name || ''}
                                                placeholder="e.g. Scuba Diving"
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">City / Location</label>
                                            <div className="relative">
                                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city || ''}
                                                    placeholder="e.g. Goa"
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Price Per Person</label>
                                            <div className="relative">
                                                <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price || ''}
                                                    placeholder="e.g. 1500"
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || success}
                                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${success
                                        ? 'bg-green-500 text-black hover:bg-green-400 shadow-green-500/20'
                                        : 'bg-white text-black hover:bg-gray-200 shadow-white/10'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : success ? <><FaCheckCircle /> Added Successfully</> : <><FaPlus /> Add to Inventory</>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;

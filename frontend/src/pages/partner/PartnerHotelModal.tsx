import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSave, FaSpinner, FaCheckCircle, FaHotel, FaPhone, FaMapMarkerAlt, FaStar, FaMoneyBillWave, FaClock, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface PartnerProfileData {
    _id?: string;
    companyName?: string;
    destinations?: string;
    type?: string;
    specializations?: string[];
    budgetRange?: {
        min?: number;
        max?: number;
    };
    description?: string;
    images?: string[];
    amenities?: string[];
    startingPrice?: number;
    reviews?: number;
    address?: {
        street: string;
        city: string;
        pinCode: string;
        country: string;
    };
    starRating?: number;
    roomTypes?: Array<{
        name: string;
        price: number;
    }>;
    contactInfo?: {
        phone: string;
        website?: string;
        email?: string;
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };
    activities?: Array<{
        name: string;
        category: string;
        duration: string;
        price: number;
        description: string;
    }>;
    checkIn?: string;
    checkOut?: string;
    sightSeeings?: Array<{
        name: string;
        images?: string[];
        description: string;
        entryFee?: number;
    }>;
}

interface PartnerHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Partial<PartnerProfileData>;
    onSuccess: () => void;
}

const PartnerHotelModal: React.FC<PartnerHotelModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<PartnerProfileData>(initialData);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setProfile(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setProfile(prev => ({
            ...prev,
            [parent]: {
                ...(prev as any)[parent],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (field: string, index: number, subField: string, value: any) => {
        setProfile(prev => ({
            ...prev,
            [field]: (prev as any)[field]?.map((item: any, i: number) => 
                i === index ? { ...item, [subField]: value } : item
            )
        }));
    };

    const addArrayItem = (field: string, newItem: any) => {
        setProfile(prev => ({
            ...prev,
            [field]: [...((prev as any)[field] || []), newItem]
        }));
    };

    const removeArrayItem = (field: string, index: number) => {
        setProfile(prev => ({
            ...prev,
            [field]: (prev as any)[field]?.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/partners/profile`, profile, config);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onSuccess();
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Error saving hotel:', error);
            alert('Failed to save hotel details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                    <FaTimes size={24} />
                </button>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
                        {profile._id ? 'Edit Hotel' : 'Add New Hotel'}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Provide all necessary details about your property
                    </p>
                </div>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-emerald-500 bg-opacity-20 border border-emerald-500 rounded-lg flex items-center"
                    >
                        <FaCheckCircle className="text-emerald-500 mr-2" />
                        <span>Hotel details successfully saved!</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <FaHotel className="mr-3 text-emerald-500" />
                            Basic Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={profile.companyName || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
                                <input
                                    type="text"
                                    name="destinations"
                                    value={profile.destinations || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                <select
                                    name="type"
                                    value={profile.type || 'Hotel'}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                >
                                    <option value="Hotel">Hotel</option>
                                    <option value="DMC">DMC</option>
                                    <option value="Mixed">Mixed</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Star Rating</label>
                                <select
                                    name="starRating"
                                    value={profile.starRating || ''}
                                    onChange={(e) => handleNestedChange('starRating', '', Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                >
                                    <option value="">Select Rating</option>
                                    <option value="1">1 Star</option>
                                    <option value="2">2 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="5">5 Stars</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={profile.description || ''}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                required
                            />
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Starting Price (₹)</label>
                                <input
                                    type="number"
                                    name="startingPrice"
                                    value={profile.startingPrice || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={profile.budgetRange?.min || ''}
                                        onChange={(e) => handleNestedChange('budgetRange', 'min', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={profile.budgetRange?.max || ''}
                                        onChange={(e) => handleNestedChange('budgetRange', 'max', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Address */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <FaMapMarkerAlt className="mr-3 text-emerald-500" />
                            Address Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Street</label>
                                <input
                                    type="text"
                                    value={profile.address?.street || ''}
                                    onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                                <input
                                    type="text"
                                    value={profile.address?.city || ''}
                                    onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">PIN Code</label>
                                <input
                                    type="text"
                                    value={profile.address?.pinCode || ''}
                                    onChange={(e) => handleNestedChange('address', 'pinCode', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                                <input
                                    type="text"
                                    value={profile.address?.country || ''}
                                    onChange={(e) => handleNestedChange('address', 'country', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    required
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <FaPhone className="mr-3 text-emerald-500" />
                            Contact Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    value={profile.contactInfo?.phone || ''}
                                    onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profile.contactInfo?.email || ''}
                                    onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                                <input
                                    type="url"
                                    value={profile.contactInfo?.website || ''}
                                    onChange={(e) => handleNestedChange('contactInfo', 'website', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
                                <input
                                    type="url"
                                    value={profile.contactInfo?.facebook || ''}
                                    onChange={(e) => handleNestedChange('contactInfo', 'facebook', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                                <input
                                    type="url"
                                    value={profile.contactInfo?.instagram || ''}
                                    onChange={(e) => handleNestedChange('contactInfo', 'instagram', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                                <input
                                    type="url"
                                    value={profile.contactInfo?.twitter || ''}
                                    onChange={(e) => handleNestedChange('contactInfo', 'twitter', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                                <input
                                    type="url"
                                    value={profile.contactInfo?.linkedin || ''}
                                    onChange={(e) => handleNestedChange('contactInfo', 'linkedin', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Room Types */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <FaMoneyBillWave className="mr-3 text-emerald-500" />
                            Room Types
                        </h2>
                        
                        {(profile.roomTypes || []).map((room, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Room Name"
                                        value={room.name}
                                        onChange={(e) => handleArrayChange('roomTypes', index, 'name', e.target.value)}
                                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={room.price}
                                            onChange={(e) => handleArrayChange('roomTypes', index, 'price', Number(e.target.value))}
                                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('roomTypes', index)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <button
                            type="button"
                            onClick={() => addArrayItem('roomTypes', { name: '', price: 0 })}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                        >
                            Add Room Type
                        </button>
                    </motion.div>

                    {/* Check-in/Check-out */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <FaClock className="mr-3 text-emerald-500" />
                            Check-in & Check-out
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Check-in Time</label>
                                <input
                                    type="text"
                                    value={profile.checkIn || ''}
                                    onChange={(e) => handleNestedChange('checkIn', '', e.target.value)}
                                    placeholder="e.g., 2:00 PM"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Check-out Time</label>
                                <input
                                    type="text"
                                    value={profile.checkOut || ''}
                                    onChange={(e) => handleNestedChange('checkOut', '', e.target.value)}
                                    placeholder="e.g., 12:00 PM"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center"
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" />
                                    Save Hotel
                                </>
                            )}
                        </button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default PartnerHotelModal;

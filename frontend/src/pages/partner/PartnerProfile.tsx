import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSpinner, FaEdit, FaHotel, FaMapMarkerAlt, FaStar, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PartnerHotelModal from './PartnerHotelModal';

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

const PartnerProfile: React.FC = () => {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<PartnerProfileData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<Partial<PartnerProfileData>>({});

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/partners/me`, config);
            let data = response.data;
            if (!Array.isArray(data)) {
                // To handle legacy data if it somehow returns an object
                data = data ? [data] : [];
            }
            setProfiles(data);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-emerald-500" />
            </div>
        );
    }

    const handleOpenModal = (data: Partial<PartnerProfileData> = {}) => {
        setModalData(data);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-left">
                        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                            My Hotels
                        </h1>
                        <p className="text-gray-400 max-w-2xl">
                            Manage your existing hotel properties or add new ones
                        </p>
                    </div>
                    {profiles.length > 0 && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors inline-flex items-center shadow-lg shadow-emerald-500/20"
                        >
                            <FaPlus className="mr-2" /> Add New Hotel
                        </button>
                    )}
                </div>

                {profiles.length === 0 ? (
                    <div className="text-center bg-gray-900 bg-opacity-50 p-12 rounded-xl border border-gray-800">
                        <FaHotel className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">No hotels found</h2>
                        <p className="text-gray-400 mb-6">You haven't added any properties yet.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors inline-flex items-center"
                        >
                            <FaPlus className="mr-2" /> Add Your First Hotel
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.map((profile, index) => (
                            <motion.div
                                key={profile._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-900 bg-opacity-50 rounded-xl overflow-hidden border border-gray-800 flex flex-col"
                            >
                                <div className="p-6 flex-grow">
                                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                                        <FaHotel className="text-emerald-500 mr-2" />
                                        {profile.companyName || 'Unnamed Hotel'}
                                    </h3>
                                    <p className="text-gray-400 flex items-center text-sm mb-4">
                                        <FaMapMarkerAlt className="mr-1" />
                                        {profile.address?.city || 'No Location'}, {profile.address?.country}
                                    </p>
                                    <div className="flex gap-2 mb-4">
                                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs flex items-center">
                                            <FaStar className="mr-1" /> {profile.starRating || 'N/A'} Star
                                        </span>
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                            {profile.type || 'Hotel'}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm line-clamp-3">
                                        {profile.description || 'No description provided.'}
                                    </p>
                                </div>
                                <div className="p-4 bg-black/40 border-t border-gray-800">
                                    <button
                                        onClick={() => handleOpenModal(profile)}
                                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center"
                                    >
                                        <FaEdit className="mr-2" /> Edit Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <PartnerHotelModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                initialData={modalData} 
                onSuccess={fetchProfiles} 
            />
        </div>
    );
};

export default PartnerProfile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSave, FaSpinner, FaCheckCircle, FaHotel, FaPhone, FaMapMarkerAlt, FaStar, FaMoneyBillWave, FaClock, FaTimes, FaPlus, FaImage, FaTrash, FaMap } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface PartnerProfileData {
    _id?: string;
    companyName?: string;
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

const ImageManager: React.FC<{
    images: string[];
    companyName?: string;
    sightseeingName?: string;
    onImageAdded: (url: string) => void;
    onImageRemoved: (url: string) => void;
    isSaved: boolean;
}> = ({ images, companyName, sightseeingName, onImageAdded, onImageRemoved, isSaved }) => {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [linkInput, setLinkInput] = useState('');
    const [activeTab, setActiveTab] = useState<'link' | 'local'>('link');

    const handleAddLink = async () => {
        if (!linkInput) return;
        if (!isSaved) return alert('Please save the hotel first to manage images');
        
        setUploading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/partners/image`, {
                companyName,
                sightseeingName,
                imageUrl: linkInput
            }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            onImageAdded(linkInput);
            setLinkInput('');
        } catch (error) {
            console.error('Error adding image:', error);
            alert('Failed to add image');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        if (!isSaved) return alert('Please save the hotel first to manage images');
        
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            setUploading(true);
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/partners/image`, {
                    companyName,
                    sightseeingName,
                    base64Image: base64String
                }, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                
                // response.data holds the updated profile. Instead of extracting, just emit success and the parent can reload or we append.
                // Assuming the new image is the last one in the updated array
                let updatedImages;
                if (sightseeingName) {
                    const ss = response.data.sightSeeings.find((s: any) => s.name === sightseeingName);
                    updatedImages = ss?.images || [];
                } else {
                    updatedImages = response.data.images || [];
                }
                const newImgUrl = updatedImages[updatedImages.length - 1];
                if (newImgUrl) onImageAdded(newImgUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image');
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = async (url: string) => {
        if (!isSaved) return alert('Please save the hotel first to manage images');
        if (!confirm('Are you sure you want to remove this image?')) return;
        
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/partners/image`, {
                data: { companyName, sightseeingName, imageUrl: url },
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            onImageRemoved(url);
        } catch (error) {
            console.error('Error removing image:', error);
            alert('Failed to remove image');
        }
    };

    return (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <FaImage className="mr-2 text-emerald-500" />
                Manage Images
            </h4>
            
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {images.map((imgUrl, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-600 aspect-video">
                            <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(imgUrl)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="flex gap-2 mb-2 border-b border-gray-700 pb-2">
                <button 
                    type="button" 
                    onClick={() => setActiveTab('link')} 
                    className={`text-sm px-2 py-1 ${activeTab === 'link' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400'}`}
                >
                    Add by Link
                </button>
                <button 
                    type="button" 
                    onClick={() => setActiveTab('local')} 
                    className={`text-sm px-2 py-1 ${activeTab === 'local' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400'}`}
                >
                    Upload Local
                </button>
            </div>
            
            {activeTab === 'link' ? (
                <div className="flex gap-2">
                    <input
                        type="url"
                        placeholder="Image URL"
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm"
                    />
                    <button
                        type="button"
                        onClick={handleAddLink}
                        disabled={uploading || !linkInput}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 text-sm flex items-center"
                    >
                        {uploading ? <FaSpinner className="animate-spin" /> : 'Add'}
                    </button>
                </div>
            ) : (
                <div className="flex items-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 disabled:opacity-50"
                    />
                    {uploading && <FaSpinner className="animate-spin text-emerald-500 ml-2" />}
                </div>
            )}
            {!isSaved && <p className="text-xs text-yellow-500 mt-2">Please save the hotel first to manage images.</p>}
        </div>
    );
};

const PartnerHotelModal: React.FC<PartnerHotelModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<PartnerProfileData>(initialData);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Local states for tag inputs
    const [currentSpecialization, setCurrentSpecialization] = useState("");
    const [currentAmenity, setCurrentAmenity] = useState("");

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

    const handleAddStringItem = (field: 'specializations' | 'amenities', value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        if (!value.trim()) return;
        setProfile(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), value.trim()]
        }));
        setter("");
    };

    const handleRemoveStringItem = (field: 'specializations' | 'amenities', index: number) => {
        setProfile(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, i) => i !== index)
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
            // Sanitize payload to strip out any trailing empty array items
            const payload = {
                ...profile,
                roomTypes: profile.roomTypes?.filter(r => r.name && r.name.trim() !== ''),
                sightSeeings: profile.sightSeeings?.filter(s => s.name && s.name.trim() !== '')
            };

            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/partners/profile`, payload, config);
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
                            <div className="md:col-span-2">
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
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Specializations</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={currentSpecialization}
                                        onChange={(e) => setCurrentSpecialization(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddStringItem('specializations', currentSpecialization, setCurrentSpecialization);
                                            }
                                        }}
                                        placeholder="e.g. Scuba, Safari"
                                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddStringItem('specializations', currentSpecialization, setCurrentSpecialization)}
                                        className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(profile.specializations || []).map((item, index) => (
                                        <div key={index} className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-full flex items-center gap-2 text-sm">
                                            {item}
                                            <button type="button" onClick={() => handleRemoveStringItem('specializations', index)} className="text-gray-400 hover:text-red-400">
                                                <FaTimes size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                                    onChange={handleInputChange}
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

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Amenities</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={currentAmenity}
                                    onChange={(e) => setCurrentAmenity(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddStringItem('amenities', currentAmenity, setCurrentAmenity);
                                        }
                                    }}
                                    placeholder="e.g. Wi-Fi, Pool, Gym"
                                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAddStringItem('amenities', currentAmenity, setCurrentAmenity)}
                                    className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(profile.amenities || []).map((item, index) => (
                                    <div key={index} className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-full flex items-center gap-2 text-sm">
                                        {item}
                                        <button type="button" onClick={() => handleRemoveStringItem('amenities', index)} className="text-gray-400 hover:text-red-400">
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                                    name="checkIn"
                                    value={profile.checkIn || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2:00 PM"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Check-out Time</label>
                                <input
                                    type="text"
                                    name="checkOut"
                                    value={profile.checkOut || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 12:00 PM"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Hotel Images */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <FaImage className="mr-3 text-emerald-500" />
                            Hotel Images
                        </h2>
                        <ImageManager
                            images={profile.images || []}
                            companyName={profile.companyName}
                            isSaved={!!profile._id}
                            onImageAdded={(url) => setProfile(prev => ({ ...prev, images: [...(prev.images || []), url] }))}
                            onImageRemoved={(url) => setProfile(prev => ({ ...prev, images: (prev.images || []).filter(u => u !== url) }))}
                        />
                    </motion.div>

                    {/* Sightseeings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <FaMap className="mr-3 text-emerald-500" />
                            Sightseeings
                        </h2>
                        
                        {(profile.sightSeeings || []).map((ss, index) => (
                            <div key={index} className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold">Sightseeing #{index + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('sightSeeings', index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={ss.name}
                                        onChange={(e) => handleArrayChange('sightSeeings', index, 'name', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Entry Fee (Optional)"
                                        value={ss.entryFee || ''}
                                        onChange={(e) => handleArrayChange('sightSeeings', index, 'entryFee', Number(e.target.value))}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                    />
                                </div>
                                <textarea
                                    placeholder="Description"
                                    value={ss.description}
                                    onChange={(e) => handleArrayChange('sightSeeings', index, 'description', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                                />

                                <ImageManager
                                    images={ss.images || []}
                                    companyName={profile.companyName}
                                    sightseeingName={ss.name}
                                    isSaved={!!profile._id}
                                    onImageAdded={(url) => {
                                        const updatedSS = { ...ss, images: [...(ss.images || []), url] };
                                        handleArrayChange('sightSeeings', index, 'images', updatedSS.images);
                                    }}
                                    onImageRemoved={(url) => {
                                        const updatedSS = { ...ss, images: (ss.images || []).filter(u => u !== url) };
                                        handleArrayChange('sightSeeings', index, 'images', updatedSS.images);
                                    }}
                                />
                            </div>
                        ))}
                        
                        <button
                            type="button"
                            onClick={() => addArrayItem('sightSeeings', { name: '', description: '', entryFee: 0, images: [] })}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                        >
                            Add Sightseeing
                        </button>
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

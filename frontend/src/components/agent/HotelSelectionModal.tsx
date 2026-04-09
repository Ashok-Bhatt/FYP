import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBed, FaHiking, FaCamera, FaCheck, FaRupeeSign } from 'react-icons/fa';

interface RoomType {
  name: string;
  price: number;
}

interface Activity {
  name: string;
  category: string;
  duration: string;
  price: number;
  description: string;
}

interface Sightseeing {
  name: string;
  images?: string[];
  description: string;
  entryFee?: number;
}

interface Partner {
  _id: string;
  userId: string;
  companyName: string;
  type: 'DMC' | 'Hotel' | 'Mixed';
  roomTypes: RoomType[];
  activities: Activity[];
  sightSeeings: Sightseeing[];
  address?: {
    city: string;
  };
}

interface Requirement {
  _id: string;
  destination: string;
  duration: number;
  budget: number;
  pax: {
    adults: number;
    children: number;
  };
}

interface HotelSelectionModalProps {
  partner: Partner;
  requirement: Requirement;
  isOpen: boolean;
  onClose: () => void;
  onGenerateQuote: (selection: {
    partnerId: string;
    roomTypeName: string;
    activities: string[];
    sightSeeings: string[];
  }) => void;
  isGenerating?: boolean;
}

const HotelSelectionModal: React.FC<HotelSelectionModalProps> = ({
  partner,
  requirement,
  isOpen,
  onClose,
  onGenerateQuote,
  isGenerating = false,
}) => {
  // State for selections
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedSightseeings, setSelectedSightseeings] = useState<string[]>([]);
  const [pricing, setPricing] = useState({
    basePrice: 0,
    activitiesPrice: 0,
    sightseeingPrice: 0,
    finalPrice: 0,
  });

  // Initialize with first room type as default
  useEffect(() => {
    if (partner?.roomTypes?.length > 0 && !selectedRoom) {
      setSelectedRoom(partner.roomTypes[0].name);
    }
  }, [partner, selectedRoom]);

  // Calculate common values
  const nights = Math.max(1, requirement?.duration ? requirement.duration - 1 : 0);
  const adults = requirement?.pax?.adults || 2;
  const children = requirement?.pax?.children || 0;
  const totalPersons = adults + 0.5 * children;

  // Calculate pricing whenever selection changes
  useEffect(() => {
    if (!partner || !requirement) return;

    // Calculate base room price
    const room = partner.roomTypes?.find(r => r.name === selectedRoom);
    const basePrice = room ? room.price * nights * totalPersons : 0;

    // Calculate activities price
    const activitiesPrice = selectedActivities.reduce((sum, activityName) => {
      const activity = partner.activities?.find(a => a.name === activityName);
      return sum + (activity ? activity.price * totalPersons : 0);
    }, 0);

    // Calculate sightseeing price
    const sightseeingPrice = selectedSightseeings.reduce((sum, sightName) => {
      const sight = partner.sightSeeings?.find(s => s.name === sightName);
      return sum + (sight ? (sight.entryFee || 0) * totalPersons : 0);
    }, 0);

    const netCost = basePrice + activitiesPrice + sightseeingPrice;
    const finalPrice = netCost * 1.1; // 10% margin

    setPricing({
      basePrice,
      activitiesPrice,
      sightseeingPrice,
      finalPrice,
    });
  }, [selectedRoom, selectedActivities, selectedSightseeings, partner, requirement, nights, totalPersons]);

  // Toggle activity selection
  const toggleActivity = (name: string) => {
    setSelectedActivities(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  // Toggle sightseeing selection
  const toggleSightseeing = (name: string) => {
    setSelectedSightseeings(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  // Handle generate quote
  const handleGenerate = () => {
    if (!selectedRoom) return;
    
    onGenerateQuote({
      partnerId: partner.userId,
      roomTypeName: selectedRoom,
      activities: selectedActivities,
      sightSeeings: selectedSightseeings,
    });
  };

  if (!isOpen || !partner) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-zinc-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">{partner.companyName}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {partner.address?.city} • {partner.type} • {requirement.duration} Days
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 pb-32 space-y-8">
              
              {/* Room Selection */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FaBed className="text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Select Room Type</h3>
                  <span className="text-xs text-gray-500 ml-2">(Select one)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partner.roomTypes?.map((room) => (
                    <div
                      key={room.name}
                      onClick={() => setSelectedRoom(room.name)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedRoom === room.name
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-white">{room.name}</h4>
                        {selectedRoom === room.name && (
                          <FaCheck className="text-emerald-400" />
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        <FaRupeeSign className="inline text-xs" />
                        {room.price.toLocaleString()} / person per night
                      </p>
                      <p className="text-emerald-400 font-bold mt-1">
                        Total: <FaRupeeSign className="inline text-sm" />
                        {(room.price * nights * totalPersons).toLocaleString()}
                        <span className="text-gray-500 text-xs font-normal"> ({nights} nights × {totalPersons} persons)</span>
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Activities Selection */}
              {partner.activities?.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FaHiking className="text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Select Activities</h3>
                    <span className="text-xs text-gray-500 ml-2">(Multiple allowed)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {partner.activities.map((activity) => (
                      <div
                        key={activity.name}
                        onClick={() => toggleActivity(activity.name)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedActivities.includes(activity.name)
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{activity.name}</h4>
                            <p className="text-gray-400 text-xs mt-1">{activity.duration} • {activity.category}</p>
                            <p className="text-gray-400 text-xs">
                              <FaRupeeSign className="inline text-xs" />
                              {activity.price.toLocaleString()} / person
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 font-bold">
                              Total: <FaRupeeSign className="inline text-sm" />
                              {(activity.price * totalPersons).toLocaleString()}
                            </p>
                            {selectedActivities.includes(activity.name) && (
                              <FaCheck className="text-emerald-400 mt-1 ml-auto" />
                            )}
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs mt-2 line-clamp-2">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Sightseeing Selection */}
              {partner.sightSeeings?.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FaCamera className="text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Select Sightseeing</h3>
                    <span className="text-xs text-gray-500 ml-2">(Multiple allowed)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {partner.sightSeeings.map((sight) => (
                      <div
                        key={sight.name}
                        onClick={() => toggleSightseeing(sight.name)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedSightseeings.includes(sight.name)
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{sight.name}</h4>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{sight.description}</p>
                            <p className="text-gray-400 text-xs">
                              <FaRupeeSign className="inline text-xs" />
                              {(sight.entryFee || 0).toLocaleString()} / person
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 font-bold">
                              Total: <FaRupeeSign className="inline text-sm" />
                              {((sight.entryFee || 0) * totalPersons).toLocaleString()}
                            </p>
                            {selectedSightseeings.includes(sight.name) && (
                              <FaCheck className="text-emerald-400 mt-1 ml-auto" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Footer with Pricing */}
            <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-sm border-t border-white/10 p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Pricing Breakdown */}
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between gap-8 text-gray-400">
                    <span>Base Price (Room)</span>
                    <span className="text-white">{formatPrice(pricing.basePrice)}</span>
                  </div>
                  {pricing.activitiesPrice > 0 && (
                    <div className="flex justify-between gap-8 text-gray-400">
                      <span>Activities</span>
                      <span className="text-white">+ {formatPrice(pricing.activitiesPrice)}</span>
                    </div>
                  )}
                  {pricing.sightseeingPrice > 0 && (
                    <div className="flex justify-between gap-8 text-gray-400">
                      <span>Sightseeing</span>
                      <span className="text-white">+ {formatPrice(pricing.sightseeingPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-8 pt-2 border-t border-white/10">
                    <span className={`font-semibold ${pricing.finalPrice > (requirement.budget || Infinity) ? 'text-red-400' : 'text-emerald-400'}`}>
                      Final Price (incl. 10% margin)
                    </span>
                    <span className={`font-bold text-lg ${pricing.finalPrice > (requirement.budget || Infinity) ? 'text-red-400' : 'text-emerald-400'}`}>
                      {formatPrice(pricing.finalPrice)}
                    </span>
                  </div>
                  {requirement.budget > 0 && (
                    <div className="flex justify-between gap-8 text-gray-500 text-xs mt-1">
                      <span>Your Budget</span>
                      <span>{formatPrice(requirement.budget)}</span>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!selectedRoom || isGenerating}
                  className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin">⚪</span>
                      Generating Quote...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Generate Quote
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HotelSelectionModal;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaBed, FaHiking, FaCamera, FaCheck, FaRupeeSign, 
  FaPlane, FaArrowRight, FaArrowLeft 
} from 'react-icons/fa';

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

interface Flight {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    iata: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    iata: string;
    time: string;
    date: string;
  };
  duration: string;
  class: string;
  baggage: string;
  price: number;
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
  transport?: {
    required: boolean;
    from: string;
  };
}

interface QuotationBuilderModalProps {
  partner: Partner;
  requirement: Requirement;
  isOpen: boolean;
  onClose: () => void;
  onGenerateQuote: (selection: {
    partnerId: string;
    roomTypeName: string;
    activities: string[];
    sightSeeings: string[];
    flight?: Flight;
  }) => void;
  isGenerating?: boolean;
}

const STEPS = {
  HOTEL: 1,
  TRANSPORT: 2,
};

const QuotationBuilderModal: React.FC<QuotationBuilderModalProps> = ({
  partner,
  requirement,
  isOpen,
  onClose,
  onGenerateQuote,
  isGenerating = false,
}) => {
  
  // Step management
  const [currentStep, setCurrentStep] = useState(STEPS.HOTEL);
  const needsTransport = requirement.transport?.required === true;
  const totalSteps = needsTransport ? 2 : 1;

  // Step 1: Hotel State
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedSightseeings, setSelectedSightseeings] = useState<string[]>([]);

  // Step 2: Transport State (Manual Entry)
  const [selectedFlight, setSelectedFlight] = useState<Flight>({
    airline: '',
    flightNumber: '',
    class: 'Economy',
    baggage: 'Checked: 20kg, Cabin: 7kg',
    departure: { 
      airport: '', 
      iata: '', 
      date: new Date().toISOString().split('T')[0], 
      time: '12:00' 
    },
    arrival: { 
      airport: '', 
      iata: '', 
      date: new Date().toISOString().split('T')[0], 
      time: '14:00' 
    },
    duration: '2h 00m',
    price: 0,
  });

  // Pricing State
  const [pricing, setPricing] = useState({
    basePrice: 0,
    activitiesPrice: 0,
    sightseeingPrice: 0,
    flightPrice: 0,
    finalPrice: 0,
  });

  // Calculate common values
  const nights = Math.max(1, requirement?.duration ? requirement.duration - 1 : 0);
  const adults = requirement?.pax?.adults || 2;
  const children = requirement?.pax?.children || 0;
  const totalPersons = adults + 0.5 * children;

  // Initialize with first room type as default
  useEffect(() => {
    if (partner?.roomTypes?.length > 0 && !selectedRoom) {
      setSelectedRoom(partner.roomTypes[0].name);
    }
  }, [partner, selectedRoom]);

  // Calculate pricing whenever selection changes
  useEffect(() => {
    if (!partner || !requirement) return;

    const room = partner.roomTypes?.find(r => r.name === selectedRoom);
    const basePrice = room ? room.price * nights * totalPersons : 0;

    const activitiesPrice = selectedActivities.reduce((sum, activityName) => {
      const activity = partner.activities?.find(a => a.name === activityName);
      return sum + (activity ? activity.price * totalPersons : 0);
    }, 0);

    const sightseeingPrice = selectedSightseeings.reduce((sum, sightName) => {
      const sight = partner.sightSeeings?.find(s => s.name === sightName);
      return sum + (sight ? (sight.entryFee || 0) * totalPersons : 0);
    }, 0);

    const flightPrice = selectedFlight ? selectedFlight.price * totalPersons : 0;

    const netCost = basePrice + activitiesPrice + sightseeingPrice + flightPrice;
    const finalPrice = netCost * 1.1; // 10% margin

    setPricing({
      basePrice,
      activitiesPrice,
      sightseeingPrice,
      flightPrice,
      finalPrice,
    });
  }, [selectedRoom, selectedActivities, selectedSightseeings, selectedFlight, partner, requirement, nights, totalPersons]);

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

  // Handle flight input changes
  const handleFlightChange = (field: string, value: any, subfield?: string) => {
    setSelectedFlight(prev => {
      if (subfield) {
        return {
          ...prev,
          [field]: { ...prev[field as keyof Flight] as object, [subfield]: value }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep === STEPS.HOTEL && needsTransport) {
      setCurrentStep(STEPS.TRANSPORT);
    }
  };

  // Handle previous step
  const handleBack = () => {
    if (currentStep === STEPS.TRANSPORT) {
      setCurrentStep(STEPS.HOTEL);
    }
  };

  // Handle generate quote
  const handleGenerate = () => {
    if (!selectedRoom) return;
    
    // Validate flight selection if transport step is required
    if (needsTransport && !selectedFlight) {
      alert('Please select a flight to continue');
      return;
    }
    
    onGenerateQuote({
      partnerId: partner.userId,
      roomTypeName: selectedRoom,
      activities: selectedActivities,
      sightSeeings: selectedSightseeings,
      flight: selectedFlight,
    });
  };

  // Check if can proceed to next step
  const canProceed = () => {
    if (currentStep === STEPS.HOTEL) {
      return !!selectedRoom;
    }
    return true;
  };

  if (!isOpen || !partner) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Step Indicator Component
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        currentStep === STEPS.HOTEL 
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
          : 'bg-white/5 text-gray-400 border border-white/10'
      }`}>
        <FaBed />
        <span className="text-sm font-medium">Hotel</span>
      </div>
      
      {needsTransport && (
        <>
          <div className="w-8 h-px bg-white/20" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            currentStep === STEPS.TRANSPORT 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
              : 'bg-white/5 text-gray-400 border border-white/10'
          }`}>
            <FaPlane />
            <span className="text-sm font-medium">Transport</span>
          </div>
        </>
      )}
    </div>
  );

  // Render Step 1: Hotel Selection
  const renderHotelStep = () => (
    <div className="space-y-8">
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
  );

  // Render Step 2: Transport Selection (Manual Form)
  const renderTransportStep = () => (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-6">
          <FaPlane className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Enter Flight Details</h3>
          <span className="text-xs text-gray-500 ml-2">Refer to real carrier data</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/10">
          {/* Airline Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Airline Name</label>
              <input
                type="text"
                value={selectedFlight.airline}
                onChange={(e) => handleFlightChange('airline', e.target.value)}
                placeholder="e.g., Emirates, Indigo"
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Flight Number</label>
              <input
                type="text"
                value={selectedFlight.flightNumber}
                onChange={(e) => handleFlightChange('flightNumber', e.target.value)}
                placeholder="e.g., EK-503"
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Class</label>
                <select
                  value={selectedFlight.class}
                  onChange={(e) => handleFlightChange('class', e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First Class">First Class</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Price (Per Person)</label>
                <input
                  type="number"
                  value={selectedFlight.price}
                  onChange={(e) => handleFlightChange('price', Number(e.target.value))}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Baggage Policy</label>
              <input
                type="text"
                value={selectedFlight.baggage}
                onChange={(e) => handleFlightChange('baggage', e.target.value)}
                placeholder="e.g., Checked: 20kg, Cabin: 7kg"
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none"
              />
            </div>
          </div>

          {/* Route Info */}
          <div className="space-y-6">
            <div className="p-4 bg-black/20 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Departure</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Airport</label>
                  <input
                    type="text"
                    value={selectedFlight.departure.airport}
                    onChange={(e) => handleFlightChange('departure', e.target.value, 'airport')}
                    placeholder="Indira Gandhi"
                    className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-emerald-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">IATA Code</label>
                  <input
                    type="text"
                    value={selectedFlight.departure.iata}
                    onChange={(e) => handleFlightChange('departure', e.target.value, 'iata')}
                    placeholder="DEL"
                    className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-emerald-500/50 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={selectedFlight.departure.date}
                  onChange={(e) => handleFlightChange('departure', e.target.value, 'date')}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none"
                />
                <input
                  type="time"
                  value={selectedFlight.departure.time}
                  onChange={(e) => handleFlightChange('departure', e.target.value, 'time')}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-black/20 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">Arrival</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Airport</label>
                  <input
                    type="text"
                    value={selectedFlight.arrival.airport}
                    onChange={(e) => handleFlightChange('arrival', e.target.value, 'airport')}
                    placeholder="Changi"
                    className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-emerald-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">IATA Code</label>
                  <input
                    type="text"
                    value={selectedFlight.arrival.iata}
                    onChange={(e) => handleFlightChange('arrival', e.target.value, 'iata')}
                    placeholder="SIN"
                    className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-emerald-500/50 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={selectedFlight.arrival.date}
                  onChange={(e) => handleFlightChange('arrival', e.target.value, 'date')}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none"
                />
                <input
                  type="time"
                  value={selectedFlight.arrival.time}
                  onChange={(e) => handleFlightChange('arrival', e.target.value, 'time')}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

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
            <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-white/10 p-6">
              <div className="flex justify-between items-start mb-4">
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
              
              {/* Step Indicator */}
              <StepIndicator />
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6 pb-40">
              {currentStep === STEPS.HOTEL && renderHotelStep()}
              {currentStep === STEPS.TRANSPORT && renderTransportStep()}
            </div>

            {/* Footer with Pricing and Navigation */}
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
                  {pricing.flightPrice > 0 && (
                    <div className="flex justify-between gap-8 text-gray-400">
                      <span>Flight</span>
                      <span className="text-white">+ {formatPrice(pricing.flightPrice)}</span>
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

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  {currentStep > STEPS.HOTEL && (
                    <button
                      onClick={handleBack}
                      className="px-6 py-4 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      <FaArrowLeft />
                      Back
                    </button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                    >
                      Next Step
                      <FaArrowRight />
                    </button>
                  ) : (
                    <button
                      onClick={handleGenerate}
                      disabled={!selectedRoom || isGenerating || (needsTransport && !selectedFlight)}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <span className="animate-spin">⚪</span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          Generate Quote
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuotationBuilderModal;

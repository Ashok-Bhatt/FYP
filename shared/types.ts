// Shared Data Interfaces (DTOs)

// User Types
export interface User {
    _id?: string;
    name: string;
    email: string;
    role: 'AGENT' | 'PARTNER' | 'ADMIN' | 'USER';
    companyName?: string;
    destinations?: string[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// Auth Response (Frontend specific, but good to have shared contract)
export interface AuthResponse extends User {
    token: string;
}

// Requirement Types
export interface Requirement {
    _id?: string;
    destination: string;
    tripType: string;
    budget: number;
    startDate?: string | Date;
    duration?: number;
    pax: {
        adults: number;
        children: number;
    };
    hotelStar?: number;
    description?: string;
    preferences?: string[];
    contactInfo: {
        name: string;
        email: string;
        phone: string;
        whatsapp?: string;
    };
    status: 'NEW' | 'IN_PROGRESS' | 'QUOTES_READY' | 'SENT_TO_USER' | 'COMPLETED';
    compareToken?: string;
    compareTokenGenerated?: string | Date;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// Itinerary Types
export interface ItineraryDay {
    day: number;
    title: string;
    highlight?: string;
    activities: string[];
    accommodation: string;
    meals: string[];
    tips?: string;
}

// Quote Types
export interface QuoteSection {
    hotels: Array<{
        name: string;
        city: string;
        roomType: string;
        nights: number;
        unitPrice: number;
        qty: number;
        total: number;
    }>;
    transport: Array<{
        type: string;
        days: number;
        unitPrice: number;
        total: number;
    }>;
    activities: Array<{
        name: string;
        unitPrice: number;
        qty: number;
        total: number;
    }>;
}

export interface QuoteCosts {
    net: number;
    margin: number;
    final: number;
    perHead: number;
}

export interface Quote {
    _id?: string;
    requirementId: string | Requirement; // Populated or ID
    partnerId: string;
    agentId: string;
    title: string;
    sections: QuoteSection;
    costs: QuoteCosts;
    // Merged: Expanded statuses from partner branch + itinerary from develop
    status: 'DRAFT' | 'READY' | 'SENT_TO_USER' | 'ACCEPTED' | 'DECLINED';
    shareToken?: string; // For the partner-ai-search public link feature
    itinerary?: ItineraryDay[]; // For the develop AI itinerary feature
    viewedAt?: string | Date;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// Partner Types
export interface PartnerProfile {
    _id?: string;
    userId: string;
    companyName: string;
    destinations?: string;
    type: 'DMC' | 'Hotel' | 'Mixed';
    specializations?: string[];
    budgetRange?: {
        min?: number;
        max?: number;
    };
    rating?: number;
    tripsHandled?: number;
    description: string;
    description_embedding?: number[];
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
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// API Error Response
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

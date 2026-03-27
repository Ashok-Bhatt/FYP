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
    status: 'DRAFT' | 'READY' | 'SENT_TO_USER';
    itinerary?: ItineraryDay[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// Partner Types
export interface PartnerProfile {
    _id?: string;
    userId: string;
    companyName: string;
    destinations?: string[];
    type: 'DMC' | 'Hotel' | 'CabProvider' | 'Mixed';
    specializations?: string[];
    budgetRange?: {
        min: number;
        max: number;
    };
    rating: number;
    tripsHandled: number;
    description?: string;
    description_embedding?: number[];
    images?: string[];
    amenities?: string[];
    sightSeeing?: string[];
    startingPrice?: number;
    reviews: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// API Error Response
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

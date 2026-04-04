import mongoose, { Document, Schema } from 'mongoose';
import { PartnerProfile as SharedPartnerProfile } from '../../shared/types';

export interface IPartnerProfile extends Omit<SharedPartnerProfile, '_id' | 'userId'>, Document {
    userId: mongoose.Types.ObjectId;
    description_embedding?: number[];

    companyName: string;
    type: 'DMC' | 'Hotel' | 'Mixed';

    specializations?: string[];

    budgetRange?: {
        min?: number;
        max?: number;
    };

    rating?: number;
    tripsHandled?: number;

    description: string;

    images?: string[];

    amenities?: string[];

    startingPrice?: number;

    reviews?: number;

    address: {
        street: string;
        city: string;
        pinCode: string;
        country: string;
    };

    starRating: number;

    roomTypes: Array<{
        name: string;
        price: number;
    }>;

    contactInfo: {
        phone: string;
        website?: string;
        email?: string;
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };

    activities: Array<{
        name: string;
        category: string;
        duration: string;
        price: number;
        description: string;
    }>;

    checkIn: string;
    checkOut: string;

    sightSeeings: Array<{
        name: string;
        images?: string[];
        description: string;
        entryFee?: number;
    }>;
}

const partnerProfileSchema = new Schema<IPartnerProfile>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    destinations: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        enum: ['DMC', 'Hotel', 'Mixed'],
        default: 'Hotel',
    },
    specializations: [String],
    budgetRange: {
        min: Number,
        max: Number,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    tripsHandled: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
    images: [String],
    amenities: [String],
    startingPrice: Number,
    reviews: {
        type: Number,
        default: 0,
    },
    description_embedding: {
        type: [Number],
        default: [],
        index: false,
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        pinCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    starRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    roomTypes: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
    }],
    contactInfo: {
        phone: { type: String, required: true },
        website: String,
        email: String,
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
    },
    activities: [{
        name: { type: String, required: true },
        category: { type: String, required: true },
        duration: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
    }],
    checkIn: {
        type: String,
        required: true,
    },
    checkOut: {
        type: String,
        required: true,
    },
    sightSeeings: [{
        name: { type: String, required: true },
        images: [String],
        description: { type: String, required: true },
        entryFee: { type: Number, default: 0 },
    }],
}, {
    timestamps: true,
});

// Useful indexes (recommended)
partnerProfileSchema.index({ 'address.city': 1 });
partnerProfileSchema.index({ type: 1 });

const PartnerProfile = mongoose.model<IPartnerProfile>('PartnerProfile', partnerProfileSchema);

export default PartnerProfile;
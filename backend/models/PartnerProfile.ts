import mongoose, { Document, Schema } from 'mongoose';
import { PartnerProfile as SharedPartnerProfile } from '../../shared/types';

export interface IPartnerProfile extends Omit<SharedPartnerProfile, '_id' | 'userId'>, Document {
    userId: mongoose.Types.ObjectId;
    description_embedding?: number[];
}

const partnerProfileSchema = new Schema<IPartnerProfile>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    destinations: [String], // e.g., ["Italy", "Rome"]
    type: {
        type: String,
        enum: ['DMC', 'Hotel', 'CabProvider', 'Mixed'],
        default: 'DMC',
    },
    specializations: [String], // e.g., ["honeymoon", "luxury"]
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
    description: String,
    images: [String],
    amenities: [String],
    sightSeeing: [String],
    startingPrice: Number,
    reviews: {
        type: Number,
        default: 0,
    },
    description_embedding: {
        type: [Number],
        default: [],
        index: false 
    },
}, {
    timestamps: true,
});

const PartnerProfile = mongoose.model<IPartnerProfile>('PartnerProfile', partnerProfileSchema);

export default PartnerProfile;

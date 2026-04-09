import mongoose, { Document, Schema } from 'mongoose';
import { Requirement as SharedRequirement } from '../../shared/types';

export interface IRequirement extends Omit<SharedRequirement, '_id'>, Document { 
    userId?: mongoose.Types.ObjectId;
    compareToken?: string;
    compareTokenGenerated?: Date;
}

const requirementSchema = new Schema<IRequirement>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    destination: {
        type: String,
        required: true,
    },
    tripType: {
        type: String,
        required: true, // e.g., Honeymoon, Family, Business
    },
    budget: {
        type: Number,
        required: true,
    },
    startDate: Date,
    duration: Number, // in days
    pax: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 },
    },
    hotelStar: {
        type: Number,
        min: 1,
        max: 5,
    },
    description: String,
    preferences: [String], // e.g., "balcony", "pool"
    contactInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        whatsapp: String,
    },
    status: {
        type: String,
        enum: ['NEW', 'IN_PROGRESS', 'QUOTES_READY', 'SENT_TO_USER', 'COMPLETED'],
        default: 'NEW',
    },
    compareToken: {
        type: String,
        unique: true,
        sparse: true, // allows multiple null values
    },
    compareTokenGenerated: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Requirement = mongoose.model<IRequirement>('Requirement', requirementSchema);

export default Requirement;

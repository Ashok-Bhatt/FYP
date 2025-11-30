import mongoose, { Document, Schema } from 'mongoose';

// Hotel Schema
export interface IPartnerHotel extends Document {
    partnerId: mongoose.Types.ObjectId;
    name: string;
    city: string;
    starRating?: number;
    amenities?: string[];
    roomTypes: Array<{
        name: string;
        price: number;
        maxOccupancy: number;
    }>;
    photos?: string[];
}

const hotelSchema = new Schema<IPartnerHotel>({
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    starRating: { type: Number, min: 1, max: 5 },
    amenities: [String],
    roomTypes: [{
        name: String,
        price: Number,
        maxOccupancy: Number,
    }],
    photos: [String],
});

// Transport Schema
export interface IPartnerTransport extends Document {
    partnerId: mongoose.Types.ObjectId;
    type: string;
    price: number;
    maxPax: number;
    city: string;
}

const transportSchema = new Schema<IPartnerTransport>({
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // Sedan, SUV
    price: Number,
    maxPax: Number,
    city: String,
});

// Activity Schema
export interface IPartnerActivity extends Document {
    partnerId: mongoose.Types.ObjectId;
    name: string;
    city: string;
    price: number;
    description?: string;
}

const activitySchema = new Schema<IPartnerActivity>({
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    price: Number,
    description: String,
});

export const PartnerHotel = mongoose.model<IPartnerHotel>('PartnerHotel', hotelSchema);
export const PartnerTransport = mongoose.model<IPartnerTransport>('PartnerTransport', transportSchema);
export const PartnerActivity = mongoose.model<IPartnerActivity>('PartnerActivity', activitySchema);

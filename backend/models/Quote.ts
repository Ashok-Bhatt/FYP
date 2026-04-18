import mongoose, { Document, Schema } from 'mongoose';
import { Quote as SharedQuote, QuoteSection, QuoteCosts, ItineraryDay } from '../../shared/types';

export interface IQuote extends Omit<SharedQuote, '_id' | 'requirementId' | 'partnerId' | 'agentId'>, Document {
    requirementId: mongoose.Types.ObjectId;
    partnerId: mongoose.Types.ObjectId;
    agentId: mongoose.Types.ObjectId;
    viewedAt?: Date;
    viewCount?: number;
    lastViewedAt?: Date;
}

const quoteSchema = new Schema<IQuote>({
    requirementId: {
        type: Schema.Types.ObjectId,
        ref: 'Requirement',
        required: true,
    },
    partnerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    agentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: String,
    sections: {
        hotels: [{
            name: String,
            city: String,
            roomType: String,
            nights: Number,
            unitPrice: Number,
            qty: Number,
            total: Number,
        }],
        transport: [{
            type: String, // e.g., Sedan
            days: Number,
            unitPrice: Number,
            total: Number,
        }],
        activities: [{
            name: String,
            unitPrice: Number,
            qty: Number,
            total: Number,
        }],
        flights: [{
            airline: String,
            flightNumber: String,
            departure: {
                airport: String,
                iata: String,
                at: Date,
            },
            arrival: {
                airport: String,
                iata: String,
                at: Date,
            },
            duration: String,
            class: String,
            baggage: String,
            price: Number,
        }],
    },
    costs: {
        net: Number,
        margin: Number, // Percentage or fixed amount
        final: Number,
        perHead: Number,
    },
    shareToken: {
        type: String,
        unique: true,
        sparse: true,
    },
    status: {
        type: String,
        enum: ['DRAFT', 'READY', 'SENT_TO_USER', 'ACCEPTED', 'DECLINED'],
        default: 'DRAFT',
    },
    itinerary: [{
        day: Number,
        title: String,
        highlight: String,
        activities: [String],
        accommodation: String,
        meals: [String],
        tips: String,
    }],
    viewedAt: Date,
    viewCount: {
        type: Number,
        default: 0,
    },
    lastViewedAt: Date,
}, {
    timestamps: true,
});

const Quote = mongoose.model<IQuote>('Quote', quoteSchema);

export default Quote;

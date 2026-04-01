import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteView extends Document {
    quoteId: mongoose.Types.ObjectId;
    timestamp: Date;
    userAgent: string;
    ipHash: string;
    duration?: number; // Optional duration in seconds
}

const quoteViewSchema = new Schema<IQuoteView>({
    quoteId: {
        type: Schema.Types.ObjectId,
        ref: 'Quote',
        required: true,
        index: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
    userAgent: {
        type: String,
        default: '',
    },
    ipHash: {
        type: String,
        required: true,
        index: true,
    },
    duration: {
        type: Number,
        default: null, // in seconds, optional
    }
}, {
    timestamps: false, // We only need timestamp field
});

// Create compound index for efficient queries
quoteViewSchema.index({ quoteId: 1, timestamp: -1 });

const QuoteView = mongoose.model<IQuoteView>('QuoteView', quoteViewSchema);

export default QuoteView;

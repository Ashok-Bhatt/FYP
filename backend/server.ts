import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, MONGO_URI } from './config/env';

// Routes
import authRoutes from './routes/authRoutes';
import requirementRoutes from './routes/requirementRoutes';
import partnerRoutes from './routes/partnerRoutes';
import quoteRoutes from './routes/quoteRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import flightRoutes from './routes/flightRoutes';
import enrichRoutes from './routes/enrichRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('VoyageGen API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/enrich', enrichRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

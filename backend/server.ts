import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/authRoutes';
import requirementRoutes from './routes/requirementRoutes';
import partnerRoutes from './routes/partnerRoutes';
import quoteRoutes from './routes/quoteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voyagegen')
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

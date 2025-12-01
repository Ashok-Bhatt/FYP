import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './db';

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

// Test Prisma Connection
prisma.$connect()
    .then(() => console.log('✅ PostgreSQL Connected (Prisma)'))
    .catch(err => console.error('❌ PostgreSQL Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('VoyageGen API is running with PostgreSQL...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/quotes', quoteRoutes);

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

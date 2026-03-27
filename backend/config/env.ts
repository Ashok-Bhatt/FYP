import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/voyagegen';
export const JWT_SECRET = process.env.JWT_SECRET;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
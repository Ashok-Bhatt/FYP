import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/env';

// Initialize the API only if the key is available
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!genAI) {
        console.warn("GEMINI_API_KEY is not set. Cannot generate embedding. Returning empty array.");
        return [];
    }
    
    try {
        // Use the text-embedding-004 model
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001"});
        const result = await model.embedContent(text);
        
        return result.embedding.values;
    } catch (error) {
        console.error("Error generating embedding with Gemini API:", error);
        return [];
    }
}

export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    if (!genAI || texts.length === 0) {
        if (!genAI) console.warn("GEMINI_API_KEY is not set. Cannot generate embeddings in batch.");
        return texts.map(() => []);
    }
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001"});
        const requests = texts.map((text) => ({
            content: { role: 'user', parts: [{ text }] },
        }));

        const result = await model.batchEmbedContents({ requests });
        return result.embeddings.map((e: any) => e.values);
    } catch (error) {
        console.error("Error generating batch embeddings with Gemini API:", error);
        return texts.map(() => []);
    }
}

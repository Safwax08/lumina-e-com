import { FastifyInstance } from 'fastify';
import { GoogleGenAI } from '@google/genai';
import { chatRequestSchema } from './ai.schema.js';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch {
    aiClient = null;
  }
}

const SYSTEM_PROMPT = `You are Lumina AI, an elite AI shopping assistant for Lumina E-Commerce (a luxury men's apparel brand). 
Your tone is sophisticated, helpful, concise, and courteous. 
Assist customers with product advice, sizing guidance, outfit recommendations, and order queries. 
Do not invent unverified policies or share technical backend details.`;

export async function aiRoutes(app: FastifyInstance) {
  // POST /api/v1/ai/chat (Strict Rate Limit: 20 req/min)
  app.post(
    '/api/v1/ai/chat',
    {
      config: {
        rateLimit: {
          max: 20,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const parseResult = chatRequestSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid message payload.',
            details: parseResult.error.format(),
          },
        });
      }

      const { message } = parseResult.data;

      // Fallback response if GEMINI_API_KEY is not configured
      if (!process.env.GEMINI_API_KEY || !aiClient) {
        return reply.status(200).send({
          success: true,
          data: {
            reply: `Welcome to Lumina Luxury Concierge. Regarding "${message}": Our AI recommendations are temporarily in offline mode. Please browse our curated categories directly or reach out to customer support.`,
          },
        });
      }

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nCustomer question: ${message}` }] },
          ],
        });

        const replyText = response.text || 'I am happy to assist you with any questions about our luxury collection.';

        return reply.status(200).send({
          success: true,
          data: {
            reply: replyText,
          },
        });
      } catch (err: any) {
        app.log.error(err, 'Gemini AI backend proxy error');

        return reply.status(200).send({
          success: true,
          data: {
            reply: 'Our AI Concierge is currently experiencing high demand. Please try asking your question again in a moment.',
          },
        });
      }
    }
  );
}

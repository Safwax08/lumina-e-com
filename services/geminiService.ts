import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

// Initialize Gemini
// NOTE: In a real production app, never expose keys on the client.
// This is for demonstration purposes using the provided environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProductInsight = async (product: Product): Promise<string> => {
  try {
    const prompt = `
      Analyze this product for an e-commerce store:
      Title: ${product.title}
      Price: $${product.price}
      Description: ${product.description}
      Category: ${product.category}

      Write a short, catchy, 2-sentence marketing hook explaining why this is a "must-have". 
      Focus on benefits. Do not use markdown or bold text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Discover the quality of this amazing item.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Top quality product selected just for you.";
  }
};

export const chatWithShoppingAssistant = async (
  history: { role: string; parts: { text: string }[] }[],
  userMessage: string,
  availableProducts: Product[]
): Promise<string> => {
  try {
    // Create a context string of top 5 products to keep token count reasonable for this demo
    const productContext = availableProducts
      .slice(0, 10)
      .map(p => `- ${p.title} ($${p.price})`)
      .join('\n');

    const systemInstruction = `
      You are Lumina, an intelligent fashion and lifestyle shopping assistant.
      You are helpful, enthusiastic, and concise.
      
      Here is a sample of products currently in our store:
      ${productContext}
      
      If a user asks about a specific type of product, recommend something from the list above if applicable.
      If the user asks for general advice (e.g., "What to wear to a wedding?"), give general fashion advice and suggest looking at our "clothing" or "jewelry" categories.
      Keep responses under 100 words.
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having a little trouble connecting to my brain right now. Please try again later!";
  }
};
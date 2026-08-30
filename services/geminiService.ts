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
    
    // Smart fallback for demo mode without API key
    const msg = userMessage.toLowerCase();
    if (msg.includes('shoe') || msg.includes('sneaker')) {
      return "We have some amazing athletic running shoes available in our store right now! Check out our Festival Deals section for the latest styles.";
    }
    if (msg.includes('watch') || msg.includes('smartwatch')) {
      return "Our Precision Timepieces and Smartwatches are top-tier. I highly recommend checking out our wearable technology category for the best deals!";
    }
    if (msg.includes('phone') || msg.includes('mobile')) {
      return "Looking for a new phone? We have the latest smartphones, including the Samsung S23 Ultra and Apple iPhones. Check our Mobiles category!";
    }
    
    return "I'm currently running in demo mode, but I'd love to help! Try asking me about 'shoes', 'watches', or 'phones' to see what I can do.";
  }
};

export const generateImageFromGemini = async (prompt: string, isAspectWide: boolean = false): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: isAspectWide ? '16:9' : '1:1'
      }
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64Bytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64Bytes}`;
    }
  } catch (error) {
    console.error("Error generating image from Gemini:", error);
  }
  return '';
};
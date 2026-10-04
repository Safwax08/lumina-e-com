import { Product } from '../../../types';
import { apiClient } from '../../../services/apiClient';

export const generateProductInsight = async (product: Product): Promise<string> => {
  try {
    const res = await apiClient.post<{ reply: string }>('/ai/chat', {
      message: `Provide a 2-sentence marketing highlight for ${product.title} (${product.description}).`,
    });
    if (res && res.reply) {
      return res.reply;
    }
  } catch (err) {
    console.warn('Backend AI insight call failed, using fallback:', err);
  }
  return `Crafted with premium materials, ${product.title} offers timeless sophistication for your wardrobe.`;
};

export const chatWithShoppingAssistant = async (
  _history: { role: string; parts: { text: string }[] }[],
  userMessage: string,
  _availableProducts: Product[]
): Promise<string> => {
  try {
    const res = await apiClient.post<{ reply: string }>('/ai/chat', {
      message: userMessage,
    });
    if (res && res.reply) {
      return res.reply;
    }
  } catch (err) {
    console.warn('Backend AI chat call failed, using fallback:', err);
  }

  const msg = userMessage.toLowerCase();
  if (msg.includes('jacket') || msg.includes('coat') || msg.includes('outerwear')) {
    return "Our bomber jackets and outerwear are crafted from fine materials. Check out our Jackets category!";
  }
  if (msg.includes('suit') || msg.includes('blazer')) {
    return "Explore our Sartorial Suits and tailored blazers for a commanding presence.";
  }
  if (msg.includes('jean') || msg.includes('denim')) {
    return "Our 13.5oz Japanese selvedge denim jeans pair perfectly with our 100% Pima cotton tees.";
  }
  if (msg.includes('shoe') || msg.includes('loafer') || msg.includes('sneaker')) {
    return "Handcrafted calfskin loafers and minimalist sneakers are available under our Footwear collection.";
  }
  return `I am Lumina, your personal fashion assistant! Feel free to ask me about any of our luxury collections.`;
};

export const generateImageFromGemini = async (_prompt: string, _isAspectWide: boolean = false): Promise<string> => {
  return '';
};

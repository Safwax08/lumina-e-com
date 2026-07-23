export interface Product {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  brand?: string;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  attributes?: Array<{
    id: string;
    name: string;
    type: string;
    options: Array<{
      id: string;
      value: string;
      color_code?: string;
    }>;
  }>;
  variants?: Array<{
    id: string;
    options: Array<{
      id: string;
      name: string;
      value: string;
      color_code?: string;
    }>;
    price: number;
    original_price?: number;
    stock: number;
    image: string | null;
  }>;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface PaymentDetails {
  last4: string;
  brand: string;
}

export interface Order {
  id: string;
  date: string; // ISO string
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'delivered';
  payment?: PaymentDetails;
}

export enum SortOption {
  DEFAULT = 'default',
  PRICE_LOW_HIGH = 'price_asc',
  PRICE_HIGH_LOW = 'price_desc',
  RATING = 'rating',
}
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
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
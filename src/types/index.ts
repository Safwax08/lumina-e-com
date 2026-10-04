export interface ProductAttributeOption {
  id: string;
  value: string;
  color_code?: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  type: string;
  options: ProductAttributeOption[];
}

export interface ProductVariantOption {
  id: string;
  name: string;
  value: string;
  color_code?: string;
}

export interface ProductVariant {
  id: string;
  options: ProductVariantOption[];
  price: number;
  original_price?: number;
  stock: number;
  image: string | null;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  handle: string;
  image: string;
  description: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  brand?: string;
  description: string;
  category: string; // category handle or id
  category_id?: string;
  image: string;
  images?: string[];
  stock?: number;
  rating: {
    rate: number;
    count: number;
  };
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: Record<string, string>;
  variantId?: string;
  variantKey?: string;
  unitPrice?: number;
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

export interface ShippingAddress {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  date: string; // ISO string
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'processing' | 'delivered';
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  payment?: PaymentDetails;
}

export enum SortOption {
  DEFAULT = 'default',
  PRICE_LOW_HIGH = 'price_asc',
  PRICE_HIGH_LOW = 'price_desc',
  RATING = 'rating',
}

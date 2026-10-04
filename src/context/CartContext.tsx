import React, { createContext, useContext } from 'react';
import { useCart } from '../features/cart/hooks/useCart';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, options?: Record<string, string>, qtyToAdd?: number) => void;
  removeFromCart: (targetKey: string) => void;
  updateQuantity: (targetKey: string, delta: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartHook = useCart();

  return (
    <CartContext.Provider value={cartHook}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

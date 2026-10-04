import React, { createContext, useContext } from 'react';
import { useWishlist } from '../features/wishlist/hooks/useWishlist';
import { Product } from '../types';

interface WishlistContextType {
  wishlist: string[];
  wishlistProducts: Product[];
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode; products: Product[] }> = ({ children, products }) => {
  const wishlistHook = useWishlist(products);

  return (
    <WishlistContext.Provider value={wishlistHook}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
};

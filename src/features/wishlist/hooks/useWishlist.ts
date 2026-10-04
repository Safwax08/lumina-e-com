import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '../../../types';
import { storage } from '../../../services/storage';

export function useWishlist(allProducts: Product[]) {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    return storage.get<string[]>(storage.keys.WISHLIST, ['prod-101', 'prod-104']);
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    storage.set(storage.keys.WISHLIST, wishlist);
  }, [wishlist]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      }
      return [...prev, product.id];
    });
  }, []);

  const removeFromWishlist = useCallback((product: Product) => {
    setWishlist(prev => prev.filter(id => id !== product.id));
  }, []);

  const wishlistProducts = useMemo(() => {
    return allProducts.filter(p => wishlist.includes(p.id));
  }, [allProducts, wishlist]);

  return {
    wishlist,
    wishlistProducts,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    removeFromWishlist,
  };
}

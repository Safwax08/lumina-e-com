import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem } from '../../../types';
import { storage } from '../../../services/storage';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    return storage.get<CartItem[]>(storage.keys.CART, []);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    storage.set(storage.keys.CART, cart);
  }, [cart]);

  const generateVariantKey = (productId: string, options?: Record<string, string>): string => {
    if (!options || Object.keys(options).length === 0) {
      return productId;
    }
    const optionStr = Object.entries(options)
      .sort(([k1], [k2]) => k1.localeCompare(k2))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    return `${productId}-${optionStr}`;
  };

  const addToCart = useCallback((product: Product, options?: Record<string, string>, qtyToAdd: number = 1) => {
    setCart(prev => {
      const vKey = generateVariantKey(product.id, options);
      
      // Determine variant price & stock if applicable
      let itemPrice = product.price;
      let maxStock = product.stock !== undefined ? product.stock : 25;
      let matchingVariantId: string | undefined = undefined;

      if (product.variants && product.variants.length > 0 && options) {
        const foundVariant = product.variants.find(v => {
          return Object.entries(options).every(([attrName, selectedVal]) => {
            return v.options.some(opt => 
              opt.name.toLowerCase() === attrName.toLowerCase() && 
              opt.value.toLowerCase() === selectedVal.toLowerCase()
            );
          });
        });

        if (foundVariant) {
          itemPrice = foundVariant.price;
          maxStock = foundVariant.stock;
          matchingVariantId = foundVariant.id;
        }
      }

      const existingIndex = prev.findIndex(item => (item.variantKey || item.id) === vKey);

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity;
        const newQty = Math.min(currentQty + qtyToAdd, maxStock);
        
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice: itemPrice,
          price: itemPrice,
          stock: maxStock,
        };
        return updated;
      }

      const newCartItem: CartItem = {
        ...product,
        price: itemPrice,
        unitPrice: itemPrice,
        quantity: Math.min(qtyToAdd, maxStock),
        selectedOptions: options,
        variantId: matchingVariantId,
        variantKey: vKey,
        stock: maxStock,
      };

      return [...prev, newCartItem];
    });

    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((targetKey: string) => {
    setCart(prev => prev.filter(item => (item.variantKey || item.id) !== targetKey && item.id !== targetKey));
  }, []);

  const updateQuantity = useCallback((targetKey: string, delta: number) => {
    setCart(prev => prev.map(item => {
      const key = item.variantKey || item.id;
      if (key === targetKey || item.id === targetKey) {
        const maxStock = item.stock !== undefined ? item.stock : 25;
        const newQty = Math.max(1, Math.min(item.quantity + delta, maxStock));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const p = item.unitPrice !== undefined ? item.unitPrice : item.price;
      return sum + p * item.quantity;
    }, 0);
  }, [cart]);

  return {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    cartSubtotal,
  };
}

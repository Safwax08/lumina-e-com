import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category } from '../types';
import { fetchProductsService } from '../services/products';
import { fetchCategoriesService } from '../services/categories';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        fetchProductsService(),
        fetchCategoriesService(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error('Failed to load products/categories:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return (
    <ProductContext.Provider value={{ products, categories, loading, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

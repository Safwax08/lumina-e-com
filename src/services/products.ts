import { Product } from '../types';
import { productsData } from '../features/products/services/productsData';
import { storage } from './storage';
import { apiClient } from './apiClient';

export const normalizeProduct = (item: any): Product => {
  const cat = productsData.categories.find(c => c.id === item.category_id || c.handle === item.category);
  const categoryHandle = cat ? cat.handle : (item.category || item.category_id || 'general');
  const categoryId = cat ? cat.id : (item.category_id || 'cat-general');

  const defaultImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
  const mainImage = item.image || (item.images && item.images.length > 0 ? item.images[0] : defaultImage);
  const images = item.images && item.images.length > 0 ? item.images : [mainImage];

  return {
    id: String(item.id),
    title: item.title || item.name || 'Untitled Product',
    price: Number(item.price) || 0,
    original_price: item.original_price ? Number(item.original_price) : undefined,
    brand: item.brand || 'URBAN MAN',
    description: item.description || '',
    category: categoryHandle,
    category_id: categoryId,
    image: mainImage,
    images: images,
    stock: item.stock !== undefined ? Number(item.stock) : 25,
    rating: item.rating || { rate: 4.5, count: 42 },
    attributes: item.attributes || [],
    variants: item.variants || [],
  };
};

export const getBaseProducts = (): Product[] => {
  return (productsData.products as any[]).map(normalizeProduct);
};

export const fetchProductsService = async (): Promise<Product[]> => {
  try {
    const apiProducts = await apiClient.get<any[]>('/products');
    if (apiProducts && Array.isArray(apiProducts)) {
      return apiProducts.map(normalizeProduct);
    }
  } catch (err) {
    console.warn('API fetch products failed, falling back to local storage catalog:', err);
  }

  // Fallback to local catalog
  const base = getBaseProducts();
  const customProducts = storage.get<Product[]>(storage.keys.ADMIN_PRODUCTS, []);
  const productMap = new Map<string, Product>();
  base.forEach(p => productMap.set(p.id, p));
  customProducts.forEach(p => productMap.set(p.id, normalizeProduct(p)));
  return Array.from(productMap.values());
};

export const fetchProductByIdService = async (id: string): Promise<Product | null> => {
  try {
    const apiProduct = await apiClient.get<any>(`/products/${id}`);
    if (apiProduct) {
      return normalizeProduct(apiProduct);
    }
  } catch (err) {
    console.warn(`API fetch product ${id} failed, falling back:`, err);
  }

  const products = await fetchProductsService();
  return products.find(p => p.id === id) || null;
};

export const saveAdminProductService = async (productData: Partial<Product>): Promise<Product> => {
  try {
    if (productData.id) {
      const updated = await apiClient.put<any>(`/products/${productData.id}`, {
        title: productData.title,
        categoryId: productData.category_id || 'cat-tshirts',
        brand: productData.brand,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.original_price,
        image: productData.image,
        stock: productData.stock,
      });
      return normalizeProduct({ ...productData, ...updated });
    } else {
      const created = await apiClient.post<any>('/products', {
        title: productData.title || 'New Product',
        categoryId: productData.category_id || 'cat-tshirts',
        brand: productData.brand || 'URBAN MAN',
        description: productData.description || '',
        price: productData.price || 999,
        originalPrice: productData.original_price,
        image: productData.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        stock: productData.stock || 20,
      });
      return normalizeProduct(created);
    }
  } catch (err) {
    console.warn('API save product failed, saving locally:', err);
  }

  // Local fallback
  const existingCustom = storage.get<Product[]>(storage.keys.ADMIN_PRODUCTS, []);
  let newOrUpdated: Product;

  if (productData.id) {
    const existing = await fetchProductByIdService(productData.id);
    newOrUpdated = normalizeProduct({ ...existing, ...productData });
    const index = existingCustom.findIndex(p => p.id === productData.id);
    if (index >= 0) {
      existingCustom[index] = newOrUpdated;
    } else {
      existingCustom.push(newOrUpdated);
    }
  } else {
    const newId = `prod-${Date.now()}`;
    newOrUpdated = normalizeProduct({
      id: newId,
      title: productData.title || 'New Product',
      price: productData.price || 999,
      original_price: productData.original_price,
      brand: productData.brand || 'URBAN MAN',
      description: productData.description || '',
      category: productData.category || 't-shirts',
      category_id: productData.category_id || 'cat-tshirts',
      image: productData.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      stock: productData.stock || 20,
      rating: { rate: 5.0, count: 1 },
    });
    existingCustom.push(newOrUpdated);
  }

  storage.set(storage.keys.ADMIN_PRODUCTS, existingCustom);
  return newOrUpdated;
};

export const deleteAdminProductService = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/products/${id}`);
  } catch (err) {
    console.warn('API delete product failed, deleting locally:', err);
  }

  const customProducts = storage.get<Product[]>(storage.keys.ADMIN_PRODUCTS, []);
  const updatedCustom = customProducts.filter(p => p.id !== id);
  storage.set(storage.keys.ADMIN_PRODUCTS, updatedCustom);
};

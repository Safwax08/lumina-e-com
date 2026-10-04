import { Category } from '../types';
import { productsData } from '../features/products/services/productsData';

export const fetchCategoriesService = async (): Promise<Category[]> => {
  return (productsData.categories as any[]).map(c => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
    image: c.image,
    description: c.description || '',
  }));
};

export const fetchCategoryByHandleOrIdService = async (identifier: string): Promise<Category | null> => {
  const categories = await fetchCategoriesService();
  return categories.find(c => c.handle === identifier || c.id === identifier) || null;
};

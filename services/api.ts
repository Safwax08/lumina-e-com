import { Product } from '../types';
import { productsData } from './productsData';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    return (productsData.products as any[]).map((item: any) => {
      // Find category handle to map to category slug
      const cat = productsData.categories.find(c => c.id === item.category_id);
      const categoryHandle = cat ? cat.handle : (item.category_id || 'general');

      return {
        id: item.id,
        title: item.name,
        price: item.price,
        original_price: item.original_price,
        brand: item.brand,
        description: item.description,
        category: categoryHandle,
        image: item.images && item.images.length > 0 ? item.images[0] : 'https://sparkgadgets-demo.zohoecommerce.com/zs-common/images/no-preview-image.jpg',
        rating: item.rating || { rate: 4.5, count: 50 },
        attributes: item.attributes,
        variants: item.variants
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    return productsData.categories.map(c => c.handle);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

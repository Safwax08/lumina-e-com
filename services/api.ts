import { Product } from '../types';

// -----------------------------------------------------------------------------
// API CONFIGURATION
// Switched to DummyJSON for a larger dataset (100+ items) to provide more variety
// -----------------------------------------------------------------------------
const BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Fetch 100 products to provide a larger catalog
    const response = await fetch(`${BASE_URL}/products?limit=100`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    
    // Map DummyJSON response to our Product interface
    // DummyJSON structure: { products: [ { id, title, price, ... }, ... ] }
    return data.products.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category, // Returns category slug (e.g., 'smartphones')
      image: item.thumbnail,   // Using thumbnail for the main image
      rating: {
        rate: item.rating,
        // DummyJSON products usually have a reviews array; we use the length or fallback to a mock number
        count: item.reviews ? item.reviews.length : Math.floor(Math.random() * 200) + 50
      }
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${BASE_URL}/products/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        // DummyJSON returns an array of objects: { slug: "beauty", name: "Beauty", url: "..." }
        // We return the slug to match the product.category field exactly for filtering
        return data.map((c: any) => c.slug);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
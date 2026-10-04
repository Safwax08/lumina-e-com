// Type-safe, resilient local storage abstraction with automatic fallback recovery

const KEYS = {
  CART: 'lumina_cart_v2',
  WISHLIST: 'lumina_wishlist_v2',
  ORDERS: 'lumina_orders_v2',
  ADMIN_PRODUCTS: 'lumina_admin_products_v2',
  MOCK_CUSTOMER: 'lumina_customer_v2',
  MOCK_ADMIN: 'lumina_admin_session_v2',
};

export const storage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return fallback;
      }
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      
      const parsed = JSON.parse(item);
      
      // Defend against type mismatches (e.g. expected array vs stored object)
      if (Array.isArray(fallback) && !Array.isArray(parsed)) {
        console.warn(`Storage key ${key} expected Array, received non-array. Recovering with fallback.`);
        return fallback;
      }
      
      return (parsed !== null && parsed !== undefined) ? (parsed as T) : fallback;
    } catch (e) {
      console.error(`Error reading key ${key} from storage:`, e);
      return fallback;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing key ${key} to storage:`, e);
    }
  },

  remove: (key: string): void => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing key ${key} from storage:`, e);
    }
  },

  keys: KEYS,
};

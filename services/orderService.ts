import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"; 
import { CartItem, Order, PaymentDetails } from '../types';

const COLLECTION_NAME = 'orders';

// Helper to get local orders
const getLocalOrders = (): Order[] => {
  const saved = localStorage.getItem('lumina_orders');
  return saved ? JSON.parse(saved) : [];
};

export const placeOrder = async (items: CartItem[], total: number, paymentDetails: PaymentDetails): Promise<Order> => {
  const newOrder: Order = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    items,
    total,
    status: 'processing',
    payment: paymentDetails
  };

  try {
    if (db) {
      // Save to Firebase Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...newOrder,
        timestamp: new Date() // Firestore timestamp
      });
      console.log("Document written with ID: ", docRef.id);
      return { ...newOrder, id: docRef.id };
    } else {
      // Fallback to LocalStorage
      const orders = getLocalOrders();
      orders.unshift(newOrder);
      localStorage.setItem('lumina_orders', JSON.stringify(orders));
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return newOrder;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    if (db) {
      const q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as any;
        orders.push({
            id: doc.id,
            date: data.date,
            items: data.items,
            total: data.total,
            status: data.status,
            payment: data.payment
        });
      });
      return orders;
    } else {
      return getLocalOrders();
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
import { Order, CartItem, ShippingAddress } from '../types';
import { storage } from './storage';
import { apiClient } from './apiClient';

function mapBackendOrderToFrontend(backendOrder: any): Order {
  const items: CartItem[] = (backendOrder.items || []).map((i: any) => ({
    id: i.productId || i.id,
    title: i.productTitleSnapshot || i.title || 'Item',
    price: Number(i.unitPrice || i.price || 0),
    quantity: Number(i.quantity || 1),
    image: i.variantSnapshot?.image || i.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    selectedOptions: i.variantSnapshot?.options || {},
  }));

  const addr = backendOrder.shippingAddress || {};
  const nameParts = (addr.name || 'Customer').split(' ');

  return {
    id: backendOrder.orderNumber || backendOrder.id,
    date: backendOrder.createdAt || new Date().toISOString(),
    items,
    subtotal: Number(backendOrder.subtotal || 0),
    shippingFee: Number(backendOrder.shippingAmount || 0),
    total: Number(backendOrder.totalAmount || 0),
    status: (backendOrder.status || 'processing').toLowerCase() as any,
    paymentMethod: backendOrder.paymentMethod || 'card',
    shippingAddress: {
      firstName: nameParts[0] || 'Customer',
      lastName: nameParts.slice(1).join(' ') || '',
      email: addr.email || 'customer@lumina.com',
      phone: addr.phone || '555-0199',
      address: addr.address || '123 Main St',
      city: addr.city || 'City',
      state: addr.state || 'State',
      pincode: addr.zip || addr.pincode || '10001',
    },
    payment: {
      last4: backendOrder.paymentMethod === 'card' ? '4242' : '0000',
      brand: (backendOrder.paymentMethod || 'CARD').toUpperCase(),
    },
  };
}

export const fetchOrdersService = async (): Promise<Order[]> => {
  try {
    const apiOrders = await apiClient.get<any[]>('/orders/my-orders');
    if (apiOrders && Array.isArray(apiOrders)) {
      return apiOrders.map(mapBackendOrderToFrontend);
    }
  } catch (err) {
    console.warn('API fetch orders failed, checking local storage fallback:', err);
  }

  return storage.get<Order[]>(storage.keys.ORDERS, []);
};

export const placeOrderService = async (
  items: CartItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: string
): Promise<Order> => {
  const fullName = `${shippingAddress.firstName} ${shippingAddress.lastName || ''}`.trim();
  
  try {
    const payload = {
      items: items.map(item => ({
        productId: item.id,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
      })),
      shippingAddress: {
        name: fullName,
        email: shippingAddress.email || 'customer@lumina.com',
        address: shippingAddress.address,
        city: shippingAddress.city,
        zip: shippingAddress.pincode || '10001',
        phone: shippingAddress.phone || '555-0199',
      },
      paymentMethod,
    };

    const createdOrder = await apiClient.post<any>('/orders', payload);
    const frontendOrder = mapBackendOrderToFrontend(createdOrder);

    // Save copy in local history as well
    const currentOrders = storage.get<Order[]>(storage.keys.ORDERS, []);
    storage.set(storage.keys.ORDERS, [frontendOrder, ...currentOrders]);

    return frontendOrder;
  } catch (err) {
    // Fallback order creation if API is offline
    const currentOrders = storage.get<Order[]>(storage.keys.ORDERS, []);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 1999 || subtotal === 0 ? 0 : 99;
    const total = subtotal + shippingFee;

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      items: items.map(i => ({ ...i })),
      subtotal,
      shippingFee,
      total,
      status: 'processing',
      paymentMethod,
      shippingAddress,
      payment: {
        last4: paymentMethod === 'card' ? '4242' : '0000',
        brand: paymentMethod.toUpperCase(),
      },
    };

    storage.set(storage.keys.ORDERS, [newOrder, ...currentOrders]);
    return newOrder;
  }
};

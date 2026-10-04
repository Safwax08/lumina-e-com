import { CartItem, Order, PaymentDetails, ShippingAddress } from '../../../types';
import { fetchOrdersService, placeOrderService } from '../../../services/orders';

export const placeOrder = async (
  items: CartItem[], 
  total: number, 
  paymentDetails: PaymentDetails,
  shippingDetails?: ShippingAddress
): Promise<Order> => {
  const fallbackAddress: ShippingAddress = shippingDetails || {
    firstName: 'Customer',
    email: 'customer@urbanman.com',
    phone: '9999999999',
    address: 'Store Order',
    city: 'Mumbai',
    state: 'MH',
    pincode: '400001',
  };

  return placeOrderService(items, fallbackAddress, paymentDetails.brand || 'CARD');
};

export const fetchOrders = async (): Promise<Order[]> => {
  return fetchOrdersService();
};

import React, { useEffect, useState } from 'react';
import { Order } from '../types';
import { fetchOrders } from '../services/orderService';
import { CloseIcon, BoxIcon, CreditCardIcon } from './Icons';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
                <BoxIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <CloseIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
             <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
             </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No orders found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center text-sm text-gray-600 gap-4">
                    <div>
                      <span className="block text-xs text-gray-400 uppercase font-semibold">Order Placed</span>
                      <span className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 uppercase font-semibold">Total</span>
                      <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 uppercase font-semibold">Order ID</span>
                      <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
                    </div>
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {order.status}
                        </span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <div className="space-y-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="h-12 w-12 flex-shrink-0 bg-white border border-gray-100 rounded p-1">
                                    <img src={item.image} alt={item.title} className="h-full w-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                  </div>
                  {order.payment && (
                     <div className="bg-indigo-50/50 px-4 py-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-600">
                        <CreditCardIcon className="w-4 h-4 text-gray-400" />
                        <span>Paid with {order.payment.brand} ending in {order.payment.last4}</span>
                     </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
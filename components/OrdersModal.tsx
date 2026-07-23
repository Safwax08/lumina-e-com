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
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-800">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-[#750a27]/10 border border-[#750a27]/20 p-2 rounded-xl">
                 <BoxIcon className="w-5 h-5 text-[#750a27]" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide font-sans">My Orders</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
             <div className="flex justify-center py-12">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
             </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-light">
              <p>No orders found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-4">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Order Placed</span>
                      <span className="font-semibold text-slate-800">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total</span>
                      <span className="font-semibold text-slate-800">${order.total.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Order ID</span>
                      <span className="font-mono text-slate-600">{order.id.slice(0, 8)}...</span>
                    </div>
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                            {order.status}
                        </span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-100">
                    <div className="space-y-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="h-12 w-12 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-xl p-1.5">
                                    <img src={item.image} alt={item.title} className="h-full w-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                                    <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                  </div>
                  {order.payment && (
                     <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                        <CreditCardIcon className="w-4 h-4 text-slate-500" />
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
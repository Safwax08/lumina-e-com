import React, { useEffect, useState } from 'react';
import { Order } from '../../../types';
import { fetchOrdersService } from '../../../services/orders';
import { CloseIcon, BoxIcon, CreditCardIcon } from '../../../components/common/Icons';

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
    const data = await fetchOrdersService();
    setOrders(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-[#3B2A1A]/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#FAF4E8] border border-[#D8C5A8] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 text-[#3B2A1A]">
        
        <div className="flex items-center justify-between p-5 border-b border-[#D8C5A8] bg-[#F3E6D0]">
          <div className="flex items-center gap-3">
            <div className="bg-[#FAF4E8] border border-[#D8C5A8] p-2 rounded-xl text-[#C99A2E]">
              <BoxIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-serif text-[#3B2A1A] tracking-wide">My Orders</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-xl text-[#6B5842] hover:text-[#3B2A1A] transition-colors">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {loading ? (
             <div className="flex justify-center py-12">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C99A2E]"></div>
             </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-[#6B5842] font-light space-y-2">
              <p className="text-base font-bold text-[#3B2A1A]">No Orders Placed Yet</p>
              <p className="text-xs">Your completed orders will appear here once you make a purchase.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-[#D8C5A8] bg-[#FFFDF8] rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-[#FAF4E8] p-4 border-b border-[#D8C5A8] flex flex-wrap justify-between items-center text-xs text-[#6B5842] gap-4">
                    <div>
                      <span className="block text-[10px] text-[#6B5842] uppercase font-bold tracking-wider">Order Placed</span>
                      <span className="font-semibold text-[#3B2A1A]">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#6B5842] uppercase font-bold tracking-wider">Total</span>
                      <span className="font-semibold text-[#C99A2E]">₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#6B5842] uppercase font-bold tracking-wider">Order ID</span>
                      <span className="font-mono text-[#3B2A1A] font-bold">{order.id}</span>
                    </div>
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered' 
                            ? 'bg-[#C99A2E]/20 text-[#A87918] border border-[#C99A2E]/40' 
                            : 'bg-amber-500/20 text-amber-700 border border-amber-500/40'
                        }`}>
                            {order.status}
                        </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="h-12 w-12 flex-shrink-0 bg-[#FAF4E8] border border-[#D8C5A8] rounded-xl p-1">
                                    <img src={item.image} alt={item.title} className="h-full w-full object-cover rounded" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#3B2A1A] truncate">{item.title}</p>
                                    <p className="text-xs text-[#6B5842]">
                                      Qty: {item.quantity}
                                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                        <span className="ml-2 font-mono text-[10px] text-[#C99A2E]">
                                          ({Object.entries(item.selectedOptions).map(([k,v]) => `${k}: ${v}`).join(', ')})
                                        </span>
                                      )}
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-[#C99A2E]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                        ))}
                    </div>
                  </div>
                  {order.paymentMethod && (
                     <div className="bg-[#F3E6D0] px-4 py-3 border-t border-[#D8C5A8] flex items-center justify-between text-xs text-[#6B5842]">
                        <div className="flex items-center gap-2">
                          <CreditCardIcon className="w-4 h-4 text-[#C99A2E]" />
                          <span className="font-semibold text-[#3B2A1A]">Payment Method: {order.paymentMethod.toUpperCase()}</span>
                        </div>
                        {order.shippingAddress && (
                          <span className="text-[10px] font-mono">Ship to: {order.shippingAddress.city}, {order.shippingAddress.state}</span>
                        )}
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

import React from 'react';
import { CartItem } from '../../../../types';

interface OrderSummaryProps {
  checkoutItems: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  checkoutItems,
  subtotal,
  shipping,
  total,
}) => {
  return (
    <div className="bg-[#FAF4E8] border border-[#D8C5A8] rounded-2xl p-6 sticky top-8 space-y-6 shadow-xl">
      <h3 className="text-base font-bold font-serif text-[#3B2A1A] pb-4 border-b border-[#D8C5A8]">Order Summary</h3>

      {/* Items preview list */}
      <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar pr-1">
        {checkoutItems.map(item => (
          <div key={item.id} className="flex gap-3 items-center text-xs">
            <img src={item.image} alt="" className="w-12 h-14 object-cover rounded bg-[#F3E6D0] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#3B2A1A] truncate">{item.title}</p>
              <p className="text-[#6B5842] text-[10px]">Qty: {item.quantity}</p>
            </div>
            <span className="font-mono font-bold text-[#C99A2E]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>

      {/* Pricing totals */}
      <div className="space-y-2 text-xs text-[#6B5842] pt-4 border-t border-[#D8C5A8] font-mono">
        <div className="flex justify-between">
          <span className="text-[#6B5842]">Subtotal</span>
          <span className="font-semibold text-[#3B2A1A]">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6B5842]">Express Shipping</span>
          <span className="text-[#C99A2E] font-medium">
            {shipping === 0 ? 'FREE' : `₹${shipping}`}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold text-[#3B2A1A] pt-3 border-t border-[#D8C5A8] font-sans">
          <span className="font-serif uppercase tracking-wider">Total</span>
          <span className="font-mono text-[#C99A2E]">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl"
      >
        Place Order (₹{total.toLocaleString('en-IN')})
      </button>

      <p className="text-[10px] text-center text-[#6B5842]">
        By placing your order, you agree to UrbanMan Terms & Conditions.
      </p>
    </div>
  );
};

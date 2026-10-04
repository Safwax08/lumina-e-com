import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  freeShipping: boolean;
  finalTotal: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  onApplyPromo: (e: React.FormEvent) => void;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discount,
  freeShipping,
  finalTotal,
  promoCode,
  setPromoCode,
  onApplyPromo,
  onCheckout,
}) => {
  return (
    <div className="p-6 border-t border-[#D8C5A8] bg-[#F3E6D0] space-y-4">
      
      {/* Promo Code Input */}
      <form onSubmit={onApplyPromo} className="flex gap-2">
        <input
          type="text"
          placeholder="Promo code (URBAN15)"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg text-xs text-[#3B2A1A] placeholder-[#6B5842] focus:outline-none focus:border-[#C99A2E]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#FAF4E8] hover:bg-[#C99A2E] hover:text-[#FFFDF8] text-[#C99A2E] text-xs font-bold rounded-lg border border-[#D8C5A8] transition-colors"
        >
          Apply
        </button>
      </form>

      {/* Subtotal / Total */}
      <div className="space-y-1.5 text-xs text-[#6B5842] font-mono">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[#C99A2E]">
            <span>Discount (15%)</span>
            <span>-₹{discount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{freeShipping ? 'FREE' : '₹150'}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-[#3B2A1A] pt-2 border-t border-[#D8C5A8] font-sans">
          <span>Total</span>
          <span className="text-[#C99A2E]">₹{(finalTotal + (freeShipping ? 0 : 150)).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full py-4 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

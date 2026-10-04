import React, { useState } from 'react';
import { CartItem as CartItemType } from '../../../../types';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItemType[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = discountApplied ? subtotal * 0.15 : 0;
  const shippingThreshold = 1999;
  const freeShipping = subtotal >= shippingThreshold;
  const progressPercent = Math.min(100, (subtotal / shippingThreshold) * 100);
  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'URBAN15' || promoCode.trim().toUpperCase() === 'MAN30') {
      setDiscountApplied(true);
    } else {
      alert('Enter coupon code URBAN15 or MAN30 for discount');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-[#3B2A1A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF4E8] text-[#3B2A1A] border-l border-[#D8C5A8] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-[#D8C5A8] flex items-center justify-between bg-[#F3E6D0]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF4E8] text-[#C99A2E] flex items-center justify-center border border-[#D8C5A8]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif uppercase tracking-wider text-[#3B2A1A]">Your Shopping Bag</h2>
                <p className="text-xs text-[#6B5842]">{cart.reduce((a, b) => a + b.quantity, 0)} items selected</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="text-[#6B5842] hover:text-[#3B2A1A] p-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-[#FAF4E8]/80 border-b border-[#D8C5A8]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#6B5842] font-medium">
                {freeShipping ? '🎉 You unlocked FREE Express Shipping!' : `Add ₹${(shippingThreshold - subtotal).toLocaleString('en-IN')} more for FREE Shipping`}
              </span>
              <span className="text-[#C99A2E] font-mono font-bold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#F3E6D0] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#A87918] to-[#C99A2E] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#6B5842] py-12">
                <div className="w-16 h-16 rounded-full bg-[#FAF4E8] flex items-center justify-center mb-4 text-[#C99A2E] border border-[#D8C5A8]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[#3B2A1A] mb-1">Your bag is empty</h3>
                <p className="text-xs text-[#6B5842] mb-6 max-w-xs">Explore our latest menswear arrivals and tailor your elevated style.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] text-xs uppercase font-bold tracking-widest rounded-lg shadow-lg"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <CartSummary
              subtotal={subtotal}
              discount={discount}
              freeShipping={freeShipping}
              finalTotal={finalTotal}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              onApplyPromo={handleApplyPromo}
              onCheckout={onCheckout}
            />
          )}

        </div>
      </div>
    </div>
  );
};

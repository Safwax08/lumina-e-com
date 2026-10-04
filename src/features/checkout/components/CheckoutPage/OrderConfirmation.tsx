import React from 'react';

interface OrderConfirmationProps {
  orderId: string;
  email: string;
  paymentMethod: string;
  onNavigateHome: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  email,
  paymentMethod,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-screen bg-[#F3E6D0] text-[#3B2A1A] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#FAF4E8] border border-[#D8C5A8] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#FFFDF8] text-[#C99A2E] mx-auto flex items-center justify-center border border-[#D8C5A8]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#C99A2E] font-bold">ORDER CONFIRMED</span>
          <h2 className="text-2xl font-bold font-serif text-[#3B2A1A] mt-1">Thank You for Your Order!</h2>
          <p className="text-xs text-[#6B5842] mt-2">
            Order ID: <span className="font-mono text-[#C99A2E] font-bold">{orderId}</span>
          </p>
        </div>

        <div className="bg-[#FFFDF8] rounded-xl p-4 text-xs text-[#6B5842] space-y-2 border border-[#D8C5A8] text-left">
          <div className="flex justify-between">
            <span className="text-[#6B5842]">Confirmation Sent To:</span>
            <span className="font-semibold text-[#3B2A1A]">{email || 'customer@urbanman.com'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B5842]">Estimated Delivery:</span>
            <span className="font-semibold text-[#3B2A1A]">3-5 Business Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B5842]">Payment Status:</span>
            <span className="text-[#C99A2E] font-bold uppercase">{paymentMethod === 'cod' ? 'Pay on Delivery' : 'Paid Online'}</span>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="w-full py-3.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

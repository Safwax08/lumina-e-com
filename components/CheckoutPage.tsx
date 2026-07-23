import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { CreditCardIcon, ArrowLeftIcon } from './Icons';
import { placeOrder } from '../services/orderService';

interface CheckoutPageProps {
  items: CartItem[];
  onClearCart: () => void;
  onNavigateHome: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  onClearCart,
  onNavigateHome,
  onOrderPlaced
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States'
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Form input handlers
  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setPaymentForm({ ...paymentForm, cardNumber: val.slice(0, 19) });
  };

  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    setPaymentForm({ ...paymentForm, expiry: val.slice(0, 5) });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsProcessing(true);

    try {
      // Simulate Payment Gateway Delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const order = await placeOrder(items, total, {
        last4: paymentForm.cardNumber.slice(-4) || '1234',
        brand: 'Visa'
      });

      setOrderSuccess(order);
      onClearCart();
      onOrderPlaced(order);
    } catch (error) {
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-800 font-sans">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 border border-emerald-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Order Placed Successfully!</h2>
        <p className="text-slate-500 font-light text-sm mb-6">
          Thank you for your order! Your order ID is <span className="font-mono font-bold text-slate-800">{orderSuccess.id.slice(0, 8)}...</span>. A confirmation email has been sent to <span className="font-semibold text-slate-800">{shippingForm.email || 'your email'}</span>.
        </p>
        
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl mb-8 text-left max-w-sm mx-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Shipping To</h3>
          <p className="text-sm font-bold text-slate-800">{shippingForm.firstName} {shippingForm.lastName}</p>
          <p className="text-xs text-slate-500 font-light leading-relaxed mt-1">{shippingForm.address}, {shippingForm.city}</p>
        </div>

        <button 
          onClick={onNavigateHome} 
          className="bg-[#750a27] hover:bg-slate-900 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-800 font-sans">
        <p className="text-slate-500 font-light mb-6">Your checkout cart is empty.</p>
        <button 
          onClick={onNavigateHome} 
          className="bg-[#750a27] text-white font-bold px-6 py-2.5 rounded-xl"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800 font-sans">
      
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onNavigateHome} className="p-1.5 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 text-slate-600" />
        </button>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns: Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 tracking-wide mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-[#750a27]/10 text-[#750a27] text-xs font-bold">1</span>
              <span>Shipping Information</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner text-sm"
                  value={shippingForm.firstName}
                  onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner text-sm"
                  value={shippingForm.lastName}
                  onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner text-sm"
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner text-sm"
                  value={shippingForm.phone}
                  onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Street Address</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner text-sm"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">City</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner text-sm"
                  value={shippingForm.city}
                  onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Zip Code</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner text-sm"
                  value={shippingForm.zip}
                  onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 tracking-wide mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-[#750a27]/10 text-[#750a27] text-xs font-bold">2</span>
              <span>Payment Details</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner text-sm"
                    value={paymentForm.cardNumber}
                    onChange={handleCardInput}
                    maxLength={19}
                    required
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <CreditCardIcon className="w-4.5 h-4.5" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white placeholder-slate-400 transition-all shadow-inner text-sm"
                    value={paymentForm.expiry}
                    onChange={handleExpiryInput}
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">CVC</label>
                  <input 
                    type="password" 
                    placeholder="123" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white placeholder-slate-400 transition-all shadow-inner text-sm"
                    value={paymentForm.cvc}
                    onChange={(e) => setPaymentForm({...paymentForm, cvc: e.target.value.replace(/\D/g, '').slice(0,3)})}
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white placeholder-slate-400 transition-all shadow-inner text-sm"
                  value={paymentForm.name}
                  onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
                  required
                />
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-500 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#750a27]">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
                <span>Payments are secure and encrypted. This is a simulated environment for demonstration purposes.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns: Summary */}
        <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 tracking-wide border-b border-slate-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {items.map(item => (
              <div key={item.id} className="flex gap-3 text-xs font-semibold text-slate-700">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                  <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-slate-800">{item.title}</h4>
                  <p className="text-slate-400 mt-0.5">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                </div>
                <span className="font-mono text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-500 font-semibold">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-800 font-mono">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-600">Free</span>
            </div>
            <div className="border-t border-slate-100 my-2"></div>
            <div className="flex justify-between text-sm font-bold text-slate-900">
              <span>Total Price</span>
              <span className="text-[#750a27] font-black font-mono text-base">${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#750a27] hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:opacity-95 transition-all shadow-md disabled:opacity-75 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing Order...
              </>
            ) : (
              <>Place Order (${total.toFixed(2)})</>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};

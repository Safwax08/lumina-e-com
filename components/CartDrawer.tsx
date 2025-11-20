import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { CloseIcon, ShoppingCartIcon, CreditCardIcon, ArrowLeftIcon } from './Icons';
import { placeOrder } from '../services/orderService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onClearCart: () => void;
}

type CheckoutStep = 'cart' | 'payment';

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onClearCart }) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Reset state when drawer closes/opens
  useEffect(() => {
    if (!isOpen) {
        setTimeout(() => {
            setStep('cart');
            setIsProcessing(false);
            setPaymentForm({ cardNumber: '', expiry: '', cvc: '', name: '' });
        }, 300);
    }
  }, [isOpen]);

  // Form input handlers with basic formatting
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

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate Payment Gateway Delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await placeOrder(items, total, {
        last4: paymentForm.cardNumber.slice(-4) || '0000',
        brand: 'Visa' // Mocked brand
      });
      
      onClearCart();
      onClose();
      alert("Payment Successful! Your order has been placed.");
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-900/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            {step === 'payment' ? (
               <button onClick={() => setStep('cart')} className="p-1 hover:bg-gray-200 rounded-full mr-2">
                  <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
               </button>
            ) : <ShoppingCartIcon className="w-5 h-5 text-gray-900" />}
            <h2 className="text-lg font-semibold text-gray-900">
                {step === 'cart' ? `Your Cart (${items.length})` : 'Checkout'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 && step === 'cart' ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <ShoppingCartIcon className="w-16 h-16 text-gray-200 mb-4" />
              <p>Your cart is empty</p>
              <button onClick={onClose} className="mt-4 text-indigo-600 font-medium hover:underline">
                Start Shopping
              </button>
            </div>
          ) : (
             <>
               {step === 'cart' && (
                 <div className="space-y-4">
                   {items.map(item => (
                    <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 animate-in fade-in slide-in-from-right-4">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md flex items-center justify-center p-2">
                        <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.title}</h3>
                        <p className="text-sm font-bold text-gray-900 mb-2">${(item.price * item.quantity).toFixed(2)}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                            <button 
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button 
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                onClick={() => onUpdateQuantity(item.id, 1)}
                            >
                                +
                            </button>
                            </div>
                            <button 
                                onClick={() => onRemove(item.id)}
                                className="text-xs text-red-500 hover:text-red-700 underline"
                            >
                                Remove
                            </button>
                        </div>
                        </div>
                    </div>
                   ))}
                 </div>
               )}

               {step === 'payment' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h3 className="text-sm font-semibold text-indigo-900 mb-2">Order Summary</h3>
                        <div className="flex justify-between text-sm text-indigo-800 mb-1">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-indigo-800">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="border-t border-indigo-200 my-2"></div>
                        <div className="flex justify-between font-bold text-indigo-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000" 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    value={paymentForm.cardNumber}
                                    onChange={handleCardInput}
                                    maxLength={19}
                                    required
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <CreditCardIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    value={paymentForm.expiry}
                                    onChange={handleExpiryInput}
                                    maxLength={5}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                <input 
                                    type="password" 
                                    placeholder="123" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    value={paymentForm.cvc}
                                    onChange={(e) => setPaymentForm({...paymentForm, cvc: e.target.value.replace(/\D/g, '').slice(0,3)})}
                                    maxLength={3}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                value={paymentForm.name}
                                onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
                                required
                            />
                        </div>
                    </form>

                    <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                        </svg>
                        <span>Payments are secure and encrypted. This is a simulated environment for demonstration purposes.</span>
                    </div>
                 </div>
               )}
             </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            {step === 'cart' ? (
                <>
                    <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
                    </div>
                    <button 
                    onClick={() => setStep('payment')}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                        Proceed to Checkout
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-4">
                        Taxes and shipping calculated at checkout.
                    </p>
                </>
            ) : (
                <button 
                    form="payment-form"
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                    ) : (
                        <>Pay ${total.toFixed(2)}</>
                    )}
                </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
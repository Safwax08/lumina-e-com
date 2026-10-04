import React, { useState } from 'react';
import { CartItem } from '../../../../types';
import { ShippingForm } from './ShippingForm';
import { PaymentSection } from './PaymentSection';
import { OrderSummary } from './OrderSummary';
import { OrderConfirmation } from './OrderConfirmation';
import { placeOrderService } from '../../../../services/orders';

export interface CheckoutPageProps {
  items?: CartItem[];
  cart?: CartItem[];
  onClearCart: () => void;
  onNavigateHome: () => void;
  onOrderPlaced?: (order: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  cart: propsCart,
  onClearCart,
  onNavigateHome,
  onOrderPlaced,
}) => {
  const checkoutItems = items || propsCart || [];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi'
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const subtotal = checkoutItems.reduce((sum, item) => {
    const itemPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);
  const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 149;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.firstName.trim() || !formData.email.trim() || !formData.address.trim() || !formData.phone.trim()) {
      setValidationError('Please fill in all mandatory shipping fields marked with *.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (formData.phone.trim().length < 7) {
      setValidationError('Please enter a valid contact phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const createdOrder = await placeOrderService(checkoutItems, formData, formData.paymentMethod);
      setOrderId(createdOrder.id);
      setOrderPlaced(true);
      if (onOrderPlaced) {
        onOrderPlaced(createdOrder);
      }
      onClearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      setValidationError('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <OrderConfirmation
        orderId={orderId}
        email={formData.email}
        paymentMethod={formData.paymentMethod}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F3E6D0] text-[#3B2A1A] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-[#D8C5A8] mb-8">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#C99A2E] font-bold">SECURE CHECKOUT</span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3B2A1A] mt-1">Complete Your Order</h1>
          </div>
          <button 
            onClick={onNavigateHome}
            className="text-xs text-[#6B5842] hover:text-[#C99A2E] underline font-mono"
          >
            ← Back to Store
          </button>
        </div>

        {validationError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-xl shadow-sm">
            {validationError}
          </div>
        )}

        {checkoutItems.length === 0 ? (
          <div className="text-center py-20 bg-[#FAF4E8] rounded-2xl border border-[#D8C5A8]">
            <h3 className="text-lg font-bold text-[#3B2A1A] mb-2">Your Shopping Bag is empty</h3>
            <p className="text-xs text-[#6B5842] mb-6">Add items to your bag before proceeding to checkout.</p>
            <button
              onClick={onNavigateHome}
              className="px-6 py-2.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] text-xs font-bold uppercase rounded-lg shadow-md"
            >
              Explore Menswear
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <ShippingForm formData={formData} onChange={handleChange} />
              <PaymentSection paymentMethod={formData.paymentMethod} onChange={handleChange} />
            </div>

            <div className="lg:col-span-5">
              <OrderSummary
                checkoutItems={checkoutItems}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-4 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Processing Order...' : `Place Order (₹${total.toLocaleString('en-IN')})`}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

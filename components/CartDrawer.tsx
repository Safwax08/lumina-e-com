import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { CloseIcon, ShoppingCartIcon, CreditCardIcon, ArrowLeftIcon } from './Icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQuantity, 
  onClearCart,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute inset-y-0 right-0 max-w-md w-full bg-white border-l border-slate-100 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'} text-slate-800`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <ShoppingCartIcon className="w-5 h-5 text-[#750a27]" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              Your Cart ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <ShoppingCartIcon className="w-16 h-16 text-slate-200 mb-4 animate-pulse" />
              <p className="font-light">Your cart is empty</p>
              <button onClick={onClose} className="mt-4 text-[#750a27] font-semibold hover:underline transition-colors">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 animate-in fade-in slide-in-from-right-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100">
                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-1">{item.title}</h3>
                    
                    {/* Render selected options if they are stored in item as a custom property (or we can just show category) */}
                    <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wider">
                      {item.category.replace('-', ' ')}
                    </div>
                    
                    <p className="text-sm font-black text-[#750a27] mb-2 font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        <button 
                          className="px-3 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all disabled:opacity-30 font-bold text-xs"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold w-8 text-center text-slate-800 font-mono">{item.quantity}</span>
                        <button 
                          className="px-3 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all font-bold text-xs"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 transition-colors font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-sm">Subtotal</span>
              <span className="text-xl font-bold text-slate-900 font-mono">${total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full bg-[#750a27] hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-light uppercase tracking-wider">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { CartItem as CartItemType } from '../../../../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div 
      className="bg-[#FFFDF8] border border-[#D8C5A8] rounded-xl p-3 flex gap-3 items-center group hover:border-[#C99A2E] transition-colors shadow-sm"
    >
      <img 
        src={item.image} 
        alt={item.title} 
        className="w-20 h-24 object-cover rounded-lg bg-[#FAF4E8] flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[#3B2A1A] truncate group-hover:text-[#C99A2E] transition-colors">
          {item.title}
        </h4>
        <p className="text-xs text-[#6B5842] mt-0.5">{item.brand || 'UrbanMan'}</p>
        <p className="text-sm font-bold text-[#C99A2E] mt-1">₹{item.price.toLocaleString('en-IN')}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-[#D8C5A8] rounded-lg bg-[#FAF4E8] overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="px-2.5 py-1 text-[#6B5842] hover:text-[#3B2A1A] hover:bg-black/5 transition-colors font-bold"
            >
              -
            </button>
            <span className="px-3 text-xs font-mono text-[#3B2A1A] font-bold">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="px-2.5 py-1 text-[#6B5842] hover:text-[#3B2A1A] hover:bg-black/5 transition-colors font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemoveItem(item.id)}
            className="p-1 text-[#6B5842] hover:text-rose-600 transition-colors ml-auto"
            title="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

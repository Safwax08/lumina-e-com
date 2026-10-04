import React from 'react';
import { Product } from '../../../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onViewDetails
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#3B2A1A]/60 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF4E8] text-[#3B2A1A] border-l border-[#D8C5A8] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#D8C5A8] flex items-center justify-between bg-[#F3E6D0]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAF4E8] border border-[#D8C5A8] flex items-center justify-center text-[#C99A2E]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="m11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold font-serif text-[#3B2A1A] tracking-wide">
                Your Saved Items ({wishlistProducts.length})
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#6B5842] hover:text-[#3B2A1A] hover:bg-black/5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* List of items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-20 text-[#6B5842] space-y-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 mx-auto opacity-40 text-[#C99A2E]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <p className="text-sm font-light">Your wishlist is empty.</p>
                <p className="text-xs text-[#6B5842]">Explore products and tap the heart icon to save your favorites.</p>
              </div>
            ) : (
              wishlistProducts.map(product => (
                <div 
                  key={product.id}
                  className="bg-[#FFFDF8] border border-[#D8C5A8] rounded-xl p-3 flex gap-4 items-center relative group hover:border-[#C99A2E] transition-all shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-24 object-cover rounded-lg bg-[#FAF4E8] cursor-pointer"
                    onClick={() => {
                      onViewDetails(product);
                      onClose();
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#6B5842] font-mono uppercase tracking-wider block">
                      {product.brand || 'URBAN MAN'}
                    </span>
                    <h4 
                      onClick={() => {
                        onViewDetails(product);
                        onClose();
                      }}
                      className="text-sm font-semibold text-[#3B2A1A] truncate cursor-pointer hover:text-[#C99A2E] transition-colors"
                    >
                      {product.title}
                    </h4>
                    
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-[#C99A2E] font-sans">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-xs text-[#6B5842] line-through">
                          ₹{product.original_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveFromWishlist(product);
                        }}
                        className="px-3 py-1.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        Move to Cart
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="p-1.5 text-[#6B5842] hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-6 border-t border-[#D8C5A8] bg-[#F3E6D0]">
              <button
                onClick={() => {
                  wishlistProducts.forEach(p => onAddToCart(p));
                  onClose();
                }}
                className="w-full py-3.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
              >
                Add All to Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

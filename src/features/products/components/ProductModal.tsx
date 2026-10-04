import React, { useState } from 'react';
import { Product } from '../../../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, options?: Record<string, string>) => void;
  onBuyNow: (product: Product, options?: Record<string, string>) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted = false,
  onToggleWishlist
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<string>(
    product.attributes?.find(a => a.name.toLowerCase().includes('color'))?.options[0]?.value || 'Default'
  );
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    onAddToCart(product, { color: selectedColor, size: selectedSize });
    onClose();
  };

  const handleBuyNow = () => {
    onBuyNow(product, { color: selectedColor, size: selectedSize });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#3B2A1A]/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#FAF4E8] text-[#3B2A1A] border border-[#D8C5A8] rounded-2xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-[#6B5842] hover:text-[#3B2A1A] p-2 rounded-full bg-[#FFFDF8] border border-[#D8C5A8] transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Column: Image Gallery */}
        <div className="p-6 bg-[#F3E6D0] flex flex-col justify-between border-r border-[#D8C5A8]">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF4E8] border border-[#D8C5A8]">
            <img
              src={images[activeImgIndex] || product.image}
              alt={product.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover"
            />
            {product.original_price && product.original_price > product.price && (
              <span className="absolute top-3 left-3 bg-[#C99A2E] text-[#FFFDF8] text-xs font-extrabold px-2.5 py-1 rounded shadow-md">
                SAVE ₹{(product.original_price - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImgIndex === idx ? 'border-[#C99A2E] ring-2 ring-[#C99A2E]/30' : 'border-[#D8C5A8] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt="" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
          <div className="space-y-6">
            
            {/* Brand & Category */}
            <div>
              <div className="flex justify-between items-center text-xs text-[#6B5842] font-mono tracking-widest uppercase mb-1">
                <span>{product.brand || 'URBAN MAN'}</span>
                <span className="text-[#C99A2E] font-bold">In Stock</span>
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#3B2A1A] leading-tight">
                {product.title}
              </h2>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-[#D8C5A8]">
              <span className="text-2xl font-bold text-[#C99A2E] font-sans">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-[#6B5842] line-through">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#6B5842] leading-relaxed font-light">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.attributes && product.attributes.find(a => a.name.toLowerCase().includes('color')) && (
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#6B5842] mb-2">
                  Select Color: <span className="text-[#3B2A1A] font-sans font-semibold">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {product.attributes.find(a => a.name.toLowerCase().includes('color'))?.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedColor(opt.value)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-2 ${
                        selectedColor === opt.value
                          ? 'bg-[#C99A2E] text-[#FFFDF8] border-[#C99A2E]'
                          : 'bg-[#FFFDF8] text-[#6B5842] border-[#D8C5A8] hover:border-[#C99A2E]/40'
                      }`}
                    >
                      {opt.color_code && (
                        <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: opt.color_code }} />
                      )}
                      <span>{opt.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase font-mono tracking-wider text-[#6B5842]">
                  Select Size: <span className="text-[#3B2A1A] font-sans font-semibold">{selectedSize}</span>
                </label>
                <span className="text-[11px] text-[#C99A2E] underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-lg border text-xs font-bold transition-all ${
                      selectedSize === size
                        ? 'bg-[#C99A2E] text-[#FFFDF8] border-[#C99A2E]'
                        : 'bg-[#FFFDF8] text-[#6B5842] border-[#D8C5A8] hover:border-[#C99A2E]/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-[#6B5842] mb-2">Quantity</label>
              <div className="flex items-center w-32 border border-[#D8C5A8] rounded-lg bg-[#FFFDF8] overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-[#6B5842] hover:text-[#3B2A1A] hover:bg-black/5 transition-colors font-bold"
                >
                  -
                </button>
                <span className="flex-1 text-center font-mono font-bold text-sm text-[#3B2A1A]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-[#6B5842] hover:text-[#3B2A1A] hover:bg-black/5 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-[#D8C5A8] space-y-2 mt-6">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 bg-[#3B2A1A] hover:bg-[#6B5842] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
              >
                Buy Now
              </button>
            </div>

            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-full py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isWishlisted ? 'text-[#C99A2E]' : 'text-[#6B5842] hover:text-[#3B2A1A]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <span>{isWishlisted ? 'In Your Wishlist' : 'Add to Wishlist'}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { Product } from '../../../../types';

interface ProductInfoProps {
  product: Product;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  onAddToCart: (product: Product, selectedOptions?: Record<string, string>, qty?: number) => void;
  onBuyNow: (product: Product, selectedOptions?: Record<string, string>, qty?: number) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  onAddToCart,
  onBuyNow,
}) => {
  // Find matching variant
  const activeVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    return product.variants.find(v => {
      const colorMatch = v.options.some(o => o.name.toLowerCase().includes('color') && o.value.toLowerCase() === selectedColor.toLowerCase());
      const sizeMatch = v.options.some(o => o.name.toLowerCase().includes('size') && o.value.toLowerCase() === selectedSize.toLowerCase());
      return colorMatch || sizeMatch;
    }) || null;
  }, [product.variants, selectedColor, selectedSize]);

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentOriginalPrice = activeVariant ? activeVariant.original_price : product.original_price;
  const currentStock = activeVariant ? activeVariant.stock : (product.stock !== undefined ? product.stock : 25);
  const sku = activeVariant ? activeVariant.sku || `UM-${product.id}-${selectedColor.substring(0, 2).toUpperCase()}-${selectedSize}` : `UM-${product.id.toUpperCase()}`;

  const isOutOfStock = currentStock <= 0;

  return (
    <div className="flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-[#6B5842]">
          <span className="text-[#C99A2E] font-bold">{product.brand || 'URBAN MAN'}</span>
          <span className={isOutOfStock ? 'text-red-600 font-bold' : 'text-[#C99A2E] font-bold'}>
            {isOutOfStock ? 'Out of Stock' : `In Stock (${currentStock} left)`}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#3B2A1A] leading-tight">
          {product.title}
        </h1>

        <div className="text-[11px] font-mono text-[#6B5842]">
          SKU: <span className="font-semibold text-[#3B2A1A]">{sku}</span>
        </div>

        <div className="flex items-baseline gap-4 pb-4 border-b border-[#D8C5A8]">
          <span className="text-3xl font-bold font-sans text-[#C99A2E]">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {currentOriginalPrice && currentOriginalPrice > currentPrice && (
            <span className="text-lg text-[#6B5842] line-through">
              ₹{currentOriginalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <p className="text-sm text-[#6B5842] leading-relaxed font-light">
          {product.description}
        </p>

        {/* Color options */}
        {product.attributes && product.attributes.find(a => a.name.toLowerCase().includes('color')) && (
          <div className="space-y-2 pt-2">
            <span className="text-xs uppercase font-mono text-[#6B5842] block">
              Color: <strong className="text-[#3B2A1A] font-sans">{selectedColor}</strong>
            </span>
            <div className="flex gap-2">
              {product.attributes.find(a => a.name.toLowerCase().includes('color'))?.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedColor(opt.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                    selectedColor === opt.value
                      ? 'bg-[#C99A2E] text-[#FFFDF8] border-[#C99A2E]'
                      : 'bg-[#FAF4E8] text-[#6B5842] border-[#D8C5A8] hover:border-[#C99A2E]/40'
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

        {/* Size selector */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="uppercase font-mono text-[#6B5842]">
              Size: <strong className="text-[#3B2A1A] font-sans">{selectedSize}</strong>
            </span>
            <span className="text-[#C99A2E] underline cursor-pointer">Size Guide</span>
          </div>
          <div className="flex gap-2">
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-11 h-11 rounded-lg text-xs font-bold border transition-all ${
                  selectedSize === size
                    ? 'bg-[#C99A2E] text-[#FFFDF8] border-[#C99A2E]'
                    : 'bg-[#FAF4E8] text-[#6B5842] border-[#D8C5A8] hover:border-[#C99A2E]/40'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-2 pt-2">
          <span className="text-xs uppercase font-mono text-[#6B5842] block">Quantity</span>
          <div className="flex items-center w-36 border border-[#D8C5A8] rounded-xl bg-[#FAF4E8] overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
              className="px-4 py-2 text-[#6B5842] hover:text-[#3B2A1A] transition-colors font-bold disabled:opacity-30"
            >
              -
            </button>
            <span className="flex-1 text-center font-mono font-bold text-[#3B2A1A]">{isOutOfStock ? 0 : quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(quantity + 1, currentStock))}
              disabled={isOutOfStock || quantity >= currentStock}
              className="px-4 py-2 text-[#6B5842] hover:text-[#3B2A1A] transition-colors font-bold disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>

      </div>

      {/* Action buttons */}
      <div className="pt-6 border-t border-[#D8C5A8] flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onAddToCart(product, { Color: selectedColor, Size: selectedSize }, quantity)}
          disabled={isOutOfStock}
          className="flex-1 py-4 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
        </button>

        <button
          onClick={() => onBuyNow(product, { Color: selectedColor, Size: selectedSize }, quantity)}
          disabled={isOutOfStock}
          className="flex-1 py-4 bg-[#3B2A1A] hover:bg-[#6B5842] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>

    </div>
  );
};

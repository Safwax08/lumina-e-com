import React, { useMemo, useState } from 'react';
import { Product } from '../../../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string) => void;
  onQuickView?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onViewDetails, 
  onAddToCart,
  onQuickView,
  isWishlisted: initialWishlisted = false,
  onToggleWishlist
}) => {
  const [internalWishlisted, setInternalWishlisted] = useState(initialWishlisted);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const isWishlisted = onToggleWishlist ? initialWishlisted : internalWishlisted;

  // Find color attributes to show swatches
  const colorAttr = useMemo(() => {
    if (!product.attributes) return null;
    return product.attributes.find(
      attr => attr.name.toLowerCase().includes('color') || attr.type === 'Color'
    );
  }, [product]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    } else {
      setInternalWishlisted(!internalWishlisted);
    }
  };

  return (
    <div 
      className="group bg-[#FAF4E8] border border-[#D8C5A8] hover:border-[#C99A2E] rounded-xl overflow-hidden flex flex-col h-full relative transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-[#3B2A1A]/10 hover:-translate-y-1 cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      
      {/* Product Image Frame */}
      <div className="relative w-full aspect-[4/5] bg-[#F3E6D0] overflow-hidden">
        
        {/* Discount Badge */}
        {product.original_price && product.original_price > product.price && (
          <span className="absolute top-3 left-3 bg-[#C99A2E] text-[#FFFDF8] text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded z-10 shadow-md">
            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FAF4E8]/80 backdrop-blur-md text-[#6B5842] hover:text-[#C99A2E] hover:bg-[#FFFDF8] border border-[#D8C5A8] transition-all z-10 flex items-center justify-center shadow-lg"
          aria-label="Wishlist"
        >
          {isWishlisted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#C99A2E] scale-110 transition-transform">
              <path d="m11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}
        </button>

        {/* Product Image */}
        <img 
          src={product.image} 
          alt={product.title} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-95 group-hover:opacity-100" 
        />
        
        {/* Quick View Button overlay */}
        <div className="absolute inset-0 bg-[#3B2A1A]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView ? onQuickView(product) : onViewDetails(product);
            }}
            className="text-xs font-bold uppercase tracking-widest bg-[#FFFDF8] text-[#3B2A1A] hover:bg-[#C99A2E] hover:text-[#FFFDF8] px-4 py-2.5 rounded-lg shadow-xl border border-[#D8C5A8] transition-all transform translate-y-3 group-hover:translate-y-0 duration-300"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-[#FAF4E8]">
        
        <div className="space-y-2">
          
          {/* Title */}
          <h3 className="text-[#3B2A1A] font-semibold text-sm leading-snug line-clamp-1 group-hover:text-[#C99A2E] transition-colors">
            {product.title}
          </h3>

          {/* Price Row */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-base font-bold text-[#C99A2E] font-sans">₹{product.price.toLocaleString('en-IN')}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-[#6B5842] line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
            )}
          </div>

          {/* Color swatches */}
          {colorAttr && colorAttr.options && colorAttr.options.length > 0 && (
            <div className="flex gap-1.5 items-center pt-1" onClick={(e) => e.stopPropagation()}>
              {colorAttr.options.map(opt => (
                <button
                  key={opt.id}
                  title={opt.value}
                  onClick={() => setSelectedColor(opt.value)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform block ${
                    selectedColor === opt.value ? 'scale-125 border-[#C99A2E] ring-2 ring-[#C99A2E]/40' : 'border-[#D8C5A8] hover:scale-110'
                  }`}
                  style={{ backgroundColor: opt.color_code || '#666' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Button: Mustard Gold Button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#D8C5A8]">
          <span className="text-[11px] text-[#6B5842] uppercase tracking-wider font-mono">
            {product.brand || 'URBAN MAN'}
          </span>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, selectedColor || undefined);
            }}
            className="bg-[#C99A2E] hover:bg-[#A87918] active:scale-95 text-[#FFFDF8] p-2.5 rounded-lg border border-[#C99A2E] transition-all flex items-center justify-center shadow-md font-bold"
            title="Add to Cart"
            aria-label="Add to cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        </div>

      </div>

    </div>
  );
};

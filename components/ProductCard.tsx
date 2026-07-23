import React, { useMemo, useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onViewDetails, 
  onAddToCart,
  onQuickView
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Find color attributes to show swatches
  const colorAttr = useMemo(() => {
    if (!product.attributes) return null;
    return product.attributes.find(
      attr => attr.name.toLowerCase().includes('color') || attr.type === 'Color'
    );
  }, [product]);

  return (
    <div 
      className="group bg-white border border-slate-200/50 rounded-2xl overflow-hidden flex flex-col h-full relative transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-slate-300/40 hover:-translate-y-1.5 cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      
      {/* Product Image Frame (No padding, spans 100% width and height) */}
      <div className="relative w-full h-56 bg-[#eef0f3] overflow-hidden">
        
        {/* Sale Badge */}
        {product.original_price && product.original_price > product.price && (
          <span className="absolute top-3 left-3 bg-[#4c4c4c] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm z-10 shadow-sm">
            Sale
          </span>
        )}

        {/* Wishlist Heart directly on top of the image frame in bottom right corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute bottom-3 right-3 text-slate-400 hover:text-rose-500 transition-colors z-10"
        >
          {isWishlisted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-rose-500 scale-110 transition-transform duration-200">
              <path d="m11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-6 h-6 hover:scale-110 transition-all">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}
        </button>

        {/* Product Image */}
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
        
        {/* Quick View Button overlay */}
        {onQuickView && (
          <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="text-[10px] font-bold uppercase tracking-wider bg-white text-slate-800 hover:bg-[#750a27] hover:text-white px-4 py-2 rounded-xl shadow-lg border border-slate-100 transition-all transform translate-y-3 group-hover:translate-y-0 duration-300"
            >
              Quick Look
            </button>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        
        <div className="space-y-2">
          
          {/* Title & Swatches Row */}
          <div className="flex justify-between items-start gap-2">
            {/* Title */}
            <h3 className="text-slate-800 font-extrabold text-sm leading-snug line-clamp-2 flex-1">
              {product.title}
            </h3>

            {/* Color swatches aligned to the right side of the title */}
            {colorAttr && colorAttr.options && colorAttr.options.length > 0 && (
              <div className="flex gap-1 items-center pt-1.5 flex-shrink-0">
                {colorAttr.options.slice(0, 3).map(opt => (
                  <span
                    key={opt.id}
                    title={opt.value}
                    className="w-3.5 h-3.5 rounded-full border border-slate-300/40 block shadow-sm flex-shrink-0"
                    style={{ backgroundColor: opt.color_code || '#fff' }}
                  />
                ))}
                {colorAttr.options.length > 3 && (
                  <span className="text-[9px] text-slate-400 font-bold self-center ml-0.5">+{colorAttr.options.length - 3}</span>
                )}
              </div>
            )}
          </div>
          
          {/* Rating Stars placed below title */}
          {product.rating && (
            <div className="flex items-center text-[#ffd002]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-3.5 h-3.5 ${i < Math.round(product.rating.rate) ? 'text-[#ffd002]' : 'text-slate-200'}`}>
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
          )}

          {/* Price (Formatted as Rs.) */}
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-sm font-bold text-slate-900 font-sans">Rs.{product.price.toLocaleString()}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[10px] text-slate-400 line-through font-mono">Rs.{product.original_price.toLocaleString()}</span>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="flex-1 bg-[#2d3138] hover:bg-[#750a27] text-white text-[10px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg transition-colors duration-300 text-center shadow-sm"
          >
            View Details
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-white hover:bg-slate-50 text-slate-700 hover:text-[#750a27] p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors duration-300 flex items-center justify-center w-10 h-10 flex-shrink-0 shadow-sm"
            aria-label="Add to cart"
          >
            {/* Down chevron icon to match Image 2's action dropdown button */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

      </div>

    </div>
  );
};
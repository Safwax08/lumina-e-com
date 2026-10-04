import React from 'react';
import { Product } from '../../../../types';

interface ProductGalleryProps {
  product: Product;
  selectedImage: string;
  onSelectImage: (img: string) => void;
  isWishlisted: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  selectedImage,
  onSelectImage,
  isWishlisted,
  onToggleWishlist,
}) => {
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const uniqueImages = Array.from(new Set(allImages));

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {uniqueImages.length > 1 && (
        <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {uniqueImages.map((img, i) => (
            <button
              key={i}
              onClick={() => onSelectImage(img)}
              className={`w-16 h-20 rounded-xl overflow-hidden border transition-all bg-[#FAF4E8] flex-shrink-0 ${
                selectedImage === img ? 'border-[#C99A2E] ring-2 ring-[#C99A2E]/30' : 'border-[#D8C5A8] opacity-70 hover:opacity-100'
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

      <div className="flex-1 order-1 md:order-2 bg-[#FAF4E8] rounded-2xl border border-[#D8C5A8] overflow-hidden aspect-[4/5] relative">
        <img 
          src={selectedImage} 
          alt={product.title} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover"
        />
        {product.original_price && product.original_price > product.price && (
          <span className="absolute top-4 left-4 bg-[#C99A2E] text-[#FFFDF8] text-xs font-extrabold px-3 py-1 rounded-md shadow-md">
            SAVE ₹{(product.original_price - product.price).toLocaleString('en-IN')}
          </span>
        )}

        {onToggleWishlist && (
          <button
            onClick={() => onToggleWishlist(product)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FAF4E8]/80 backdrop-blur-md border border-[#D8C5A8] flex items-center justify-center text-[#6B5842] hover:text-[#C99A2E] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`w-5 h-5 ${isWishlisted ? 'text-[#C99A2E]' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

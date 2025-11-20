import React from 'react';
import { Product } from '../types';
import { StarIcon, ShoppingCartIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      <div 
        className="relative h-64 p-6 flex items-center justify-center bg-white cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.title} 
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
           <span className="text-white text-sm font-medium bg-black/70 px-3 py-1 rounded-full">Quick View</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <h3 
          className="text-gray-900 font-medium text-sm leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-indigo-600"
          onClick={() => onViewDetails(product)}
        >
          {product.title}
        </h3>
        
        <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <StarIcon 
                        key={i} 
                        filled={i < Math.round(product.rating.rate)} 
                        className="w-4 h-4"
                    />
                ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.rating.count})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
            }}
            className="bg-gray-100 text-gray-800 hover:bg-indigo-600 hover:text-white p-2 rounded-full transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCartIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CloseIcon, StarIcon, SparklesIcon, ShoppingCartIcon } from './Icons';
import { generateProductInsight } from '../services/geminiService';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    if (product) {
      setAiInsight(null); // Reset on new product
    }
  }, [product]);

  const handleGenerateInsight = async () => {
    if (!product) return;
    setLoadingInsight(true);
    const text = await generateProductInsight(product);
    setAiInsight(text);
    setLoadingInsight(false);
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10"
        >
          <CloseIcon className="w-5 h-5 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
          {/* Image Section */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8">
            <img 
              src={product.image} 
              alt={product.title} 
              className="max-h-80 object-contain mix-blend-multiply"
            />
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded-full w-fit mb-4">
              {product.category}
            </span>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.title}</h2>
            
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} filled={i < Math.round(product.rating.rate)} className="w-5 h-5" />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</div>

            <div className="prose prose-sm text-gray-600 mb-6">
              <p>{product.description}</p>
            </div>

            {/* AI Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                  <SparklesIcon className="w-5 h-5" />
                  <span>Lumina AI Insight</span>
                </div>
                {!aiInsight && !loadingInsight && (
                  <button 
                    onClick={handleGenerateInsight}
                    className="text-xs bg-white border border-indigo-200 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-600 hover:text-white transition-colors shadow-sm"
                  >
                    Reveal Analysis
                  </button>
                )}
              </div>
              
              {loadingInsight && (
                 <div className="animate-pulse flex space-x-4">
                   <div className="flex-1 space-y-2 py-1">
                     <div className="h-2 bg-indigo-200 rounded w-3/4"></div>
                     <div className="h-2 bg-indigo-200 rounded"></div>
                   </div>
                 </div>
              )}
              
              {aiInsight && (
                <p className="text-indigo-900 text-sm italic leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                  "{aiInsight}"
                </p>
              )}
            </div>

            <div className="mt-auto flex gap-4">
              <button 
                onClick={() => {
                    onAddToCart(product);
                    onClose();
                }}
                className="flex-1 bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CloseIcon, StarIcon, SparklesIcon, ShoppingCartIcon } from './Icons';
import { generateProductInsight } from '../services/geminiService';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedOptions?: Record<string, string>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setAiInsight(null); // Reset on new product
      
      // Select default options
      const defaults: Record<string, string> = {};
      if (product.attributes) {
        product.attributes.forEach(attr => {
          if (attr.options && attr.options.length > 0) {
            defaults[attr.name] = attr.options[0].value;
          }
        });
      }
      setSelectedOptions(defaults);
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
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300 text-slate-800">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200 transition-all z-20"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Image Section */}
          <div className="flex items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner min-h-[250px]">
            <img 
              src={product.image} 
              alt={product.title} 
              className="max-h-60 object-contain mix-blend-multiply"
            />
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-start text-xs font-bold text-[#750a27] uppercase tracking-wider mb-2 font-mono">
              <span>{product.category.replace('-', ' ')}</span>
              {product.brand && <span className="text-slate-400">{product.brand}</span>}
            </div>
            
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-2.5">{product.title}</h2>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-[#ffd002] mr-2.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    filled={i < Math.round(product.rating.rate)} 
                    className={`w-3.5 h-3.5 ${i < Math.round(product.rating.rate) ? 'fill-[#ffd002] text-[#ffd002]' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-semibold font-mono">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-black text-slate-900 font-mono">${product.price.toFixed(2)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-slate-400 line-through font-mono">${product.original_price.toFixed(2)}</span>
              )}
            </div>

            <div className="text-slate-500 text-xs leading-relaxed mb-5 font-light line-clamp-3">
              <p>{product.short_description ? product.short_description.replace(/<[^>]+>/g, '') : product.description.replace(/<[^>]+>/g, '')}</p>
            </div>

            {/* Option attributes inside Quick Look */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="space-y-3.5 mb-5 border-t border-slate-50 pt-4">
                {product.attributes.map(attr => (
                  <div key={attr.id} className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {attr.name.replace('::', '').trim()}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {attr.options.map(opt => {
                        const isSelected = selectedOptions[attr.name] === opt.value;
                        const isColor = attr.type === 'Color' || attr.name.toLowerCase().includes('color');
                        
                        if (isColor && opt.color_code) {
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setSelectedOptions(prev => ({ ...prev, [attr.name]: opt.value }))}
                              className={`w-6.5 h-6.5 rounded-full border transition-all flex items-center justify-center relative
                                ${isSelected ? 'border-[#750a27] scale-110 ring-2 ring-[#750a27]/20' : 'border-slate-200 hover:scale-105'}
                              `}
                              style={{ backgroundColor: opt.color_code }}
                              title={opt.value}
                            >
                              {isSelected && (
                                <span className="w-2 h-2 bg-white rounded-full mix-blend-difference"></span>
                              )}
                            </button>
                          );
                        }
                        
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [attr.name]: opt.value }))}
                            className={`px-3 py-1.5 text-[10px] font-bold border rounded-lg transition-all
                              ${isSelected 
                                ? 'bg-[#750a27] border-transparent text-white' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                            `}
                          >
                            {opt.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Insight section */}
            <div className="bg-[#750a27]/5 rounded-2xl p-4 mb-5 border border-[#750a27]/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-[#750a27] font-bold text-xs tracking-wide">
                  <SparklesIcon className="w-4 h-4 text-[#750a27] animate-pulse" />
                  <span>AI Insight hook</span>
                </div>
                {!aiInsight && !loadingInsight && (
                  <button 
                    onClick={handleGenerateInsight}
                    className="text-[10px] bg-white border border-[#750a27]/20 text-[#750a27] px-3 py-1 rounded-xl hover:bg-[#750a27] hover:text-white transition-all font-semibold"
                  >
                    Reveal Hook
                  </button>
                )}
              </div>
              
              {loadingInsight && (
                 <div className="animate-pulse flex space-x-4 mt-1">
                   <div className="flex-1 space-y-2">
                     <div className="h-1.5 bg-[#750a27]/10 rounded w-2/3"></div>
                   </div>
                 </div>
              )}
              
              {aiInsight && (
                <p className="text-slate-600 text-xs italic leading-relaxed pl-2 border-l border-[#750a27] mt-1 font-medium">
                  "{aiInsight}"
                </p>
              )}
            </div>

            <div className="mt-auto pt-2 flex gap-3">
              <button 
                onClick={() => {
                  onAddToCart(product, selectedOptions);
                  onClose();
                }}
                className="flex-1 bg-[#750a27] hover:bg-slate-900 text-white font-bold py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:scale-[1.01]"
              >
                <ShoppingCartIcon className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
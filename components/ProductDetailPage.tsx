import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { StarIcon, SparklesIcon, ShoppingCartIcon, CreditCardIcon, ArrowLeftIcon } from './Icons';
import { generateProductInsight } from '../services/geminiService';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  productId: string;
  products: Product[];
  categories: Array<{ id: string; name: string; handle: string }>;
  onAddToCart: (product: Product, selectedOptions?: Record<string, string>) => void;
  onBuyNow: (product: Product, selectedOptions?: Record<string, string>) => void;
  onNavigateToCategory: (catId: string, catName: string) => void;
  onNavigateHome: () => void;
  onViewProduct: (prodId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  products,
  categories,
  onAddToCart,
  onBuyNow,
  onNavigateToCategory,
  onNavigateHome,
  onViewProduct
}) => {
  const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Reset page state on product change
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setActiveTab('desc');
      setAiInsight(null);
      setSelectedImage(product.image || (product.images && product.images[0]) || '');
      
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

  // Find related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  // Get category info
  const categoryInfo = useMemo(() => {
    if (!product) return null;
    return categories.find(c => c.id === product.category_id) || {
      id: product.category_id,
      name: product.category.replace('-', ' '),
      handle: product.category
    };
  }, [categories, product]);

  const handleGenerateInsight = async () => {
    if (!product) return;
    setLoadingInsight(true);
    const text = await generateProductInsight(product);
    setAiInsight(text);
    setLoadingInsight(false);
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-800">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={onNavigateHome} className="bg-[#750a27] text-white px-6 py-2.5 rounded-xl font-bold">
          Go Back Home
        </button>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const uniqueImages = Array.from(new Set(allImages));

  // Specs generation based on product type
  const specs = useMemo(() => {
    const defaultSpecs = [
      { name: 'Model Number', value: `SP-${product.id.slice(-4).toUpperCase()}` },
      { name: 'Brand', value: product.brand || 'Spark' },
      { name: 'Warranty', value: '1 Year Manufacturer Warranty' },
      { name: 'Package Contents', value: '1 Main Unit, User Manual, Charging Cable (if applicable)' }
    ];
    
    if (product.category.includes('mobile') || product.id === '5731947000000146951') {
      return [
        ...defaultSpecs,
        { name: 'Display', value: '6.8-inch AMOLED, 120Hz Refresh Rate' },
        { name: 'Processor', value: 'Octa-Core High Performance Chip' },
        { name: 'Operating System', value: 'Android 14 / Custom OS' },
        { name: 'Battery', value: '5000 mAh with Fast Charging support' }
      ];
    } else if (product.category.includes('laptop')) {
      return [
        ...defaultSpecs,
        { name: 'Processor', value: 'Intel Core i7 / AMD Ryzen 7' },
        { name: 'RAM Memory', value: '16GB LPDDR5' },
        { name: 'Storage', value: '512GB NVMe SSD' },
        { name: 'Graphics', value: 'Integrated High Definition GPU' }
      ];
    } else if (product.category.includes('timepiece') || product.category_id === '5731947000000147069') {
      return [
        ...defaultSpecs,
        { name: 'Water Resistance', value: '5 ATM (50 meters)' },
        { name: 'Sensor Type', value: 'Heart Rate, SpO2, Sleep Tracking, Pedometer' },
        { name: 'Case Material', value: 'Titanium / Stainless Steel alloy' },
        { name: 'Battery Life', value: 'Up to 7 Days average usage' }
      ];
    }
    return defaultSpecs;
  }, [product]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800 font-sans">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <span className="cursor-pointer hover:text-[#750a27]" onClick={onNavigateHome}>Home</span>
        <span className="text-slate-300">/</span>
        <span 
          className="cursor-pointer hover:text-[#750a27]" 
          onClick={() => categoryInfo && onNavigateToCategory(categoryInfo.id, categoryInfo.name)}
        >
          {categoryInfo?.name || 'Category'}
        </span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800 font-bold truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails list */}
          {uniqueImages.length > 1 && (
            <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {uniqueImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border flex items-center justify-center p-1 bg-slate-50 flex-shrink-0 transition-all
                    ${selectedImage === img ? 'border-[#750a27] ring-1 ring-[#750a27]' : 'border-slate-200 hover:border-slate-300'}
                  `}
                >
                  <img src={img} alt={`${product.title} thumb ${i}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Main Preview */}
          <div className="flex-1 order-1 md:order-2 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center p-8 aspect-square relative shadow-inner">
            {product.original_price && product.original_price > product.price && (
              <span className="absolute top-4 left-4 bg-[#e81816] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                Sale
              </span>
            )}
            <img src={selectedImage} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105" />
          </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="flex flex-col justify-center">
          {product.brand && (
            <span className="text-xs font-bold text-[#750a27] uppercase tracking-widest mb-2 font-mono">
              {product.brand}
            </span>
          )}
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-[#750a27] font-mono">
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-lg text-slate-400 line-through font-mono">
                  ${product.original_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Save ${(product.original_price - product.price).toLocaleString()}
                </span>
              </>
            )}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
            {product.short_description ? product.short_description.replace(/<[^>]+>/g, '') : product.description.replace(/<[^>]+>/g, '')}
          </p>

          {/* Options */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="space-y-5 mb-8 border-t border-b border-slate-100 py-6">
              {product.attributes.map(attr => (
                <div key={attr.id} className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {attr.name.replace('::', '').trim()}
                  </span>
                  
                  <div className="flex flex-wrap gap-2">
                    {attr.options.map(opt => {
                      const isSelected = selectedOptions[attr.name] === opt.value;
                      const isColor = attr.type === 'Color' || attr.name.toLowerCase().includes('color');
                      
                      if (isColor && opt.color_code) {
                        return (
                          <button
                            key={opt.id}
                            title={opt.value}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [attr.name]: opt.value }))}
                            className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center relative
                              ${isSelected ? 'border-[#750a27] scale-110 shadow-md ring-2 ring-[#750a27]/20' : 'border-slate-200 hover:scale-105'}
                            `}
                            style={{ backgroundColor: opt.color_code }}
                          >
                            {isSelected && (
                              <span className="w-2.5 h-2.5 bg-white rounded-full mix-blend-difference shadow-sm"></span>
                            )}
                          </button>
                        );
                      }
                      
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [attr.name]: opt.value }))}
                          className={`px-4 py-2 text-xs font-bold border rounded-xl transition-all
                            ${isSelected 
                              ? 'bg-[#750a27] border-transparent text-white shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}
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

          {/* Quantity and Checkout buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden w-fit">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-4 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all font-bold text-sm"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-3 text-sm font-bold w-10 text-center text-slate-800 font-mono">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-4 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all font-bold text-sm"
              >
                +
              </button>
            </div>

            <div className="flex-1 flex gap-3">
              <button 
                onClick={() => onAddToCart(product, selectedOptions)}
                className="flex-1 bg-slate-900 hover:bg-[#750a27] text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01]"
              >
                <ShoppingCartIcon className="w-4 h-4" />
                Add to Cart
              </button>
              <button 
                onClick={() => onBuyNow(product, selectedOptions)}
                className="flex-1 bg-[#ffd002] hover:bg-[#e6bb01] text-slate-950 font-black py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01]"
              >
                <CreditCardIcon className="w-4 h-4" />
                Buy Now
              </button>
            </div>
          </div>

          {/* Lumina AI Insight Card */}
          <div className="bg-[#750a27]/5 rounded-2xl p-5 border border-[#750a27]/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#750a27] font-bold text-sm tracking-wide">
                <SparklesIcon className="w-5 h-5 text-[#750a27] animate-pulse" />
                <span>Lumina AI Insight</span>
              </div>
              {!aiInsight && !loadingInsight && (
                <button 
                  onClick={handleGenerateInsight}
                  className="text-xs bg-white border border-[#750a27]/20 text-[#750a27] px-4 py-1.5 rounded-xl hover:bg-[#750a27] hover:text-white transition-all duration-300 shadow-sm font-semibold"
                >
                  Reveal Analysis
                </button>
              )}
            </div>
            
            {loadingInsight && (
               <div className="animate-pulse flex space-x-4 mt-2">
                 <div className="flex-1 space-y-2 py-1">
                   <div className="h-2 bg-[#750a27]/10 rounded w-3/4"></div>
                   <div className="h-2 bg-[#750a27]/10 rounded"></div>
                 </div>
               </div>
            )}
            
            {aiInsight && (
              <p className="text-slate-700 text-sm italic leading-relaxed pl-2.5 border-l-2 border-[#750a27] mt-2 font-medium">
                "{aiInsight}"
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Tabs Section */}
      <div className="border-t border-slate-100 pt-10 mb-16">
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap pb-0">
          <button
            onClick={() => setActiveTab('desc')}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all mr-6
              ${activeTab === 'desc' ? 'border-[#750a27] text-[#750a27]' : 'border-transparent text-slate-500 hover:text-slate-800'}
            `}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all mr-6
              ${activeTab === 'specs' ? 'border-[#750a27] text-[#750a27]' : 'border-transparent text-slate-500 hover:text-slate-800'}
            `}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all mr-6
              ${activeTab === 'shipping' ? 'border-[#750a27] text-[#750a27]' : 'border-transparent text-slate-500 hover:text-slate-800'}
            `}
          >
            Shipping & Returns
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-sm text-slate-600 leading-relaxed font-light">
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-4xl">
              <div 
                dangerouslySetInnerHTML={{ __html: product.description }} 
                className="prose prose-slate max-w-none text-slate-600 font-light"
              />
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl border border-slate-200/60 rounded-2xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {specs.map((s, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-5 font-bold text-slate-700 bg-slate-50/50 w-1/3 text-xs border-r border-slate-100">{s.name}</td>
                      <td className="py-3 px-5 text-slate-600 text-xs font-medium">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-bold text-slate-800 mb-2">Fast and Secure Shipping</h3>
              <p>We provide nationwide delivery inside 3-5 business days. Expedited shipping is available at checkout. All electronic items are packed in shock-absorbent protective boxes to prevent in-transit damage.</p>
              <h3 className="font-bold text-slate-800 mt-4 mb-2">Easy 10-Day Returns</h3>
              <p>Not fully satisfied with your purchase? You can request a return within 10 days of product delivery. Returns must be unused, in original packaging, and contain all manuals and accessories.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-100 pt-12">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={() => onViewProduct(p.id)}
                onAddToCart={(prod) => onAddToCart(prod)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

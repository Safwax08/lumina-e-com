import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../../../types';
import { ProductCard } from '../ProductCard';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductTabs } from './ProductTabs';

export interface ProductDetailPageProps {
  productId: string;
  products: Product[];
  categories: Array<{ id: string; name: string; handle: string }>;
  onAddToCart: (product: Product, selectedOptions?: Record<string, string>) => void;
  onBuyNow: (product: Product, selectedOptions?: Record<string, string>) => void;
  onNavigateToCategory: (catId: string, catName: string) => void;
  onNavigateHome: () => void;
  onViewProduct: (prodId: string) => void;
  wishlist?: string[];
  onToggleWishlist?: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  products,
  categories,
  onAddToCart,
  onBuyNow,
  onNavigateToCategory,
  onNavigateHome,
  onViewProduct,
  wishlist = [],
  onToggleWishlist
}) => {
  const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);

  const [selectedColor, setSelectedColor] = useState<string>('Default');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setActiveTab('desc');
      setSelectedImage(product.image || (product.images && product.images[0]) || '');
      
      const colorAttr = product.attributes?.find(a => a.name.toLowerCase().includes('color'));
      if (colorAttr && colorAttr.options.length > 0) {
        setSelectedColor(colorAttr.options[0].value);
      }
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#3B2A1A]">
        <h2 className="text-2xl font-bold font-serif mb-4">Product Not Found</h2>
        <button onClick={onNavigateHome} className="bg-[#C99A2E] text-[#FFFDF8] px-6 py-2.5 rounded-xl font-bold text-xs uppercase shadow-md">
          Return to Home
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="min-h-screen bg-[#F3E6D0] text-[#3B2A1A] py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#6B5842] font-mono mb-8 overflow-x-auto whitespace-nowrap pb-1">
          <span className="cursor-pointer hover:text-[#C99A2E] transition-colors" onClick={onNavigateHome}>Home</span>
          <span>/</span>
          <span 
            className="cursor-pointer hover:text-[#C99A2E] transition-colors uppercase" 
            onClick={() => onNavigateToCategory(product.category, product.category.toUpperCase())}
          >
            {product.category}
          </span>
          <span>/</span>
          <span className="text-[#3B2A1A] font-semibold truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery
            product={product}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
            isWishlisted={isWishlisted}
            onToggleWishlist={onToggleWishlist}
          />

          <ProductInfo
            product={product}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        </div>

        {/* Specifications & Description Tabs */}
        <ProductTabs
          product={product}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#D8C5A8] pt-12">
            <h2 className="text-2xl font-serif font-bold text-[#3B2A1A] mb-8">
              Complete The Look
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onViewDetails={() => onViewProduct(p.id)}
                  onAddToCart={(prod) => onAddToCart(prod)}
                  isWishlisted={wishlist.includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

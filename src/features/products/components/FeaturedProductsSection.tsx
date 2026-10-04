import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../../types';
import { ProductCard } from './ProductCard';
import { staggerContainer } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface FeaturedProductsSectionProps {
  products: Product[];
  wishlist: string[];
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onNavigateAll: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  wishlist,
  onViewDetails,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  onNavigateAll,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#D8C5A8] font-sans">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C99A2E] font-bold">CURATED SELECTION</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B2A1A] mt-1">
            Featured Products
          </h2>
        </div>
        <button
          onClick={onNavigateAll}
          className="text-xs font-bold text-[#C99A2E] hover:text-[#A87918] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <span>View All</span>
          <span>→</span>
        </button>
      </div>

      <motion.div 
        variants={prefersReducedMotion ? undefined : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
      >
        {products.slice(0, 5).map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            isWishlisted={wishlist.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </motion.div>
    </section>
  );
};

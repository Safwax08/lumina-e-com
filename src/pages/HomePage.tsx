import React from 'react';
import { Product } from '../types';
import { Hero, CategoryNavSection, CollectionBannersSection, BenefitsSection, PromoBannerSection } from '../features/home';
import { FeaturedProductsSection, NewArrivalsSection } from '../features/products';

interface HomePageProps {
  products: Product[];
  wishlist: string[];
  heroSlides: Array<{
    tag: string;
    title: string;
    highlight: string;
    subtext: string;
    buttonText: string;
    scriptText: string;
    categoryId: string;
    categoryName: string;
    imageUrl: string;
  }>;
  onNavigateCategory: (id: string, name: string) => void;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  wishlist,
  heroSlides,
  onNavigateCategory,
  onViewDetails,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      {/* 1. Hero Carousel */}
      <Hero 
        slides={heroSlides} 
        onNavigateCategory={onNavigateCategory} 
      />

      {/* 2. Category Navigation Circles */}
      <CategoryNavSection 
        onNavigateCategory={onNavigateCategory} 
      />

      {/* 3. Collection Split Banners */}
      <CollectionBannersSection 
        onNavigateCategory={onNavigateCategory} 
      />

      {/* 4. Featured Products Grid */}
      <FeaturedProductsSection
        products={products}
        wishlist={wishlist}
        onViewDetails={onViewDetails}
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
        onToggleWishlist={onToggleWishlist}
        onNavigateAll={() => onNavigateCategory('all', 'Featured Products')}
      />

      {/* 5. Benefits Bar */}
      <BenefitsSection />

      {/* 6. New Arrivals Grid */}
      <NewArrivalsSection
        products={products}
        wishlist={wishlist}
        onViewDetails={onViewDetails}
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
        onToggleWishlist={onToggleWishlist}
        onNavigateAll={() => onNavigateCategory('cat-shirts', 'New Arrivals')}
      />

      {/* 7. Promotional Discount Banner */}
      <PromoBannerSection
        onNavigateSale={() => onNavigateCategory('all', 'Special Discount Sale')}
      />
    </div>
  );
};

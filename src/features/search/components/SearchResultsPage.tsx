import React from 'react';
import { Product } from '../../../types';
import { ProductCard } from '../../products/components/ProductCard';

interface SearchResultsPageProps {
  query: string;
  searchProducts: Product[];
  wishlist: string[];
  onNavigateHome: () => void;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  query,
  searchProducts,
  wishlist,
  onNavigateHome,
  onViewDetails,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in font-sans">
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={onNavigateHome} 
          className="p-2 bg-[#FAF4E8] border border-[#D8C5A8] rounded-xl hover:border-[#C99A2E] text-[#6B5842] hover:text-[#3B2A1A] transition-colors"
        >
          ← Back Home
        </button>
        <h1 className="text-2xl font-bold font-serif text-[#3B2A1A]">
          Search Results for "{query}"
        </h1>
      </div>

      {searchProducts.length === 0 ? (
        <div className="bg-[#FAF4E8] border border-[#D8C5A8] rounded-2xl p-16 text-center text-[#6B5842]">
          <p className="text-sm font-light mb-4">No menswear products found matching your search.</p>
          <button 
            onClick={onNavigateHome} 
            className="px-6 py-2.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] text-xs font-bold uppercase rounded-lg shadow-md transition-colors"
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchProducts.map(product => (
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
        </div>
      )}
    </div>
  );
};

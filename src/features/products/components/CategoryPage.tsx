import React, { useState, useMemo } from 'react';
import { Product, SortOption } from '../../../types';
import { ProductCard } from './ProductCard';

interface CategoryPageProps {
  categoryName: string;
  categoryId: string;
  products: Product[];
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, color?: string) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onBackToHome: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryName,
  categoryId,
  products,
  onViewDetails,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist,
  onBackToHome
}) => {
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.DEFAULT);
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  // Filter products by category & price
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchCat = categoryId === 'all' || p.category.toLowerCase() === categoryId.toLowerCase();
      const matchPrice = p.price <= maxPrice;
      return matchCat && matchPrice;
    });

    if (sortOption === SortOption.PRICE_LOW_HIGH) {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === SortOption.PRICE_HIGH_LOW) {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === SortOption.RATING) {
      result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    }

    return result;
  }, [products, categoryId, maxPrice, sortOption]);

  return (
    <div className="min-h-screen bg-[#F3E6D0] text-[#3B2A1A] pb-20 pt-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6B5842] font-mono mb-6">
          <button onClick={onBackToHome} className="hover:text-[#C99A2E] transition-colors">Home</button>
          <span>/</span>
          <span className="text-[#3B2A1A] font-semibold uppercase">{categoryName}</span>
        </div>

        {/* Page Banner Header */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#FAF4E8] via-[#FFFDF8] to-[#FAF4E8] border border-[#D8C5A8] p-8 md:p-12 mb-10 shadow-xl">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C99A2E] font-bold">URBAN MAN COLLECTION</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#3B2A1A] mt-2 mb-3">
              {categoryName}
            </h1>
            <p className="text-sm text-[#6B5842] leading-relaxed font-light">
              Explore our curated selection of modern menswear in Warm Beige and Mustard Gold, tailored with premium fabrics and impeccable craftsmanship.
            </p>
          </div>
        </div>

        {/* Filters and Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FAF4E8] border border-[#D8C5A8] rounded-xl p-4 mb-8 shadow-md">
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#6B5842] uppercase tracking-wider">
              Showing <span className="text-[#C99A2E] font-bold">{filteredProducts.length}</span> items
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
            {/* Price Filter */}
            <div className="flex items-center gap-2 text-xs text-[#6B5842]">
              <span>Max Price:</span>
              <span className="font-mono text-[#C99A2E] font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-[#C99A2E] w-24 cursor-pointer"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B5842] font-mono">Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-[#FFFDF8] border border-[#D8C5A8] text-[#3B2A1A] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C99A2E] font-sans"
              >
                <option value={SortOption.DEFAULT}>Featured</option>
                <option value={SortOption.PRICE_LOW_HIGH}>Price: Low to High</option>
                <option value={SortOption.PRICE_HIGH_LOW}>Price: High to Low</option>
                <option value={SortOption.RATING}>Customer Rating</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#FAF4E8] rounded-2xl border border-[#D8C5A8]">
            <h3 className="text-lg font-bold text-[#3B2A1A] mb-2">No products found</h3>
            <p className="text-xs text-[#6B5842] mb-6">Try adjusting your filters or price slider.</p>
            <button
              onClick={() => setMaxPrice(10000)}
              className="px-6 py-2.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] text-xs font-bold uppercase rounded-lg shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
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
    </div>
  );
};

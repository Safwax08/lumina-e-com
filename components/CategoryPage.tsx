import React, { useState, useMemo, useEffect } from 'react';
import { Product, SortOption } from '../types';
import { ProductCard } from './ProductCard';
import { StarIcon } from './Icons';

interface CategoryPageProps {
  categoryId: string;
  categoryName: string;
  products: Product[];
  categories: Array<{ id: string; name: string; handle: string; description?: string }>;
  onAddToCart: (product: Product) => void;
  onViewProduct: (productId: string) => void;
  onNavigateHome: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryId,
  categoryName,
  products,
  categories,
  onAddToCart,
  onViewProduct,
  onNavigateHome
}) => {
  // Category Info
  const categoryInfo = useMemo(() => {
    return categories.find(c => c.id === categoryId) || {
      id: categoryId,
      name: categoryName,
      description: "Explore our premium selection of quality items."
    };
  }, [categories, categoryId, categoryName]);

  // Products belonging to this category
  // If categoryId is 'all' or similar collection handle, we might list all products.
  const categoryProducts = useMemo(() => {
    if (categoryId === 'all-products' || categoryId === 'all') {
      return products;
    }
    return products.filter(p => p.category_id === categoryId);
  }, [products, categoryId]);

  // Filters State
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.DEFAULT);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [minPrice, setMinPrice] = useState<number>(0);

  // Available brands in this category's products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    categoryProducts.forEach(p => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, [categoryProducts]);

  // Price boundaries
  const priceLimits = useMemo(() => {
    if (categoryProducts.length === 0) return { min: 0, max: 200000 };
    const prices = categoryProducts.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [categoryProducts]);

  // Reset filters when category changes
  useEffect(() => {
    setSortBy(SortOption.DEFAULT);
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(priceLimits.max);
  }, [categoryId, priceLimits]);

  // Filter handlers
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brand && selectedBrands.includes(p.brand));
    }

    // Price filter
    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Sorting
    switch (sortBy) {
      case SortOption.PRICE_LOW_HIGH:
        result.sort((a, b) => a.price - b.price);
        break;
      case SortOption.PRICE_HIGH_LOW:
        result.sort((a, b) => b.price - a.price);
        break;
      case SortOption.RATING:
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // Default sorting, no operation
        break;
    }

    return result;
  }, [categoryProducts, selectedBrands, minPrice, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800 font-sans">
      
      {/* Page Header Banner */}
      <div className="bg-[#750a27] text-white rounded-3xl p-8 sm:p-12 mb-10 relative overflow-hidden shadow-md">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ffd002] mb-3 block">
            Store Category
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-none">
            {categoryInfo.name}
          </h1>
          {categoryInfo.description && (
            <p className="text-sm sm:text-base text-red-100 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: categoryInfo.description }} />
          )}
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <span className="cursor-pointer hover:text-[#750a27]" onClick={onNavigateHome}>Home</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800 font-bold">{categoryInfo.name}</span>
      </nav>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          
          {/* Sorting */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-300 transition-all cursor-pointer"
            >
              <option value={SortOption.DEFAULT}>Default Listing</option>
              <option value={SortOption.PRICE_LOW_HIGH}>Price: Low to High</option>
              <option value={SortOption.PRICE_HIGH_LOW}>Price: High to Low</option>
              <option value={SortOption.RATING}>Customer Rating</option>
            </select>
          </div>

          {/* Brands Filter */}
          {availableBrands.length > 0 && (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Filter by Brand</h3>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="rounded border-slate-300 text-[#750a27] focus:ring-[#750a27]/30 w-4 h-4 cursor-pointer"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          {priceLimits.max > priceLimits.min && (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min={priceLimits.min}
                  max={priceLimits.max}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#750a27] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono">
                  <span>${priceLimits.min}</span>
                  <span>Max: ${maxPrice}</span>
                </div>
              </div>
            </div>
          )}

        </aside>

        {/* Product Grid */}
        <main className="flex-grow">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center text-slate-500 shadow-sm">
              <p className="font-light mb-4">No products match your active filters.</p>
              <button 
                onClick={() => {
                  setSelectedBrands([]);
                  setMinPrice(0);
                  setMaxPrice(priceLimits.max);
                  setSortBy(SortOption.DEFAULT);
                }}
                className="text-xs font-bold text-[#750a27] hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="cursor-pointer">
                  <ProductCard
                    product={product}
                    onViewDetails={() => onViewProduct(product.id)}
                    onAddToCart={onAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};

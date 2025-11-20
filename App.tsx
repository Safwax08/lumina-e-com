import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, SortOption } from './types';
import { fetchProducts, fetchCategories } from './services/api';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AiAssistant } from './components/AiAssistant';
import { Loader } from './components/Loader';
import { ShoppingCartIcon, SparklesIcon, BoxIcon } from './components/Icons';
import { OrdersModal } from './components/OrdersModal';

function App() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Simulate persistence using LocalStorage
    const saved = localStorage.getItem('lumina_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.DEFAULT);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Effects
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  // Handlers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

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
    }

    return result;
  }, [products, selectedCategory, sortBy, searchQuery]);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
                    <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Lumina
                </span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsOrdersOpen(true)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <BoxIcon className="w-5 h-5" />
                <span className="hidden sm:inline">My Orders</span>
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-indigo-900 py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Shop Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">AI</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
            Experience the future of e-commerce. Curated products, intelligent insights, and a personal shopping assistant powered by Gemini.
          </p>
          <div className="flex justify-center max-w-md mx-auto">
             <input 
                type="text" 
                placeholder="Search for products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full shadow-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
             />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
                All
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value={SortOption.DEFAULT}>Sort by: Recommended</option>
            <option value={SortOption.PRICE_LOW_HIGH}>Price: Low to High</option>
            <option value={SortOption.PRICE_HIGH_LOW}>Price: High to Low</option>
            <option value={SortOption.RATING}>Top Rated</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <Loader />
        ) : (
          <>
             {filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">No products found.</p>
                    <button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}} className="mt-2 text-indigo-600 hover:underline">Clear filters</button>
                </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {filteredProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onViewDetails={setSelectedProduct}
                        onAddToCart={addToCart}
                    />
                    ))}
                </div>
             )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
            <p className="mb-2">&copy; 2024 Lumina Store. All rights reserved.</p>
            <p className="text-sm">Powered by Google Gemini • FakeStoreAPI</p>
        </div>
      </footer>

      {/* Overlays */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      />

      <OrdersModal 
        isOpen={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
      />

      <AiAssistant products={products} />
    </div>
  );
}

export default App;
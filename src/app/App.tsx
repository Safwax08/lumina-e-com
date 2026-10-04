import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Product } from '../types';

// Context Providers & Hooks
import { useProducts } from '../context/ProductContext';
import { useCartContext } from '../context/CartContext';
import { useWishlistContext } from '../context/WishlistContext';
import { useAuthContext } from '../context/AuthContext';

// Navigation & Common Components
import { Header, Footer, MobileBottomNav } from '../features/navigation';
import { ProductModal } from '../features/products';
import { CartDrawer } from '../features/cart';
import { WishlistDrawer } from '../features/wishlist';
import { OrdersModal } from '../features/orders';
import { CustomerLogin } from '../features/auth';
import { AiAssistant } from '../features/ai-assistant';
import { Loader } from '../components/common/Loader';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Code-split pages for bundle optimization & resilience
const HomePage = lazy(() => import('../pages').then(m => ({ default: m.HomePage })));
const CategoryPage = lazy(() => import('../pages').then(m => ({ default: m.CategoryPage })));
const ProductDetailPage = lazy(() => import('../pages').then(m => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('../pages').then(m => ({ default: m.CheckoutPage })));
const SearchResultsPage = lazy(() => import('../pages').then(m => ({ default: m.SearchResultsPage })));
const AdminPage = lazy(() => import('../pages').then(m => ({ default: m.AdminPage })));
const NotFoundPage = lazy(() => import('../pages').then(m => ({ default: m.NotFoundPage })));

// Category Route Component Wrapper
function CategoryRoute({ setSelectedProduct }: { setSelectedProduct: (p: Product | null) => void }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories } = useProducts();
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();

  const categoryId = id || 'all';
  const catObj = categories.find(c => c.handle === categoryId || c.id === categoryId);
  const categoryName = catObj ? catObj.name : categoryId.toUpperCase();

  return (
    <CategoryPage
      categoryId={categoryId}
      categoryName={categoryName}
      products={products}
      onViewDetails={(prod) => navigate(`/product/${prod.id}`)}
      onAddToCart={(product, color) => addToCart(product, color ? { Color: color } : undefined)}
      onQuickView={setSelectedProduct}
      wishlist={wishlist}
      onToggleWishlist={toggleWishlist}
      onBackToHome={() => navigate('/')}
    />
  );
}

// Product Detail Route Component Wrapper
function ProductDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories } = useProducts();
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();

  const buyNow = (product: Product, options?: Record<string, string>, qty?: number) => {
    addToCart(product, options, qty);
    navigate('/checkout');
  };

  return (
    <ProductDetailPage
      productId={id || ''}
      products={products}
      categories={categories}
      onAddToCart={addToCart}
      onBuyNow={buyNow}
      onNavigateToCategory={(catId) => navigate(`/category/${catId}`)}
      onNavigateHome={() => navigate('/')}
      onViewProduct={(prodId) => navigate(`/product/${prodId}`)}
      wishlist={wishlist}
      onToggleWishlist={toggleWishlist}
    />
  );
}

// Search Route Component Wrapper
function SearchRoute({ setSelectedProduct }: { setSelectedProduct: (p: Product | null) => void }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();
  const query = searchParams.get('q') || '';

  const searchProducts = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return products.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <SearchResultsPage
      query={query}
      searchProducts={searchProducts}
      wishlist={wishlist}
      onNavigateHome={() => navigate('/')}
      onViewDetails={(prod) => navigate(`/product/${prod.id}`)}
      onAddToCart={addToCart}
      onQuickView={setSelectedProduct}
      onToggleWishlist={toggleWishlist}
    />
  );
}

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Context State
  const { products, loading } = useProducts();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartItemCount 
  } = useCartContext();
  const { 
    wishlist, 
    wishlistProducts, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    toggleWishlist, 
    removeFromWishlist 
  } = useWishlistContext();
  const { customer, loginCustomer } = useAuthContext();

  // Local UI Modal State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hash route compatibility for #admin
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
      navigate('/admin');
    }
  }, [navigate]);

  // Handlers
  const buyNow = (product: Product, options?: Record<string, string>, qty?: number) => {
    addToCart(product, options, qty);
    navigate('/checkout');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  // Derive view type for navigation highlighting
  const currentViewType = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/category')) return 'category';
    if (path.startsWith('/product')) return 'product';
    if (path === '/checkout') return 'checkout';
    if (path === '/search') return 'search';
    if (path.startsWith('/admin')) return 'admin';
    return 'home';
  }, [location.pathname]);

  // Hero Carousel Data
  const heroSlides = useMemo(() => [
    {
      tag: "NEW COLLECTION",
      title: "MODERN STYLE",
      highlight: "FOR REAL MEN",
      subtext: "Premium menswear for every occasion. Timeless. Versatile. Confident.",
      buttonText: "Shop Now",
      scriptText: "Style Beyond Trends",
      categoryId: "cat-jackets",
      categoryName: "Jackets & Outerwear",
      imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80"
    },
    {
      tag: "SARTORIAL ELEGANCE",
      title: "TAILORED SUITS",
      highlight: "ITALIAN CRAFT",
      subtext: "Precision cut two-piece suits and blazer coats for boardroom commanding presence.",
      buttonText: "Explore Suits",
      scriptText: "Pure Sophistication",
      categoryId: "cat-suits",
      categoryName: "Suits & Blazers",
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80"
    },
    {
      tag: "EVERYDAY LUXURY",
      title: "RAW DENIM",
      highlight: "& ESSENTIAL TEES",
      subtext: "13.5oz Japanese selvedge denim matched with 100% Pima cotton staples.",
      buttonText: "Discover Essentials",
      scriptText: "Crafted to Last",
      categoryId: "cat-jeans",
      categoryName: "Selvedge Jeans",
      imageUrl: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=80"
    }
  ], []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F3E6D0] text-[#3B2A1A] font-sans relative flex flex-col justify-between selection:bg-[#C99A2E] selection:text-[#FFFDF8]">
        
        {/* Navigation Header */}
        <Header
          currentViewType={currentViewType}
          cartItemCount={cartItemCount}
          wishlistCount={wishlist.length}
          isCustomerLoggedIn={customer.isLoggedIn}
          isSearchOpen={isSearchOpen}
          searchQuery={searchQuery}
          mobileMenuOpen={mobileMenuOpen}
          onSetSearchQuery={setSearchQuery}
          onSetIsSearchOpen={setIsSearchOpen}
          onSetMobileMenuOpen={setMobileMenuOpen}
          onSearchSubmit={handleSearchSubmit}
          onNavigateHome={() => navigate('/')}
          onNavigateCategory={(id) => navigate(`/category/${id}`)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenCustomerLogin={() => setIsCustomerLoginOpen(true)}
          onOpenOrders={() => setIsOrdersOpen(true)}
        />

        {/* Main Views Rendered via React Router with Suspense */}
        <main className="flex-grow">
          {loading ? (
            <div className="py-32 flex justify-center"><Loader /></div>
          ) : (
            <Suspense fallback={<div className="py-32 flex justify-center"><Loader /></div>}>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <HomePage
                      products={products}
                      wishlist={wishlist}
                      heroSlides={heroSlides}
                      onNavigateCategory={(id) => navigate(`/category/${id}`)}
                      onViewDetails={(prod) => navigate(`/product/${prod.id}`)}
                      onAddToCart={addToCart}
                      onQuickView={setSelectedProduct}
                      onToggleWishlist={toggleWishlist}
                    />
                  } 
                />

                <Route 
                  path="/category/:id" 
                  element={<CategoryRoute setSelectedProduct={setSelectedProduct} />} 
                />

                <Route 
                  path="/product/:id" 
                  element={<ProductDetailRoute />} 
                />

                <Route 
                  path="/checkout" 
                  element={
                    <CheckoutPage
                      items={cart}
                      onClearCart={clearCart}
                      onNavigateHome={() => navigate('/')}
                    />
                  } 
                />

                <Route 
                  path="/search" 
                  element={<SearchRoute setSelectedProduct={setSelectedProduct} />} 
                />

                <Route 
                  path="/admin/*" 
                  element={
                    <AdminPage
                      onNavigateHome={() => navigate('/')}
                    />
                  } 
                />

                <Route 
                  path="*" 
                  element={<NotFoundPage />} 
                />
              </Routes>
            </Suspense>
          )}
        </main>

        {/* Footer */}
        <Footer 
          onNavigateCategory={(id) => navigate(`/category/${id}`)} 
        />

        {/* Mobile Fixed Bottom Navigation Bar */}
        <MobileBottomNav
          currentViewType={currentViewType}
          wishlistCount={wishlist.length}
          onNavigateHome={() => navigate('/')}
          onNavigateShop={() => navigate('/category/all')}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenAccount={() => setIsCustomerLoginOpen(true)}
        />

        {/* Floating AI Assistant */}
        <AiAssistant products={products} />

        {/* Overlays & Drawers */}
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onBuyNow={buyNow}
          isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
          onToggleWishlist={toggleWishlist}
        />
        
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={() => {
            setIsCartOpen(false);
            navigate('/checkout');
          }}
        />

        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistProducts={wishlistProducts}
          onRemoveFromWishlist={removeFromWishlist}
          onAddToCart={addToCart}
          onViewDetails={(prod) => setSelectedProduct(prod)}
        />

        <OrdersModal 
          isOpen={isOrdersOpen} 
          onClose={() => setIsOrdersOpen(false)} 
        />

        <CustomerLogin 
          isOpen={isCustomerLoginOpen}
          onClose={() => setIsCustomerLoginOpen(false)}
          onLogin={(email) => {
            loginCustomer(email);
            setIsCustomerLoginOpen(false);
          }}
        />

      </div>
    </ErrorBoundary>
  );
}

export default App;

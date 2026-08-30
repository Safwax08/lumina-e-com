import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, SortOption } from './types';
import { fetchProducts } from './services/api';
import { productsData } from './services/productsData';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AiAssistant } from './components/AiAssistant';
import { Loader } from './components/Loader';
import { ShoppingCartIcon, SparklesIcon, BoxIcon } from './components/Icons';
import { OrdersModal } from './components/OrdersModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CategoryPage } from './components/CategoryPage';
import { CheckoutPage } from './components/CheckoutPage';
import { generateImageFromGemini } from './services/geminiService';
import { AdminLayout } from './components/admin/AdminLayout';
import { CustomerLogin } from './components/CustomerLogin';

type View = 
  | { type: 'home' }
  | { type: 'category'; id: string; name: string }
  | { type: 'product'; id: string }
  | { type: 'checkout' }
  | { type: 'admin' }
  | { type: 'search'; query: string };

function App() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lumina_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<View>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      return { type: 'admin' };
    }
    return { type: 'home' };
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);

  // Gemini AI generated images state
  const [geminiImages, setGeminiImages] = useState<Record<string, string>>(() => {
    const images: Record<string, string> = {};
    [
      'deals', 'watches', 'mobiles', 'laptops', 'headphones', 'speakers', 'smartwatches',
      'blog1', 'blog2', 'blog3'
    ].forEach(key => {
      const val = localStorage.getItem(`gemini_img_${key}`) || '';
      if (val && val.startsWith('data:image/') && !val.includes('undefined') && !val.includes('null') && val.length > 50) {
        images[key] = val;
      } else {
        images[key] = '';
        localStorage.removeItem(`gemini_img_${key}`);
      }
    });
    return images;
  });

  useEffect(() => {
    const prompts: Record<string, { prompt: string; wide?: boolean }> = {
      deals: { prompt: 'Minimalist high-quality studio photo of various e-commerce gadgets and gifts with a red ribbon, white background, professional catalog photography' },
      watches: { prompt: 'Minimalist high-quality studio photo of a steel luxury analog wristwatch, white background, professional catalog photography' },
      mobiles: { prompt: 'Minimalist high-quality studio photo of a modern sleek smartphone showing a beautiful home screen, white background, professional catalog photography' },
      laptops: { prompt: 'Minimalist high-quality studio photo of a thin premium open notebook laptop, white background, professional catalog photography' },
      headphones: { prompt: 'Minimalist high-quality studio photo of high-end wireless over-ear headphones, white background, professional catalog photography' },
      speakers: { prompt: 'Minimalist high-quality studio photo of a cylindrical modern smart speaker, white background, professional catalog photography' },
      smartwatches: { prompt: 'Minimalist high-quality studio photo of a sleek digital smartwatch fitness tracker, white background, professional catalog photography' },
      blog1: { prompt: 'High-tech design concept art representing smartwatches and fitness wearable technology, modern abstract neon styling', wide: true },
      blog2: { prompt: 'High-tech abstract illustration of active noise cancellation audio waves and premium wireless earbuds, modern styling', wide: true },
      blog3: { prompt: 'Modern high-tech laptop computer internals and motherboard components showing CPU chip, technical photography', wide: true }
    };

    const generateMissingImages = async () => {
      for (const [key, config] of Object.entries(prompts)) {
        if (!geminiImages[key]) {
          try {
            const dataUrl = await generateImageFromGemini(config.prompt, config.wide);
            if (dataUrl) {
              localStorage.setItem(`gemini_img_${key}`, dataUrl);
              setGeminiImages(prev => ({ ...prev, [key]: dataUrl }));
            }
          } catch (e) {
            console.error(`Failed to dynamically generate ${key}:`, e);
          }
        }
      }
    };

    generateMissingImages();
  }, [geminiImages]);

  const getImgSrc = (key: string, fallback: string) => {
    const img = geminiImages[key];
    if (!img || img === 'undefined' || img === 'null' || img.length < 50) {
      return fallback;
    }
    return img;
  };

  // Categories list
  const categoriesList = useMemo(() => {
    return productsData.categories;
  }, []);

  // Effects
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const prods = await fetchProducts();
      setProducts(prods);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (products.length === 0 || currentView.type !== 'home') return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, [products, currentView.type]);

  // Handlers
  const addToCart = (product: Product, selectedOptions?: Record<string, string>) => {
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

  const buyNow = (product: Product, selectedOptions?: Record<string, string>) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCurrentView({ type: 'checkout' });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView({ type: 'search', query: searchQuery });
    }
  };

  // Search Results Filter
  const searchProducts = useMemo(() => {
    if (currentView.type !== 'search') return [];
    const q = currentView.query.toLowerCase();
    return products.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    );
  }, [products, currentView]);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Slider Slides Content
  const slidesContent = [
    {
      title: "CHOOSE SPARK CHOOSE SAVINGS!",
      highlight: "UPTO 20% OFF",
      subtext: "Athletic Running Shoes | Crafted for Speed, Style & Comfort",
      buttonText: "Shop Now",
      categoryId: "5731947000000147069",
      categoryName: "Precision Timepieces",
      imageUrl: "https://raw.githubusercontent.com/adrianhajdin/nike_landing_page/main/src/assets/images/big-shoe1.png"
    },
    {
      title: "GO ANYWHERE, PRO EVERYTHING!",
      highlight: "STARTING AT JUST $9,999",
      subtext: "Laptops & Mobiles Launch | Save Up To 60% On High-Performance Hardware",
      buttonText: "Explore Mobiles",
      categoryId: "5731947000000673008",
      categoryName: "Mobiles",
      imageUrl: "https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-02.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com"
    },
    {
      title: "BASSWAVE PREMIUM AUDIO SYSTEM",
      highlight: "UPTO 20% OFF",
      subtext: "Premium Earphones & Speakers | Designed for Ultimate Noise Cancellation & Rich Base",
      buttonText: "Discover Audio",
      categoryId: "5731947000000099005",
      categoryName: "Festival Deals",
      imageUrl: "https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-03.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com"
    }
  ];

  const activeSlideContent = slidesContent[currentSlide] || slidesContent[0];

  if (currentView.type === 'admin') {
    return <AdminLayout onNavigateHome={() => {
      window.history.pushState(null, '', '/');
      setCurrentView({ type: 'home' });
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans relative flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <div>
        
        {/* Topbar */}
        <div className="hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            
            {/* Contacts Info */}
            <div className="flex items-center gap-6">
              <a href="mailto:Info@yourcompanyname.com" className="flex items-center gap-2 hover:text-[#ffd002] transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 512 513.5">
                  <path d="M48 128h16 384 16v16 256 16h-16-384-16v-16-256-16z m69 32l139 92.5 139-92.5h-278z m-37 14v210h352v-210l-167 111.5-9 5.5-9-5.5z"/>
                </svg>
                <span>Info@yourcompanyname.com</span>
              </a>
              <a href="tel:123-456-7890" className="flex items-center gap-2 hover:text-[#ffd002] transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 512 513.5">
                  <path d="M138.5 48c8.376 0 16.6562 3.0244 23.5 8.5l1 0.5 0.5 0.5 64 66 1.5 1.5-0.5 0.5c14.1738 13.2119 13.9678 35.5322 0.5 49l-32 32c4.9189 11.2773 18.3291 40.0186 44.5 65 26.3584 25.1602 53.9316 39.4668 65.5 45l31.5-31.5 0.5-0.5c13.2793-13.2793 36.7207-13.2793 50 0l0.5 1 65 65c13.2793 13.2793 13.2793 36.2207 0 49.5l-49.5 49.5-0.5 0.5-0.5 0.5c-15.0107 12.8672-36.04 17.4863-55.5 11h-0.5c-37.5488-14.6934-113.509-48.0088-181.5-116-67.7266-67.7266-102.448-142.659-116-181.5-0.0352-0.0996 0.0342-0.4004 0-0.5-6.7031-18.4336-1.915-39.7383 13.5-54l-0.5-0.5 50-51.5 0.5-0.5 1-0.5c6.8438-5.4756 15.124-8.5 23.5-8.5z m0 32c-1.1719 0-2.3438 0.5752-3.5 1.5l-48.5 49.5-0.5 0.5-0.5 0.5c-5.6738 4.8633-7.4394 14.4932-5 21 12.1201 34.8467 45.1992 106.699 108.5 170 62.7842 62.7842 133.224 93.7607 169.5 108 9.3408 3.1133 17.1113 1.833 24.5-4.5l49-49c2.7207-2.7207 2.7207-1.7793 0-4.5l-65.5-65.5c-2.7207-2.7207-2.2793-2.7207-5 0l-40 40-7.5 7.5-10-4.5s-43.8311-18.5518-81-52.5l-3.5-3c-38.5947-36.8408-57-86-57-86l-3.5-10 7.5-7 40-40c1.9658-1.9658 0.874-3.6006 1-3.5l-0.5-0.5-1-1-64-65.5c-1.1563-0.9248-2.3281-1.5-3.5-1.5z"/>
                </svg>
                <span>123-456-7890</span>
              </a>
            </div>

            {/* Social profiles */}
            <div className="flex gap-4 items-center">
              <a href="http://facebook.com" target="_blank" className="hover:text-[#ffd002] transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-8.84h-2.97v-3.437h2.97v-2.53c0-2.943 1.797-4.546 4.42-4.546 1.257 0 2.336.093 2.651.135v3.072h-1.817c-1.428 0-1.705.678-1.705 1.674v2.195h3.402l-.443 3.437h-2.959v8.84h6.084c.731 0 1.325-.593 1.325-1.324v-21.35c0-.732-.594-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="http://instagram.com" target="_blank" className="hover:text-[#ffd002] transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="http://youtube.com" target="_blank" className="hover:text-[#ffd002] transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.525 3.545 12 3.545 12 3.545s-7.525 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.028 0 12 0 12s0 3.972.502 5.837a3.002 3.002 0 0 0 2.11 2.107C4.475 20.455 12 20.455 12 20.455s7.525 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.972 24 12 24 12s0-3.972-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>

          </div>
        </div>

        {/* Navbar */}
        <nav className="sticky top-0 z-30 bg-white border-b border-slate-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              
              {/* Logo */}
              <div className="flex items-center cursor-pointer" onClick={() => setCurrentView({ type: 'home' })}>
                <img 
                  src="https://sparkgadgets-demo.zohoecommerce.com/template/6a455a978655499d9fbf1931a100f68e/images/logo.png"
                  alt="Spark"
                  className="h-10 w-auto object-contain"
                />
              </div>

              {/* Navigation Menu (Zoho copy) */}
              <div className="hidden lg:flex items-center gap-8">
                
                <button 
                  onClick={() => setCurrentView({ type: 'home' })}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors
                    ${currentView.type === 'home' ? 'text-[#750a27]' : 'text-slate-600 hover:text-[#750a27]'}
                  `}
                >
                  Home
                </button>

                {/* Dropdown 1: Festival Deals */}
                <div className="relative group py-2">
                  <button 
                    onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                    className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors
                      ${currentView.type === 'category' && (currentView as any).id === '5731947000000099005' ? 'text-[#750a27]' : 'text-slate-600 hover:text-[#750a27]'}
                    `}
                  >
                    <span>Festival Deals</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {/* Dropdown contents */}
                  <div className="absolute top-full left-0 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 mt-0 transform translate-y-1">
                    <button 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000673008', name: 'Mobiles' })}
                      className="w-full text-left px-5 py-2 text-xs font-bold text-slate-600 hover:text-[#750a27] hover:bg-slate-50 transition-colors"
                    >
                      Mobiles
                    </button>
                    <button 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000673020', name: 'Laptops' })}
                      className="w-full text-left px-5 py-2 text-xs font-bold text-slate-600 hover:text-[#750a27] hover:bg-slate-50 transition-colors"
                    >
                      Laptops
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentView({ type: 'category', id: '5731947000000147069', name: 'Precision Timepieces' })}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors
                    ${currentView.type === 'category' && (currentView as any).id === '5731947000000147069' ? 'text-[#750a27]' : 'text-slate-600 hover:text-[#750a27]'}
                  `}
                >
                  Precision Timepieces
                </button>

                {/* Categories Mega Menu */}
                <div className="relative group py-2">
                  <button 
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#750a27] transition-colors"
                  >
                    <span>Categories</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  
                  {/* Mega Menu container */}
                  <div className="absolute top-full -left-64 bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-8 w-[800px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 mt-0 transform translate-y-2 grid grid-cols-4 gap-6 z-40">
                    <div>
                      <h4 className="text-xs font-black uppercase text-[#750a27] tracking-wider mb-3.5 border-b border-slate-100 pb-2">Mobiles</h4>
                      <div className="flex flex-col gap-2.5 text-xs font-bold text-slate-500">
                        <button onClick={() => setCurrentView({ type: 'product', id: '5731947000000146951' })} className="hover:text-[#750a27] text-left">Samsung S23 Ultra</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673008', name: 'Mobiles' })} className="hover:text-[#750a27] text-left">Apple iPhone</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673008', name: 'Mobiles' })} className="hover:text-[#750a27] text-left">Mi Phones</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673008', name: 'Mobiles' })} className="hover:text-[#750a27] text-left">Realme</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673008', name: 'Mobiles' })} className="hover:text-[#750a27] text-left">Oppo & Vivo</button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-[#750a27] tracking-wider mb-3.5 border-b border-slate-100 pb-2">Speakers</h4>
                      <div className="flex flex-col gap-2.5 text-xs font-bold text-slate-500">
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Speakers' })} className="hover:text-[#750a27] text-left">Home Audio Speakers</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Speakers' })} className="hover:text-[#750a27] text-left">Soundbars</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Speakers' })} className="hover:text-[#750a27] text-left">Home Theatres</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Speakers' })} className="hover:text-[#750a27] text-left">Bluetooth Speakers</button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-[#750a27] tracking-wider mb-3.5 border-b border-slate-100 pb-2">Accessories</h4>
                      <div className="flex flex-col gap-2.5 text-xs font-bold text-slate-500">
                        <button onClick={() => setCurrentView({ type: 'product', id: '5731947000000146017' })} className="hover:text-[#750a27] text-left">AeroPods X2</button>
                        <button onClick={() => setCurrentView({ type: 'product', id: '5731947000000092005' })} className="hover:text-[#750a27] text-left">KlearTone</button>
                        <button onClick={() => setCurrentView({ type: 'product', id: '5731947000000092156' })} className="hover:text-[#750a27] text-left">TravelBoost</button>
                        <button onClick={() => setCurrentView({ type: 'product', id: '5731947000000092214' })} className="hover:text-[#750a27] text-left">StellarFit</button>
                        <button onClick={() => setCurrentView({ type: 'product', id: '5731947000000092266' })} className="hover:text-[#750a27] text-left">TurboCharge</button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-[#750a27] tracking-wider mb-3.5 border-b border-slate-100 pb-2">Computers</h4>
                      <div className="flex flex-col gap-2.5 text-xs font-bold text-slate-500">
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673020', name: 'Laptops' })} className="hover:text-[#750a27] text-left">External Hard Disks</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673020', name: 'Laptops' })} className="hover:text-[#750a27] text-left">Pendrives</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673020', name: 'Laptops' })} className="hover:text-[#750a27] text-left">Laptop Bags</button>
                        <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673020', name: 'Laptops' })} className="hover:text-[#750a27] text-left">Laptop Skins & Decals</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Controls */}
              <div className="flex items-center gap-5 flex-shrink-0">
                
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-52 md:w-60 flex-shrink-0">
                  <input 
                    type="text" 
                    placeholder="Search Products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner font-light"
                  />
                  <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#750a27] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
                    </svg>
                  </button>
                </form>

                {/* Wishlist */}
                <button 
                  onClick={() => alert("Wishlist feature coming soon!")}
                  className="relative p-1 text-slate-600 hover:text-[#750a27] transition-colors cursor-pointer hidden sm:block flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5.5 h-5.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>

                {/* Cart Icon */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-1 flex-shrink-0 text-slate-600 hover:text-[#750a27] transition-colors"
                >
                  <ShoppingCartIcon className="w-5.5 h-5.5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[8.5px] font-black text-white bg-[#750a27] rounded-full shadow-md">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Orders / Profile Icon */}
                {!isCustomerLoggedIn ? (
                  <button 
                    onClick={() => setIsCustomerLoginOpen(true)}
                    className="ml-2 px-3 py-1.5 bg-[#750a27] text-white text-xs font-bold rounded-lg hover:bg-[#8f0d30] transition-colors shadow-sm flex-shrink-0 uppercase tracking-wider"
                    title="Customer Login"
                  >
                    Login
                  </button>
                ) : (
                  <div className="relative group">
                    <button 
                      onClick={() => setIsOrdersOpen(true)}
                      className="relative p-1 text-slate-600 hover:text-[#750a27] transition-colors cursor-pointer flex-shrink-0"
                      title="View Profile / Orders"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5.5 h-5.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <button 
                        onClick={() => setIsCustomerLoggedIn(false)}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}



              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content Area based on current view */}
      <div className="flex-grow">
        
        {loading ? (
          <div className="py-32"><Loader /></div>
        ) : (
          <>
            {/* 1. HOME VIEW */}
            {currentView.type === 'home' && (
              <div className="animate-in fade-in duration-300">
                
                {/* Hero Carousel Section */}
                <div className="bg-[#110103] relative overflow-hidden py-20 sm:py-28 border-b border-white/5">
                  {/* Background overlay image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 z-0 scale-105 transition-all duration-700 pointer-events-none"
                    style={{ backgroundImage: `url(https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-26.webp)` }}
                  />
                  
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    
                    {/* Left text */}
                    <div className="flex-1 text-left max-w-xl text-white">
                      <span className="block text-[#ffd002] font-semibold text-sm uppercase tracking-widest mb-3">
                        Featured Offer
                      </span>
                      <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6">
                        {activeSlideContent.title.replace("SAVINGS!", "")}
                        <span className="block text-[#ffd002] mt-2">
                          {activeSlideContent.highlight}
                        </span>
                      </h1>
                      <p className="text-red-100 text-sm sm:text-base font-light mb-8 max-w-md leading-relaxed">
                        {activeSlideContent.subtext}
                      </p>
                      
                      <button 
                        onClick={() => setCurrentView({ type: 'category', id: activeSlideContent.categoryId, name: activeSlideContent.categoryName })}
                        className="bg-[#ffd002] hover:bg-[#e6bb01] text-slate-950 font-black px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[#ffd002]/25 active:scale-95"
                      >
                        {activeSlideContent.buttonText}
                      </button>
                    </div>

                    {/* Product Image section with animation */}
                    <div className="flex-1 flex justify-center items-center relative h-64 md:h-80 w-full max-w-sm md:max-w-md my-4 md:my-0">
                      {/* Glow backdrop */}
                      <div className="absolute inset-0 bg-[#ffd002]/5 rounded-full blur-3xl opacity-40 pointer-events-none" />
                      
                      <img
                        key={currentSlide}
                        src={activeSlideContent.imageUrl}
                        alt={activeSlideContent.title}
                        className="max-h-full max-w-full object-contain relative z-10 animate-product-slider drop-shadow-[0_20px_35px_rgba(255,208,2,0.15)]"
                      />
                    </div>

                    {/* Right carousel dot controls */}
                    <div className="flex flex-row md:flex-col gap-3 justify-center md:items-end flex-shrink-0">
                      {slidesContent.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`w-3.5 h-3.5 rounded-full transition-all border border-white/20
                            ${currentSlide === idx ? 'bg-[#ffd002] scale-110 shadow-lg' : 'bg-white/20 hover:bg-white/40'}
                          `}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                  </div>
                </div>

                {/* Shop by Categories Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-10 text-left">
                    Shop by Categories
                  </h2>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-6 justify-items-center">
                    
                    {/* Category 1: Festival Deals */}
                    <div 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                      className="group flex flex-col items-center cursor-pointer max-w-[100px]"
                    >
                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center p-3 relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-slate-100 group-hover:-translate-y-1.5 group-hover:border-[#ffd002] group-hover:bg-white">
                        {/* Glow background effect */}
                        <div className="absolute inset-0 bg-[#ffd002]/0 group-hover:bg-[#ffd002]/5 transition-colors duration-500" />
                        <img 
                          src="https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-06.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com" 
                          alt="Festival Deals" 
                          className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6" 
                        />
                      </div>
                      <span className="mt-3 text-xs font-bold text-slate-700 group-hover:text-[#750a27] transition-colors leading-tight text-center tracking-tight">
                        Festival Deals
                      </span>
                    </div>

                    {/* Category 2: Precision Timepieces */}
                    <div 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000147069', name: 'Precision Timepieces' })}
                      className="group flex flex-col items-center cursor-pointer max-w-[100px]"
                    >
                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center p-3 relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-slate-100 group-hover:-translate-y-1.5 group-hover:border-[#ffd002] group-hover:bg-white">
                        <div className="absolute inset-0 bg-[#ffd002]/0 group-hover:bg-[#ffd002]/5 transition-colors duration-500" />
                        <img 
                          src="https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-05.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com" 
                          alt="Precision Timepieces" 
                          className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6" 
                        />
                      </div>
                      <span className="mt-3 text-xs font-bold text-slate-700 group-hover:text-[#750a27] transition-colors leading-tight text-center tracking-tight">
                        Precision Timepieces
                      </span>
                    </div>

                    {/* Category 3: Mobiles */}
                    <div 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000673008', name: 'Mobiles' })}
                      className="group flex flex-col items-center cursor-pointer max-w-[100px]"
                    >
                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center p-3 relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-slate-100 group-hover:-translate-y-1.5 group-hover:border-[#ffd002] group-hover:bg-white">
                        <div className="absolute inset-0 bg-[#ffd002]/0 group-hover:bg-[#ffd002]/5 transition-colors duration-500" />
                        <img 
                          src="https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-02.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com" 
                          alt="Mobiles" 
                          className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6" 
                        />
                      </div>
                      <span className="mt-3 text-xs font-bold text-slate-700 group-hover:text-[#750a27] transition-colors leading-tight text-center tracking-tight">
                        Mobiles
                      </span>
                    </div>

                    {/* Category 4: Laptops */}
                    <div 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000673020', name: 'Laptops' })}
                      className="group flex flex-col items-center cursor-pointer max-w-[100px]"
                    >
                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center p-3 relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-slate-100 group-hover:-translate-y-1.5 group-hover:border-[#ffd002] group-hover:bg-white">
                        <div className="absolute inset-0 bg-[#ffd002]/0 group-hover:bg-[#ffd002]/5 transition-colors duration-500" />
                        <img 
                          src="https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-08.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com" 
                          alt="Laptops" 
                          className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6" 
                        />
                      </div>
                      <span className="mt-3 text-xs font-bold text-slate-700 group-hover:text-[#750a27] transition-colors leading-tight text-center tracking-tight">
                        Laptops
                      </span>
                    </div>

                    {/* Category 5: Headphones */}
                    <div 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                      className="group flex flex-col items-center cursor-pointer max-w-[100px]"
                    >
                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center p-3 relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-slate-100 group-hover:-translate-y-1.5 group-hover:border-[#ffd002] group-hover:bg-white">
                        <div className="absolute inset-0 bg-[#ffd002]/0 group-hover:bg-[#ffd002]/5 transition-colors duration-500" />
                        <img 
                          src="https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-06.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com" 
                          alt="Headphones" 
                          className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6" 
                        />
                      </div>
                      <span className="mt-3 text-xs font-bold text-slate-700 group-hover:text-[#750a27] transition-colors leading-tight text-center tracking-tight">
                        Headphones
                      </span>
                    </div>

                    {/* Category 6: Speakers */}
                    <div 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                      className="group flex flex-col items-center cursor-pointer max-w-[100px]"
                    >
                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center p-3 relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-slate-100 group-hover:-translate-y-1.5 group-hover:border-[#ffd002] group-hover:bg-white">
                        <div className="absolute inset-0 bg-[#ffd002]/0 group-hover:bg-[#ffd002]/5 transition-colors duration-500" />
                        <img 
                          src="https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-10.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com" 
                          alt="Speakers" 
                          className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6" 
                        />
                      </div>
                      <span className="mt-3 text-xs font-bold text-slate-700 group-hover:text-[#750a27] transition-colors leading-tight text-center tracking-tight">
                        Speakers
                      </span>
                    </div>

                    {/* Category 7: Smart Watches */}
                    <div 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                      className="group flex flex-col items-center cursor-pointer max-w-[100px]"
                    >
                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center p-3 relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-slate-100 group-hover:-translate-y-1.5 group-hover:border-[#ffd002] group-hover:bg-white">
                        <div className="absolute inset-0 bg-[#ffd002]/0 group-hover:bg-[#ffd002]/5 transition-colors duration-500" />
                        <img 
                          src="https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-09.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com" 
                          alt="Smart Watches" 
                          className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6" 
                        />
                      </div>
                      <span className="mt-3 text-xs font-bold text-slate-700 group-hover:text-[#750a27] transition-colors leading-tight text-center tracking-tight">
                        Smart Watches
                      </span>
                    </div>

                  </div>
                </section>

                {/* Top Picks For You */}
                <section className="bg-slate-50 py-16 border-t border-b border-slate-100">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-left">
                      Top Picks For You
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {products.slice(0, 4).map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onViewDetails={(prod) => setCurrentView({ type: 'product', id: prod.id })}
                          onAddToCart={addToCart}
                          onQuickView={setSelectedProduct}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* Shop by Brand (Scrolling Marquee) */}
                <section className="py-12 bg-white border-b border-slate-100 overflow-hidden select-none">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 text-left">
                      Shop by Popular Brands
                    </h2>
                  </div>
                  
                  <div className="relative w-full flex overflow-x-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                    
                    <div className="animate-marquee flex whitespace-nowrap gap-8 items-center py-2">
                      {/* Original set of logos */}
                      {['Apple', 'Samsung', 'AeroTech', 'Sony', 'Bose', 'Logitech', 'Dell', 'HP'].map((brand, idx) => (
                        <div 
                          key={`b1-${idx}`}
                          onClick={() => {
                            setSearchQuery(brand);
                            setCurrentView({ type: 'search', query: brand });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl text-slate-400 font-bold uppercase tracking-wider text-xs cursor-pointer hover:border-[#ffd002] hover:text-[#750a27] hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                        >
                          {brand}
                        </div>
                      ))}
                      {/* Duplicate set for infinite loop */}
                      {['Apple', 'Samsung', 'AeroTech', 'Sony', 'Bose', 'Logitech', 'Dell', 'HP'].map((brand, idx) => (
                        <div 
                          key={`b2-${idx}`}
                          onClick={() => {
                            setSearchQuery(brand);
                            setCurrentView({ type: 'search', query: brand });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl text-slate-400 font-bold uppercase tracking-wider text-xs cursor-pointer hover:border-[#ffd002] hover:text-[#750a27] hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                        >
                          {brand}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Go Anywhere Banner (Promo) */}
                <section className="bg-black text-white relative overflow-hidden py-28 border-b border-white/5 group cursor-pointer">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 z-0 transition-transform duration-1000 ease-out scale-100 group-hover:scale-105 pointer-events-none"
                    style={{ backgroundImage: `url(https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-16.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                  
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 max-w-lg text-left ml-0 mr-auto">
                    <span className="inline-block px-3 py-1 bg-[#ffd002] text-slate-950 font-black text-[9px] tracking-wider uppercase rounded-full mb-4">
                      Limited Time Offer
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-none mb-6">
                      Go Anywhere,<br />Pro Everything Starting At<br />​Just 9,999
                    </h2>
                    <p className="text-red-100 text-sm font-light leading-relaxed mb-8">
                      Save Up To 60% on our premium category collection of smartphones, tablets, watches, and notebooks. Experience true craftsmanship.
                    </p>
                    
                    <button 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                      className="bg-[#ffd002] hover:bg-[#e6bb01] text-slate-950 font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 group-hover:shadow-lg group-hover:shadow-[#ffd002]/20 flex items-center gap-1.5"
                    >
                      <span>Shop Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </section>

                {/* Latest Products section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Latest Products
                    </h2>
                    <button 
                      onClick={() => setCurrentView({ type: 'category', id: 'all-products', name: 'Top Picks For You' })}
                      className="text-xs font-bold text-[#750a27] hover:underline uppercase tracking-wider flex items-center gap-1"
                    >
                      <span>View All</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.slice(4, 12).map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={(prod) => setCurrentView({ type: 'product', id: prod.id })}
                        onAddToCart={addToCart}
                        onQuickView={setSelectedProduct}
                      />
                    ))}
                  </div>
                </section>

                {/* Side-by-Side Promo Banners */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Banner: Turn Down / Turn Up (Yellow Running Shoe) */}
                  <div className="bg-black text-white rounded-3xl relative overflow-hidden py-24 px-8 sm:px-12 group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 border border-white/5 min-h-[360px] flex flex-col justify-center text-left">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-35 z-0 transition-transform duration-1000 ease-out scale-100 group-hover:scale-105 pointer-events-none"
                      style={{ backgroundImage: `url(https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-17.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com)` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10" />
                    
                    <div className="relative z-20 max-w-sm">
                      <span className="text-[#ffd002] font-semibold text-xs uppercase tracking-widest block mb-2 font-mono">Turn Down</span>
                      <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-none mb-3">
                        The Chaos,
                      </h3>
                      <p className="text-red-100 text-xs sm:text-sm font-light leading-relaxed mb-6">
                        Turn Up The productivity. Experience high-end accessories built for extreme focus.
                      </p>
                      
                      <button 
                        onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                        className="w-fit bg-[#ffd002] hover:bg-[#e6bb01] text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 group-hover:shadow-lg group-hover:shadow-[#ffd002]/20 flex items-center gap-1.5"
                      >
                        <span>Shop Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Right Banner: Gaming on the go (Game Controller) */}
                  <div className="bg-black text-white rounded-3xl relative overflow-hidden py-24 px-8 sm:px-12 group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 border border-white/5 min-h-[360px] flex flex-col justify-center text-left">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-35 z-0 transition-transform duration-1000 ease-out scale-100 group-hover:scale-105 pointer-events-none"
                      style={{ backgroundImage: `url(https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-18.webp?storefront_domain=sparkgadgets-demo.zohoecommerce.com)` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10" />
                    
                    <div className="relative z-20 max-w-sm">
                      <span className="text-[#ffd002] font-semibold text-xs uppercase tracking-widest block mb-2 font-mono">Gaming on the go</span>
                      <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-none mb-3">
                        From Boarding gates<br />to Battlefields
                      </h3>
                      <p className="text-red-100 text-xs sm:text-sm font-light leading-relaxed mb-6">
                        Immerse yourself into professional gaming gear built for responsiveness and power.
                      </p>
                      
                      <button 
                        onClick={() => setCurrentView({ type: 'category', id: '5731947000000673020', name: 'Laptops' })}
                        className="w-fit bg-[#ffd002] hover:bg-[#e6bb01] text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 group-hover:shadow-lg group-hover:shadow-[#ffd002]/20 flex items-center gap-1.5"
                      >
                        <span>Shop Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                </section>

                {/* Promo Grid (3 Cards) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
                    <div>
                      <h3 className="text-[#750a27] font-bold text-sm uppercase tracking-wider mb-2">Mouse Accessories</h3>
                      <h4 className="text-lg font-black text-slate-950 mb-3 leading-tight">Up to 20% Discount</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed mb-6">
                        The Apple Mouse 2 is designed for those who seek a seamless experience with their quality. Perfect for daily workflows.
                      </p>
                    </div>
                    <button 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                      className="w-fit bg-slate-950 hover:bg-[#750a27] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300"
                    >
                      Shop Mouse
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
                    <div>
                      <h3 className="text-[#750a27] font-bold text-sm uppercase tracking-wider mb-2">Keyboards</h3>
                      <h4 className="text-lg font-black text-slate-950 mb-3 leading-tight">Up to 20% Discount</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed mb-6">
                        Experience ultra response and tactile feedback with the premium Magic Keyboard, designed for productivity and gaming alike.
                      </p>
                    </div>
                    <button 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                      className="w-fit bg-slate-950 hover:bg-[#750a27] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300"
                    >
                      Shop Keyboard
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
                    <div>
                      <h3 className="text-[#750a27] font-bold text-sm uppercase tracking-wider mb-2">Audio Gear</h3>
                      <h4 className="text-lg font-black text-slate-950 mb-3 leading-tight">Up to 20% Discount</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed mb-6">
                        Experience rich sounds, powerful base, and sweat-resistant designs with our premium catalog of headphones and earbuds.
                      </p>
                    </div>
                    <button 
                      onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })}
                      className="w-fit bg-slate-950 hover:bg-[#750a27] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300"
                    >
                      Shop Audio
                    </button>
                  </div>

                </section>

                {/* Blogs & Events Grid */}
                <section className="bg-slate-50 py-16 border-t border-slate-100">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-left">
                      Blogs &amp; Events
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                      
                      {/* Post 1 */}
                      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm group cursor-pointer">
                        <div className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                          <img src={getImgSrc('blog1', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80')} alt="Blog 1" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5">
                          <span className="text-[10px] font-bold text-[#750a27] uppercase tracking-wider font-mono">July 23, 2026</span>
                          <h4 className="text-sm font-bold text-slate-800 mt-2 mb-3 leading-snug group-hover:text-[#750a27] transition-colors">
                            The Evolution of Smart wearables: How deep sea tech has taken over smartwatches
                          </h4>
                          <p className="text-xs text-slate-500 font-light leading-relaxed">
                            Discover the cutting-edge sensor arrays and titanium case technology packing into our latest DeepSea Pro chronograph watches.
                          </p>
                        </div>
                      </div>

                      {/* Post 2 */}
                      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm group cursor-pointer">
                        <div className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                          <img src={getImgSrc('blog2', 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&auto=format&fit=crop&q=80')} alt="Blog 2" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5">
                          <span className="text-[10px] font-bold text-[#750a27] uppercase tracking-wider font-mono">July 18, 2026</span>
                          <h4 className="text-sm font-bold text-slate-800 mt-2 mb-3 leading-snug group-hover:text-[#750a27] transition-colors">
                            Choosing the right audio system: Active noise cancellation vs passive insulation
                          </h4>
                          <p className="text-xs text-slate-500 font-light leading-relaxed">
                            A breakdown of decibel ratings, frequency range response, and how AeroPods X2 achieves active acoustic cancellation.
                          </p>
                        </div>
                      </div>

                      {/* Post 3 */}
                      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm group cursor-pointer">
                        <div className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                          <img src={getImgSrc('blog3', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80')} alt="Blog 3" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5">
                          <span className="text-[10px] font-bold text-[#750a27] uppercase tracking-wider font-mono">July 15, 2026</span>
                          <h4 className="text-sm font-bold text-slate-800 mt-2 mb-3 leading-snug group-hover:text-[#750a27] transition-colors">
                            Performance notebooks: Is storage expansion critical for creative workflows?
                          </h4>
                          <p className="text-xs text-slate-500 font-light leading-relaxed">
                            Understanding read/write speeds of NVMe SSDs and how CorePro X expands memory access channels for video editors.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>

                {/* Newsletter Signup */}
                <section className="bg-black text-white py-16 text-center border-t border-white/5">
                  <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-2xl font-black mb-3 tracking-tight">Subscribe to our Mail alerts</h2>
                    <p className="text-slate-400 text-xs font-light tracking-wide uppercase mb-8">Stay updated with our latest releases and premium discounts</p>
                    
                    <form 
                       onSubmit={(e) => { e.preventDefault(); alert("Successfully subscribed!"); }}
                      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                    >
                      <input 
                        type="email" 
                        placeholder="Enter Your Email Address" 
                        required
                        className="flex-1 px-5 py-3 text-slate-800 bg-white rounded-xl focus:outline-none placeholder-slate-400 text-sm shadow-inner"
                      />
                      <button 
                        type="submit"
                        className="bg-[#ffd002] hover:bg-[#e6bb01] text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </section>

              </div>
            )}

            {/* 2. CATEGORY VIEW */}
            {currentView.type === 'category' && (
              <CategoryPage
                categoryId={currentView.id}
                categoryName={currentView.name}
                products={products}
                categories={categoriesList}
                onAddToCart={(prod) => addToCart(prod)}
                onViewProduct={(prodId) => setCurrentView({ type: 'product', id: prodId })}
                onNavigateHome={() => setCurrentView({ type: 'home' })}
              />
            )}

            {/* 3. PRODUCT DETAIL VIEW */}
            {currentView.type === 'product' && (
              <ProductDetailPage
                productId={currentView.id}
                products={products}
                categories={categoriesList}
                onAddToCart={addToCart}
                onBuyNow={buyNow}
                onNavigateToCategory={(catId, catName) => setCurrentView({ type: 'category', id: catId, name: catName })}
                onNavigateHome={() => setCurrentView({ type: 'home' })}
                onViewProduct={(prodId) => setCurrentView({ type: 'product', id: prodId })}
              />
            )}

            {/* 4. CHECKOUT VIEW */}
            {currentView.type === 'checkout' && (
              <CheckoutPage
                items={cart}
                onClearCart={clearCart}
                onNavigateHome={() => setCurrentView({ type: 'home' })}
                onOrderPlaced={(order) => {
                  // Can handle order status
                }}
              />
            )}

            {/* 5. SEARCH RESULTS VIEW */}
            {currentView.type === 'search' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-300 text-slate-800 font-sans">
                <div className="flex items-center gap-3 mb-8">
                  <button onClick={() => setCurrentView({ type: 'home' })} className="p-1.5 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-slate-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    Search Results for "{currentView.query}"
                  </h1>
                </div>

                {searchProducts.length === 0 ? (
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-16 text-center text-slate-500 shadow-sm">
                    <p className="font-light mb-4">No products found matching your query.</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setCurrentView({ type: 'home' }); }} 
                      className="text-xs font-bold text-[#750a27] hover:underline"
                    >
                      Go Back Home
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {searchProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={(prod) => setCurrentView({ type: 'product', id: prod.id })}
                        onAddToCart={(prod) => addToCart(prod)}
                        onQuickView={setSelectedProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-white text-slate-500 border-t border-slate-200/80 pt-16 pb-8 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            {/* Column 1: Brand */}
            <div className="col-span-2 space-y-4">
              <img 
                src="https://sparkgadgets-demo.zohoecommerce.com/template/6a455a978655499d9fbf1931a100f68e/images/logo.png"
                alt="Spark"
                className="h-9 w-auto brightness-0 object-contain"
              />
              <p className="text-xs text-slate-500 leading-relaxed font-light pr-8">
                Spark Gadgets Store brings you premium electronics, mobiles, notebooks, timepieces, and accessories. Engineered for luxury, accuracy, and longevity.
              </p>
              <div className="flex gap-3 text-slate-400">
                {/* Social profile SVG tags in footer */}
                <a href="http://facebook.com" target="_blank" className="hover:text-slate-800 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-8.84h-2.97v-3.437h2.97v-2.53c0-2.943 1.797-4.546 4.42-4.546 1.257 0 2.336.093 2.651.135v3.072h-1.817c-1.428 0-1.705.678-1.705 1.674v2.195h3.402l-.443 3.437h-2.959v8.84h6.084c.731 0 1.325-.593 1.325-1.324v-21.35c0-.732-.594-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="http://instagram.com" target="_blank" className="hover:text-slate-800 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="http://youtube.com" target="_blank" className="hover:text-slate-800 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.525 3.545 12 3.545 12 3.545s-7.525 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.028 0 12 0 12s0 3.972.502 5.837a3.002 3.002 0 0 0 2.11 2.107C4.475 20.455 12 20.455 12 20.455s7.525 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.972 24 12 24 12s0-3.972-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Products */}
            <div className="space-y-3 text-xs font-semibold">
              <h4 className="text-slate-900 text-sm font-black uppercase tracking-wider mb-2">Our Products</h4>
              <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673008', name: 'Mobiles' })} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Smartphones</button>
              <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000673020', name: 'Laptops' })} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Laptops</button>
              <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000147069', name: 'Precision Timepieces' })} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Watches</button>
              <button onClick={() => setCurrentView({ type: 'category', id: '5731947000000099005', name: 'Festival Deals' })} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Accessories</button>
            </div>

            {/* Column 3: About */}
            <div className="space-y-3 text-xs font-semibold">
              <h4 className="text-slate-900 text-sm font-black uppercase tracking-wider mb-2">About Spark</h4>
              <button onClick={() => alert("Spark is a demo e-commerce store built for showcasing premium tech.")} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Who We Are</button>
              <button onClick={() => alert("Join our team! Careers page coming soon.")} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Careers</button>
              <button onClick={() => alert("Check out our blogs section on the homepage!")} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">News &amp; Events</button>
              <button onClick={() => alert("Reach us at Info@yourcompanyname.com or 123-456-7890.")} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Contact Us</button>
            </div>

            {/* Column 4: Legal & Support */}
            <div className="space-y-3 text-xs font-semibold">
              <h4 className="text-slate-900 text-sm font-black uppercase tracking-wider mb-2">Legal &amp; Support</h4>
              <button onClick={() => alert("Privacy policy document")} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Privacy Policy</button>
              <button onClick={() => alert("Terms of service document")} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Terms &amp; Conditions</button>
              <button onClick={() => alert("Shipping & Delivery policy")} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Shipping Policy</button>
              <button onClick={() => alert("Return & refund policy")} className="block hover:text-slate-800 transition-colors text-left w-full text-slate-500">Refund Policy</button>
            </div>

          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} Spark Store. All rights reserved. Zoho Commerce Demo.
            </div>
            
            {/* Trust badge image */}
            <div className="h-7 opacity-50">
              <img 
                src="https://cdn1.zohoecommerce.com/stock_images/gadgets-zs200006/zcstock-images-25.svg?storefront_domain=sparkgadgets-demo.zohoecommerce.com" 
                alt="Payment Badges" 
                className="h-full w-auto object-contain brightness-0"
              />
            </div>
          </div>

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
        onCheckout={() => setCurrentView({ type: 'checkout' })}
      />

      <OrdersModal 
        isOpen={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
      />

      <AiAssistant products={products} />

      <CustomerLogin 
        isOpen={isCustomerLoginOpen}
        onClose={() => setIsCustomerLoginOpen(false)}
        onLogin={() => {
          setIsCustomerLoggedIn(true);
          setIsCustomerLoginOpen(false);
        }}
      />
    </div>
  );
}

export default App;
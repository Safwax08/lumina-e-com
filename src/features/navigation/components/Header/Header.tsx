import React from 'react';
import { DesktopHeaderNav } from './DesktopHeaderNav';
import { HeaderControls } from './HeaderControls';
import { MobileHeaderDrawer } from './MobileHeaderDrawer';

export interface HeaderProps {
  currentViewType: string;
  cartItemCount: number;
  wishlistCount: number;
  isCustomerLoggedIn: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  mobileMenuOpen: boolean;
  onSetSearchQuery: (query: string) => void;
  onSetIsSearchOpen: (open: boolean) => void;
  onSetMobileMenuOpen: (open: boolean) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (id: string, name: string) => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onOpenCustomerLogin: () => void;
  onOpenOrders: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentViewType,
  cartItemCount,
  wishlistCount,
  isCustomerLoggedIn,
  isSearchOpen,
  searchQuery,
  mobileMenuOpen,
  onSetSearchQuery,
  onSetIsSearchOpen,
  onSetMobileMenuOpen,
  onSearchSubmit,
  onNavigateHome,
  onNavigateCategory,
  onOpenWishlist,
  onOpenCart,
  onOpenCustomerLogin,
  onOpenOrders,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF4E8]/95 backdrop-blur-md border-b border-[#D8C5A8] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile Menu Icon & Brand Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onSetMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#6B5842] hover:text-[#C99A2E] transition-colors"
              aria-label="Open Mobile Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={onNavigateHome}
            >
              <div className="w-9 h-9 rounded-lg bg-[#FFFDF8] border border-[#D8C5A8] flex items-center justify-center text-[#C99A2E] font-serif font-bold text-xl group-hover:border-[#C99A2E] group-hover:bg-[#FAF4E8] transition-all shadow-md">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-lg sm:text-xl tracking-wider text-[#3B2A1A] uppercase leading-none group-hover:text-[#C99A2E] transition-colors">
                  URBAN MAN
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#6B5842] uppercase leading-tight">
                  Style Without Limits
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <DesktopHeaderNav 
            currentViewType={currentViewType}
            onNavigateHome={onNavigateHome}
            onNavigateCategory={onNavigateCategory}
          />

          {/* Controls */}
          <HeaderControls 
            cartItemCount={cartItemCount}
            wishlistCount={wishlistCount}
            isCustomerLoggedIn={isCustomerLoggedIn}
            isSearchOpen={isSearchOpen}
            searchQuery={searchQuery}
            onSetSearchQuery={onSetSearchQuery}
            onSetIsSearchOpen={onSetIsSearchOpen}
            onSearchSubmit={onSearchSubmit}
            onOpenWishlist={onOpenWishlist}
            onOpenCart={onOpenCart}
            onOpenCustomerLogin={onOpenCustomerLogin}
            onOpenOrders={onOpenOrders}
          />

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileHeaderDrawer
        isOpen={mobileMenuOpen}
        onNavigateHome={onNavigateHome}
        onNavigateCategory={onNavigateCategory}
        onCloseMobileMenu={() => onSetMobileMenuOpen(false)}
      />
    </header>
  );
};

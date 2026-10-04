import React from 'react';

interface MobileHeaderDrawerProps {
  isOpen: boolean;
  onNavigateHome: () => void;
  onNavigateCategory: (id: string, name: string) => void;
  onCloseMobileMenu: () => void;
}

export const MobileHeaderDrawer: React.FC<MobileHeaderDrawerProps> = ({
  isOpen,
  onNavigateHome,
  onNavigateCategory,
  onCloseMobileMenu,
}) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-[#FAF4E8] border-b border-[#D8C5A8] px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
      <div className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider">
        <button 
          onClick={() => { onNavigateHome(); onCloseMobileMenu(); }}
          className="text-left text-[#C99A2E] py-1"
        >
          Home
        </button>
        <button 
          onClick={() => { onNavigateCategory('all', 'All Products'); onCloseMobileMenu(); }}
          className="text-left text-[#6B5842] hover:text-[#C99A2E] py-1"
        >
          Shop All Menswear
        </button>
        <button 
          onClick={() => { onNavigateCategory('cat-shirts', 'New Arrivals'); onCloseMobileMenu(); }}
          className="text-left text-[#6B5842] hover:text-[#C99A2E] py-1"
        >
          New Arrivals
        </button>
        <button 
          onClick={() => { onNavigateCategory('cat-suits', 'Suits & Blazers'); onCloseMobileMenu(); }}
          className="text-left text-[#6B5842] hover:text-[#C99A2E] py-1"
        >
          Suits &amp; Blazers
        </button>
        <button 
          onClick={() => { onNavigateCategory('cat-jackets', 'Jackets'); onCloseMobileMenu(); }}
          className="text-left text-[#6B5842] hover:text-[#C99A2E] py-1"
        >
          Jackets &amp; Outerwear
        </button>
        <button 
          onClick={() => { onNavigateCategory('cat-accessories', 'Accessories'); onCloseMobileMenu(); }}
          className="text-left text-[#6B5842] hover:text-[#C99A2E] py-1"
        >
          Accessories &amp; Footwear
        </button>
      </div>
    </div>
  );
};

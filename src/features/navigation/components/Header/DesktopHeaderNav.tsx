import React from 'react';
import { productsData } from '../../../products/services/productsData';

interface DesktopHeaderNavProps {
  currentViewType: string;
  onNavigateHome: () => void;
  onNavigateCategory: (id: string, name: string) => void;
}

export const DesktopHeaderNav: React.FC<DesktopHeaderNavProps> = ({
  currentViewType,
  onNavigateHome,
  onNavigateCategory,
}) => {
  return (
    <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#6B5842]">
      <button 
        onClick={onNavigateHome}
        className={`transition-colors hover:text-[#C99A2E] ${currentViewType === 'home' ? 'text-[#C99A2E] font-bold border-b-2 border-[#C99A2E] pb-1' : ''}`}
      >
        Home
      </button>

      {/* Shop Category Dropdown */}
      <div className="relative group py-2">
        <button 
          onClick={() => onNavigateCategory('all', 'All Collection')}
          className="flex items-center gap-1 hover:text-[#C99A2E] transition-colors"
        >
          <span>Shop</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 opacity-70">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <div className="absolute top-full left-0 w-52 bg-[#FFFDF8] border border-[#D8C5A8] rounded-xl shadow-2xl p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
          {productsData.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigateCategory(cat.handle, cat.name)}
              className="w-full text-left px-4 py-2 text-xs font-medium text-[#6B5842] hover:text-[#C99A2E] hover:bg-[#FAF4E8] rounded-lg transition-colors flex items-center justify-between"
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-[#6B5842] font-mono">→</span>
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onNavigateCategory('cat-shirts', 'New Arrivals')}
        className="hover:text-[#C99A2E] transition-colors"
      >
        New Arrivals
      </button>

      <button 
        onClick={() => onNavigateCategory('cat-suits', 'Collections')}
        className="hover:text-[#C99A2E] transition-colors"
      >
        Collections
      </button>

      <button 
        onClick={() => onNavigateCategory('cat-accessories', 'Accessories')}
        className="hover:text-[#C99A2E] transition-colors"
      >
        Accessories
      </button>

      <button 
        onClick={() => onNavigateCategory('cat-tshirts', 'Special Offers')}
        className="text-[#C99A2E] font-bold hover:text-[#A87918] transition-colors flex items-center gap-1"
      >
        <span>Offers</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C99A2E] animate-pulse" />
      </button>
    </nav>
  );
};

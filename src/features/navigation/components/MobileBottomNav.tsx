import React from 'react';

interface MobileBottomNavProps {
  currentViewType: string;
  wishlistCount: number;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentViewType,
  wishlistCount,
  onNavigateHome,
  onNavigateShop,
  onOpenWishlist,
  onOpenAccount,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF4E8]/95 backdrop-blur-md border-t border-[#D8C5A8] px-6 py-2.5 flex justify-between items-center text-[10px] font-semibold text-[#6B5842]">
      
      <button 
        onClick={onNavigateHome}
        className={`flex flex-col items-center gap-1 ${currentViewType === 'home' ? 'text-[#C99A2E] font-bold' : ''}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span>Home</span>
      </button>

      <button 
        onClick={onNavigateShop}
        className={`flex flex-col items-center gap-1 ${currentViewType === 'category' ? 'text-[#C99A2E] font-bold' : ''}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <span>Shop</span>
      </button>

      <button 
        onClick={onOpenWishlist}
        className="flex flex-col items-center gap-1 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <span>Wishlist</span>
        {wishlistCount > 0 && (
          <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-[#C99A2E]" />
        )}
      </button>

      <button 
        onClick={onOpenAccount}
        className="flex flex-col items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        <span>Account</span>
      </button>

    </div>
  );
};

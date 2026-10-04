import React from 'react';

interface FooterProps {
  onNavigateCategory: (id: string, name: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateCategory }) => {
  return (
    <footer className="bg-[#FAF4E8] text-[#6B5842] border-t border-[#D8C5A8] pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-left">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-2 space-y-4 pr-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFFDF8] border border-[#D8C5A8] flex items-center justify-center text-[#C99A2E] font-serif font-bold text-lg">
                M
              </div>
              <span className="font-serif font-extrabold text-xl tracking-wider text-[#3B2A1A] uppercase">
                URBAN MAN
              </span>
            </div>
            
            <p className="text-xs text-[#6B5842] leading-relaxed font-light">
              URBAN MAN defines modern menswear with a commitment to superior craftsmanship, refined tailoring, and timeless masculine aesthetics in Warm Beige and Gold.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2 text-[#6B5842]">
              <a href="#" className="w-8 h-8 rounded-full bg-[#FFFDF8] border border-[#D8C5A8] flex items-center justify-center hover:text-[#C99A2E] hover:border-[#C99A2E] transition-all">
                <span className="text-xs font-bold">IG</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#FFFDF8] border border-[#D8C5A8] flex items-center justify-center hover:text-[#C99A2E] hover:border-[#C99A2E] transition-all">
                <span className="text-xs font-bold">FB</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#FFFDF8] border border-[#D8C5A8] flex items-center justify-center hover:text-[#C99A2E] hover:border-[#C99A2E] transition-all">
                <span className="text-xs font-bold">PT</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#FFFDF8] border border-[#D8C5A8] flex items-center justify-center hover:text-[#C99A2E] hover:border-[#C99A2E] transition-all">
                <span className="text-xs font-bold">X</span>
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-[#3B2A1A] font-bold font-serif uppercase tracking-wider mb-2">Shop</h4>
            <button onClick={() => onNavigateCategory('cat-tshirts', 'T-Shirts')} className="block hover:text-[#C99A2E] transition-colors">T-Shirts</button>
            <button onClick={() => onNavigateCategory('cat-shirts', 'Shirts')} className="block hover:text-[#C99A2E] transition-colors">Shirts</button>
            <button onClick={() => onNavigateCategory('cat-jeans', 'Jeans')} className="block hover:text-[#C99A2E] transition-colors">Raw Denim</button>
            <button onClick={() => onNavigateCategory('cat-trousers', 'Trousers')} className="block hover:text-[#C99A2E] transition-colors">Trousers</button>
            <button onClick={() => onNavigateCategory('cat-jackets', 'Jackets')} className="block hover:text-[#C99A2E] transition-colors">Jackets &amp; Coats</button>
            <button onClick={() => onNavigateCategory('cat-accessories', 'Accessories')} className="block hover:text-[#C99A2E] transition-colors">Accessories</button>
            <button onClick={() => onNavigateCategory('cat-footwear', 'Footwear')} className="block hover:text-[#C99A2E] transition-colors">Footwear</button>
          </div>

          {/* Column 3: Customer Support */}
          <div className="space-y-3 text-xs">
            <h4 className="text-[#3B2A1A] font-bold font-serif uppercase tracking-wider mb-2">Help</h4>
            <button onClick={() => alert("Track your order in your Profile section.")} className="block hover:text-[#C99A2E] transition-colors">Track Order</button>
            <button onClick={() => alert("Easy 7-day returns on all apparel.")} className="block hover:text-[#C99A2E] transition-colors">Returns &amp; Exchanges</button>
            <button onClick={() => alert("Size guide available on every product page.")} className="block hover:text-[#C99A2E] transition-colors">Size Guide</button>
            <button onClick={() => alert("Frequently asked questions")} className="block hover:text-[#C99A2E] transition-colors">FAQs</button>
            <button onClick={() => alert("Contact support at support@urbanman.com")} className="block hover:text-[#C99A2E] transition-colors">Contact Us</button>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3 text-xs">
            <h4 className="text-[#3B2A1A] font-bold font-serif uppercase tracking-wider mb-2">Stay Connected</h4>
            <p className="text-[11px] text-[#6B5842] font-light">Subscribe to receive exclusive drops and private sale invitations.</p>
            
            <form 
              onSubmit={(e) => { e.preventDefault(); alert("Subscribed to URBAN MAN Newsletter!"); }}
              className="flex items-center gap-1.5 pt-2"
            >
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg text-xs text-[#3B2A1A] placeholder-[#6B5842] focus:outline-none focus:border-[#C99A2E]"
              />
              <button 
                type="submit"
                className="p-2 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] rounded-lg transition-colors font-bold"
                aria-label="Subscribe"
              >
                →
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Footer Bar */}
        <div className="border-t border-[#D8C5A8] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-[#6B5842] font-mono">
          <div>
            &copy; {new Date().getFullYear()} UrbanMan. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-[#3B2A1A] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#3B2A1A] cursor-pointer">Terms &amp; Conditions</span>
            <span className="hover:text-[#3B2A1A] cursor-pointer">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] bg-[#F3E6D0] text-[#3B2A1A] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#FAF4E8] border border-[#D8C5A8] rounded-2xl p-8 text-center shadow-xl space-y-6">
        <div className="text-6xl font-serif font-extrabold text-[#C99A2E]">404</div>
        
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#6B5842] font-bold">PAGE NOT FOUND</span>
          <h1 className="text-2xl font-bold font-serif text-[#3B2A1A] mt-1">Lost in Style?</h1>
          <p className="text-xs text-[#6B5842] mt-2 leading-relaxed">
            The page or product category you are looking for does not exist or has been moved.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg"
        >
          Back to Storefront
        </button>
      </div>
    </div>
  );
}

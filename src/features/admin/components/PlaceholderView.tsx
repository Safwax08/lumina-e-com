import React from 'react';

interface PlaceholderViewProps {
  title: string;
}

export function PlaceholderView({ title }: PlaceholderViewProps) {
  return (
    <div className="p-12 h-full flex flex-col items-center justify-center text-center bg-[#F3E6D0]">
      <div className="w-20 h-20 bg-[#FAF4E8] rounded-2xl flex items-center justify-center mb-6 border border-[#D8C5A8] shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#C99A2E]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.795 0-5.482-.29-8.035-.837-1.717-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold font-serif text-[#3B2A1A] mb-2">{title} Management</h2>
      <p className="text-[#6B5842] text-xs max-w-md font-light leading-relaxed">
        This administrative module is active in system context. Select <span className="font-bold text-[#3B2A1A]">Products</span> or <span className="font-bold text-[#3B2A1A]">E-commerce</span> to manage catalog data and orders.
      </p>
    </div>
  );
}

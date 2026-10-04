import React from 'react';
import { Product } from '../../../../types';

interface ProductTabsProps {
  product: Product;
  activeTab: 'desc' | 'specs' | 'shipping';
  setActiveTab: (tab: 'desc' | 'specs' | 'shipping') => void;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  activeTab,
  setActiveTab,
}) => {
  const specs = [
    { name: 'Material', value: '100% Premium Cotton / Italian Wool Blend' },
    { name: 'Fit Type', value: 'Tailored Slim Fit' },
    { name: 'Care Instructions', value: 'Dry Clean / Cold Gentle Wash' },
    { name: 'Country of Origin', value: 'Handcrafted in Italy / Portugal' },
    { name: 'Style Code', value: `UM-${product.id.toUpperCase()}` }
  ];

  return (
    <div className="border-t border-[#D8C5A8] pt-10 mb-16">
      <div className="flex border-b border-[#D8C5A8] mb-8 gap-8">
        <button
          onClick={() => setActiveTab('desc')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'desc' ? 'border-[#C99A2E] text-[#C99A2E]' : 'border-transparent text-[#6B5842] hover:text-[#3B2A1A]'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'specs' ? 'border-[#C99A2E] text-[#C99A2E]' : 'border-transparent text-[#6B5842] hover:text-[#3B2A1A]'
          }`}
        >
          Specifications
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'shipping' ? 'border-[#C99A2E] text-[#C99A2E]' : 'border-transparent text-[#6B5842] hover:text-[#3B2A1A]'
          }`}
        >
          Shipping &amp; Returns
        </button>
      </div>

      <div className="text-xs text-[#6B5842] leading-relaxed font-light">
        {activeTab === 'desc' && (
          <p>{product.description}</p>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-xl border border-[#D8C5A8] rounded-xl overflow-hidden bg-[#FAF4E8]">
            <table className="w-full text-left">
              <tbody>
                {specs.map((s, idx) => (
                  <tr key={idx} className="border-b border-[#D8C5A8] last:border-0">
                    <td className="py-3 px-4 font-bold text-[#3B2A1A] bg-[#F3E6D0] w-1/3">{s.name}</td>
                    <td className="py-3 px-4 text-[#6B5842]">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4 max-w-2xl">
            <p><strong className="text-[#3B2A1A]">Complimentary Express Delivery:</strong> All orders are dispatched in eco-friendly garment boxes within 24 hours. Estimated delivery 2-4 business days.</p>
            <p><strong className="text-[#3B2A1A]">Hassle-Free 7-Day Returns:</strong> Returns and exchanges are processed free of charge. Items must be unworn with original tags attached.</p>
          </div>
        )}
      </div>
    </div>
  );
};

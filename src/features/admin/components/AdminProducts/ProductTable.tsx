import React from 'react';
import { Product } from '../../../../types';
import { Edit2, Trash2 } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-[#FFFDF8] rounded-2xl shadow-sm border border-[#D8C5A8] overflow-hidden flex-1 flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-[#3B2A1A]">
          <thead className="bg-[#FAF4E8] border-b border-[#D8C5A8] text-xs font-serif font-bold uppercase tracking-wider text-[#3B2A1A] sticky top-0">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8C5A8]/30">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-[#FAF4E8]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FFFDF8] rounded-lg border border-[#D8C5A8] p-1 flex-shrink-0">
                      <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-[#3B2A1A] text-xs line-clamp-1">{product.title}</p>
                      <p className="text-[11px] text-[#6B5842] mt-0.5 line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize text-xs text-[#6B5842] font-medium">{product.category}</td>
                <td className="px-6 py-4 text-xs text-[#6B5842]">{product.brand || '-'}</td>
                <td className="px-6 py-4 font-bold text-xs text-[#C99A2E]">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-[#6B5842] hover:text-[#C99A2E] hover:bg-[#F3E6D0] rounded-md transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(product.id)}
                      className="p-1.5 text-[#6B5842] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#6B5842] text-xs font-mono">
                  No products found in catalog.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

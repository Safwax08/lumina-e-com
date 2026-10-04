import React from 'react';
import { Product } from '../../../../types';
import { X } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  formData: Partial<Product>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  editingProduct,
  formData,
  onChange,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#2F241B]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#D8C5A8]">
        <div className="px-6 py-4 border-b border-[#D8C5A8] flex justify-between items-center shrink-0 bg-[#FAF4E8]">
          <h2 className="text-base font-bold font-serif text-[#3B2A1A]">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="text-[#6B5842] hover:text-[#3B2A1A] p-1.5 rounded-full hover:bg-[#F3E6D0] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FFFDF8]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2A1A] mb-1">Title *</label>
              <input 
                required
                type="text" 
                name="title"
                value={formData.title || ''}
                onChange={onChange}
                className="w-full px-3.5 py-2 border border-[#D8C5A8] rounded-xl bg-[#FAF4E8] text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E] focus:ring-1 focus:ring-[#C99A2E] text-xs"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2A1A] mb-1">Price (₹) *</label>
              <input 
                required
                type="number" 
                step="0.01"
                name="price"
                value={formData.price || ''}
                onChange={onChange}
                className="w-full px-3.5 py-2 border border-[#D8C5A8] rounded-xl bg-[#FAF4E8] text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E] focus:ring-1 focus:ring-[#C99A2E] text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2A1A] mb-1">Brand</label>
              <input 
                type="text" 
                name="brand"
                value={formData.brand || ''}
                onChange={onChange}
                className="w-full px-3.5 py-2 border border-[#D8C5A8] rounded-xl bg-[#FAF4E8] text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E] focus:ring-1 focus:ring-[#C99A2E] text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2A1A] mb-1">Category *</label>
              <input 
                required
                type="text" 
                name="category"
                value={formData.category || ''}
                onChange={onChange}
                className="w-full px-3.5 py-2 border border-[#D8C5A8] rounded-xl bg-[#FAF4E8] text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E] focus:ring-1 focus:ring-[#C99A2E] text-xs"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2A1A] mb-1">Image URL</label>
              <input 
                type="text" 
                name="image"
                value={formData.image || ''}
                onChange={onChange}
                className="w-full px-3.5 py-2 border border-[#D8C5A8] rounded-xl bg-[#FAF4E8] text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E] focus:ring-1 focus:ring-[#C99A2E] text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2A1A] mb-1">Description *</label>
              <textarea 
                required
                name="description"
                value={formData.description || ''}
                onChange={onChange}
                rows={4}
                className="w-full px-3.5 py-2 border border-[#D8C5A8] rounded-xl bg-[#FAF4E8] text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E] focus:ring-1 focus:ring-[#C99A2E] text-xs"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#D8C5A8]">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D8C5A8] text-[#3B2A1A] bg-[#FAF4E8] hover:bg-[#F3E6D0] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md border border-[#C99A2E]"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

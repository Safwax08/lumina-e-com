import React, { useState, useEffect } from 'react';
import { Product } from '../../../../types';
import { fetchProductsService, saveAdminProductService, deleteAdminProductService } from '../../../../services/products';
import { Plus } from 'lucide-react';
import { ProductTable } from './ProductTable';
import { ProductFormModal } from './ProductFormModal';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    original_price: undefined,
    category: 't-shirts',
    description: '',
    image: '',
    brand: 'URBAN MAN',
    stock: 25,
  });

  const loadProducts = async () => {
    setLoading(true);
    const prods = await fetchProductsService();
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        price: 999,
        original_price: 1299,
        category: 't-shirts',
        description: '',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        brand: 'URBAN MAN',
        stock: 25,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'original_price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.price) {
      alert('Please provide product title and price.');
      return;
    }

    await saveAdminProductService(formData);
    await loadProducts();
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product from local inventory?")) {
      await deleteAdminProductService(id);
      await loadProducts();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#6B5842] font-mono text-xs">Loading product catalog...</div>;
  }

  return (
    <div className="p-6 h-full flex flex-col bg-[#F3E6D0]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#3B2A1A]">Products Management</h1>
          <p className="text-xs text-[#6B5842] mt-1">Manage store catalog, prices, and stock levels.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md border border-[#C99A2E]"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <ProductTable
        products={products}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        editingProduct={editingProduct}
        formData={formData}
        onChange={handleChange}
        onSave={handleSave}
        onClose={handleCloseModal}
      />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  BarChart2,
  PackageCheck
} from 'lucide-react';
import { fetchOrdersService } from '../../../services/orders';
import { fetchProductsService } from '../../../services/products';
import { Order, Product } from '../../../types';

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const [orderData, productData] = await Promise.all([
        fetchOrdersService(),
        fetchProductsService(),
      ]);
      setOrders(orderData);
      setProducts(productData);
      setLoading(false);
    };
    loadDashboardData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => (p.stock !== undefined ? p.stock : 25) < 10).length;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag },
    { label: 'Total Products', value: totalProducts.toString(), icon: PackageCheck },
    { label: 'Low Stock Alert', value: lowStockProducts.toString(), icon: TrendingUp },
  ];

  if (loading) {
    return <div className="p-8 text-center text-[#6B5842] font-mono text-xs">Loading dashboard metrics...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#3B2A1A]">E-commerce Dashboard</h1>
          <p className="text-[#6B5842] text-xs mt-1">Live metrics calculated from store orders and catalog data.</p>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#FFFDF8] rounded-2xl p-6 shadow-sm border border-[#D8C5A8]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C99A2E]/15 flex items-center justify-center text-[#C99A2E] border border-[#D8C5A8]/50">
                <stat.icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#6B5842] mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold font-serif text-[#3B2A1A]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue / Orders Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#FFFDF8] rounded-2xl shadow-sm border border-[#D8C5A8] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-serif text-[#3B2A1A]">Sales Overview</h3>
            <span className="text-xs text-[#6B5842] font-mono">Live Order Summary</span>
          </div>
          {orders.length === 0 ? (
            <div className="h-64 w-full bg-[#FAF4E8] rounded-xl border border-[#D8C5A8] border-dashed flex flex-col items-center justify-center text-[#6B5842] text-xs">
              <BarChart2 size={24} className="mb-2 text-[#C99A2E]" />
              <p className="font-bold text-[#3B2A1A]">No customer orders placed yet.</p>
              <p className="text-[11px] text-[#6B5842] mt-1">Place an order via storefront checkout to populate sales data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-48 w-full bg-[#FAF4E8] rounded-xl border border-[#D8C5A8] p-4 flex flex-col justify-end">
                <div className="flex items-end gap-3 h-full pt-4">
                  {orders.slice(0, 10).map((ord, idx) => {
                    const maxTot = Math.max(...orders.map(o => o.total), 1);
                    const heightPct = Math.min(100, Math.max(15, (ord.total / maxTot) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                        <div 
                          className="w-full bg-[#C99A2E] rounded-t group-hover:bg-[#A87918] transition-all" 
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-[9px] font-mono text-[#6B5842] truncate w-full text-center">
                          ₹{ord.total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#FFFDF8] rounded-2xl shadow-sm border border-[#D8C5A8] p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#D8C5A8] flex justify-between items-center">
            <h3 className="text-lg font-bold font-serif text-[#3B2A1A]">Recent Orders</h3>
            <span className="text-[#6B5842] text-xs font-mono">{orders.length} total</span>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-[#6B5842] text-xs">
                No orders recorded in local store.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#6B5842] bg-[#FAF4E8] border-b border-[#D8C5A8]">
                  <tr>
                    <th className="px-6 py-3 font-medium">Customer / ID</th>
                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-[#D8C5A8]/30 hover:bg-[#FAF4E8]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#3B2A1A] text-xs">{order.shippingAddress?.firstName || 'Customer'}</div>
                        <div className="text-[#6B5842] text-[11px] mt-0.5">{order.id} • {new Date(order.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-[#C99A2E] text-xs">₹{order.total.toLocaleString('en-IN')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

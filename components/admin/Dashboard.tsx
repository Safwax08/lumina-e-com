import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2
} from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', positive: true, icon: DollarSign },
    { label: 'Orders', value: '+2350', change: '+180.1%', positive: true, icon: ShoppingBag },
    { label: 'Active Customers', value: '+12,234', change: '+19%', positive: true, icon: Users },
    { label: 'Conversion Rate', value: '3.12%', change: '-2%', positive: false, icon: TrendingUp },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', product: 'MacBook Pro 16"', date: '2026-08-30', amount: '$2,499.00', status: 'Completed' },
    { id: '#ORD-002', customer: 'Jane Smith', product: 'iPhone 15 Pro', date: '2026-08-30', amount: '$999.00', status: 'Processing' },
    { id: '#ORD-003', customer: 'Bob Johnson', product: 'AirPods Max', date: '2026-08-29', amount: '$549.00', status: 'Shipped' },
    { id: '#ORD-004', customer: 'Alice Williams', product: 'Apple Watch Series 9', date: '2026-08-28', amount: '$399.00', status: 'Completed' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">E-commerce Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Export
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <stat.icon size={20} />
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`flex items-center gap-1 mt-4 text-sm font-medium
              ${stat.positive ? 'text-emerald-600' : 'text-rose-600'}
            `}>
              {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{stat.change}</span>
              <span className="text-slate-400 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Revenue Overview</h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
              <option>This Year</option>
              <option>Last Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-72 w-full bg-slate-50 rounded-xl border border-slate-100 border-dashed flex items-center justify-center">
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <BarChart2 size={20} />
              Chart Data Visualization
            </p>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View All</button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer / Product</th>
                  <th className="px-6 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{order.customer}</div>
                      <div className="text-slate-500 text-xs mt-1">{order.product} • {order.amount}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                        ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : ''}
                        ${order.status === 'Processing' ? 'bg-amber-50 text-amber-700' : ''}
                        ${order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

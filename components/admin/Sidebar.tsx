import React, { useState } from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Settings, 
  ShoppingCart,
  BarChart2,
  PieChart,
  Headset,
  Briefcase,
  Menu,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNavigateHome: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ isOpen, setIsOpen, onNavigateHome, activeView, setActiveView, onLogout }: SidebarProps) {
  const [activeMenu, setActiveMenu] = useState('dashboards');

  const navItems = [
    { id: 'dashboards', icon: LayoutDashboard, label: 'Dashboards' },
    { id: 'apps', icon: Home, label: 'Applications' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'products', icon: ShoppingBag, label: 'Products' },
  ];

  const subMenus: Record<string, { label: string; icon: React.ElementType }[]> = {
    dashboards: [
      { label: 'E-commerce', icon: ShoppingCart },
      { label: 'Analytics', icon: BarChart2 },
      { label: 'CRM', icon: PieChart },
      { label: 'Help Desk', icon: Headset },
      { label: 'Finance & Banking', icon: Briefcase },
    ],
    customers: [
      { label: 'Users List', icon: Users },
      { label: 'Add User', icon: Users },
    ],
    products: [
      { label: 'Marketplace', icon: ShoppingBag },
      { label: 'Pricing', icon: ShoppingBag },
    ]
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen bg-white z-40 flex transition-transform duration-300 ease-in-out border-r border-slate-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Icon Rail */}
        <div className="w-16 bg-slate-900 flex flex-col items-center py-4 h-full border-r border-slate-800">
          <button 
            onClick={onNavigateHome}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold mb-8 hover:bg-indigo-500 transition-colors shadow-lg"
            title="Go to Store"
          >
            L
          </button>
          
          <div className="flex flex-col gap-4 flex-1 w-full items-center">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsOpen(true);
                  if (subMenus[item.id] && subMenus[item.id].length > 0) {
                    setActiveView(subMenus[item.id][0].label);
                  }
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative
                  ${activeMenu === item.id ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-white/10 hover:text-white'}
                `}
              >
                <item.icon size={20} />
                
                {/* Tooltip */}
                <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-auto mb-4 relative group">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all" title="Settings">
              <Settings size={20} />
            </button>
            
            {/* Settings Popover */}
            <div className="absolute bottom-0 left-full ml-4 w-32 bg-slate-800 rounded-xl shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-3 text-xs font-bold text-rose-400 hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Menu Panel */}
        <div className="w-56 bg-white h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <span className="text-lg font-bold text-slate-800">Admina</span>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {(subMenus[activeMenu] || []).map((subItem, idx) => {
                const isActive = activeView === subItem.label || (activeView === 'dashboard' && activeMenu === 'dashboards' && idx === 0);

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveView(subItem.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
                      ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}
                    `}
                  >
                    <subItem.icon size={18} className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                    <span>{subItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          

        </div>
      </aside>
    </>
  );
}

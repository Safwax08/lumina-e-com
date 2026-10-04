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
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#FAF4E8] rounded-md shadow-md text-[#3B2A1A] border border-[#D8C5A8]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#2F241B]/60 backdrop-blur-sm z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen bg-[#FAF4E8] z-40 flex transition-transform duration-300 ease-in-out border-r border-[#D8C5A8]
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Icon Rail */}
        <div className="w-16 bg-[#2F241B] flex flex-col items-center py-4 h-full border-r border-[#3B2A1A]">
          <button 
            onClick={onNavigateHome}
            className="w-10 h-10 bg-[#C99A2E] rounded-xl flex items-center justify-center text-[#FFFDF8] font-bold font-serif mb-8 hover:bg-[#A87918] transition-colors shadow-lg border border-[#C99A2E]"
            title="Go to Storefront"
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
                  ${activeMenu === item.id ? 'bg-[#C99A2E]/25 text-[#E5C378] border border-[#C99A2E]/40' : 'text-[#D8C5A8]/70 hover:bg-white/10 hover:text-[#FFFDF8]'}
                `}
              >
                <item.icon size={20} />
                
                {/* Tooltip */}
                <div className="absolute left-14 bg-[#3B2A1A] text-[#FAF4E8] text-xs px-2.5 py-1 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-[#D8C5A8]/30 font-sans shadow-md">
                  {item.label}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-auto mb-4 relative group">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-[#D8C5A8]/70 hover:bg-white/10 hover:text-[#FFFDF8] transition-all" title="Settings">
              <Settings size={20} />
            </button>
            
            {/* Settings Popover */}
            <div className="absolute bottom-0 left-full ml-4 w-36 bg-[#2F241B] rounded-xl shadow-xl border border-[#D8C5A8]/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Menu Panel */}
        <div className="w-56 bg-[#FAF4E8] h-full flex flex-col border-r border-[#D8C5A8]">
          <div className="h-16 flex items-center px-6 border-b border-[#D8C5A8]">
            <span className="text-base font-bold font-serif tracking-wide text-[#3B2A1A]">LUMINA ADMIN</span>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {(subMenus[activeMenu] || []).map((subItem, idx) => {
                const isActive = activeView === subItem.label || (activeView === 'dashboard' && activeMenu === 'dashboards' && idx === 0);

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveView(subItem.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors group
                      ${isActive 
                        ? 'bg-[#FFFDF8] text-[#3B2A1A] border border-[#D8C5A8] shadow-sm font-bold' 
                        : 'text-[#6B5842] hover:bg-[#F3E6D0] hover:text-[#3B2A1A]'
                      }
                    `}
                  >
                    <subItem.icon size={16} className={`transition-colors ${isActive ? 'text-[#C99A2E]' : 'text-[#8C7A6B] group-hover:text-[#3B2A1A]'}`} />
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

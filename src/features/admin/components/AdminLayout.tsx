import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { AdminLogin } from './AdminLogin';
import { AdminProducts } from './AdminProducts';
import { PlaceholderView } from './PlaceholderView';
import { Bell, Search } from 'lucide-react';

interface AdminLayoutProps {
  onNavigateHome: () => void;
}

export function AdminLayout({ onNavigateHome }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('E-commerce');

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} onCancel={onNavigateHome} />;
  }

  const renderContent = () => {
    if (activeView === 'E-commerce' || activeView === 'dashboard') {
      return <Dashboard />;
    }
    if (activeView === 'Marketplace' || activeView === 'Products' || activeView === 'products') {
      return <AdminProducts />;
    }
    return <PlaceholderView title={activeView} />;
  };

  return (
    <div className="flex h-screen bg-[#F3E6D0] overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onNavigateHome={onNavigateHome}
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={() => {
          setIsAuthenticated(false);
          onNavigateHome();
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-[#FFFDF8] border-b border-[#D8C5A8] flex items-center justify-between px-6 z-10 shrink-0">
          
          {/* Search */}
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7A6B]">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-[#D8C5A8] rounded-lg leading-5 bg-[#FAF4E8] text-[#3B2A1A] placeholder-[#8C7A6B] focus:outline-none focus:bg-[#FFFDF8] focus:border-[#C99A2E] focus:ring-1 focus:ring-[#C99A2E] sm:text-xs transition-colors"
                placeholder="Search catalog, orders, customers..."
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#6B5842] hover:text-[#3B2A1A] transition-colors rounded-full hover:bg-[#F3E6D0]">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[#C99A2E] ring-2 ring-[#FFFDF8]"></span>
            </button>
            
            <div className="h-8 w-px bg-[#D8C5A8] mx-2"></div>
            
            <button className="flex items-center gap-3 hover:bg-[#F3E6D0] p-1.5 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#C99A2E]/20 flex items-center justify-center text-[#C99A2E] font-bold overflow-hidden border border-[#D8C5A8]">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=C99A2E&color=fff" alt="Admin" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#3B2A1A] leading-none">Admin User</p>
                <p className="text-[10px] text-[#6B5842] mt-1 font-mono uppercase tracking-wider">Super Admin</p>
              </div>
            </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-[#F3E6D0]">
          {renderContent()}
        </main>
        
      </div>
    </div>
  );
}

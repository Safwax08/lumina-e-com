import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { AdminLogin } from './AdminLogin';
import { AdminProducts } from './AdminProducts';
import { PlaceholderView } from './PlaceholderView';
import { Bell, Search, User } from 'lucide-react';

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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
          
          {/* Search */}
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                placeholder="Search anything..."
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            
            <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-indigo-200">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Admin" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-700 leading-none">Admin User</p>
                <p className="text-xs text-slate-500 mt-1">Super Admin</p>
              </div>
            </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
        
      </div>
    </div>
  );
}

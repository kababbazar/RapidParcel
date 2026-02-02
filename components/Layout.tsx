
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PackagePlus, 
  Users, 
  MapPin, 
  Calculator, 
  Menu, 
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'data-entry', icon: PackagePlus, label: 'Data Entry' },
    { id: 'merchants', icon: Users, label: 'Merchants' },
    { id: 'areas', icon: MapPin, label: 'Area Management' },
    { id: 'accounts', icon: Calculator, label: 'Accounts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/vmneeplgg519no8eqvqw" alt="Logo" className="w-8 h-8 rounded" />
          <span className="font-bold text-lg text-gray-800">Rapid Parcel</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-100 rounded">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r min-h-screen flex-col transition-all duration-300 ease-in-out hidden md:flex sticky top-0 h-screen`}
      >
        <div className="p-6 flex items-center gap-3 border-b mb-4">
          <img src="https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/vmneeplgg519no8eqvqw" alt="Logo" className="w-10 h-10 rounded-lg shadow" />
          {sidebarOpen && <span className="font-bold text-xl tracking-tight text-yellow-600">RAPID PARCEL</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-yellow-50 text-yellow-700 shadow-sm border border-yellow-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={22} className={isActive ? 'text-yellow-600' : ''} />
                {sidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
                {sidebarOpen && isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Menu size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Collapse Menu</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[100]"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-64 h-full bg-white flex flex-col p-4" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-8">
               <span className="font-bold text-xl text-yellow-600">RAPID PARCEL</span>
               <X onClick={() => setSidebarOpen(false)} />
             </div>
             <div className="space-y-2">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setView(item.id as View); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg ${currentView === item.id ? 'bg-yellow-50 text-yellow-700 font-bold' : 'text-gray-600'}`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#fdfdfd]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

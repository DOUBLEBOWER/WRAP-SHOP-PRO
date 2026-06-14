import React from 'react';
import NotificationBell from './NotificationBell';
import { 
  LayoutDashboard, 
  Users, 
  KanbanSquare, 
  Calculator, 
  Printer,
  Archive,
  Calendar as CalendarIcon,
  ShieldCheck,
  MessageSquare,
  ShoppingBag,
  Image as ImageIcon
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'pipeline', name: 'Production Kanban', icon: KanbanSquare },
    { id: 'calendar', name: 'Shop Calendar', icon: CalendarIcon },
    { id: 'inventory', name: 'Vinyl Inventory', icon: Archive },
    { id: 'customers', name: 'Customer Database', icon: Users },
    { id: 'estimator', name: 'Wrap & Job Estimator', icon: Calculator },
    { id: 'portal', name: 'Client Proofing Portal', icon: ShieldCheck },
    { id: 'comms', name: 'Comms & Growth Hub', icon: MessageSquare },
    { id: 'portfolio', name: 'Portfolio Manager', icon: ImageIcon },
  ];

  const handleOpenStore = () => window.open('/store', '_blank');
  const handleOpenLanding = () => window.open('/', '_blank');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-black/40 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between z-10">
        <div>
          {/* Header/Logo */}
          <div className="p-4 border-b border-white/5">
            <img
              src="/manus-storage/c2c_logo_d01c1ec7.webp"
              alt="All-Pro Coast 2 Coast LLC"
              className="h-10 w-auto object-contain"
            />
            <p className="text-[9px] font-semibold text-cyan-400/70 tracking-widest uppercase mt-1 pl-1">
              CRM Dashboard
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[60vh]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/5 text-pink-400 border border-pink-500/20 shadow-inner'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-pink-500 shadow-md shadow-pink-500/50" />
                  )}
                  <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-pink-400' : 'text-muted-foreground group-hover:text-cyan-400'
                  }`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Access Buttons */}
        <div className="px-4 pb-2 space-y-2">
          <button
            onClick={handleOpenStore}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500/10 to-cyan-500/5 border border-pink-500/20 text-pink-400 hover:from-pink-500/20 hover:to-cyan-500/10 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            Open Online Store
          </button>
          <button
            onClick={() => window.open('/book', '_blank')}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500/10 to-purple-500/5 border border-cyan-500/20 text-cyan-400 hover:from-cyan-500/20 hover:to-purple-500/10 transition-all"
          >
            <CalendarIcon className="h-4 w-4" />
            Customer Booking Page
          </button>
          <button
            onClick={() => window.open('/team', '_blank')}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500/10 to-pink-500/5 border border-purple-500/20 text-purple-400 hover:from-purple-500/20 hover:to-pink-500/10 transition-all"
          >
            <Users className="h-4 w-4" />
            Team Login Portal
          </button>
        </div>

        {/* Sidebar Footer / Business Status */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-purple-950/20 border border-cyan-500/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase">
                TULSA SHOP ONLINE
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Active Print Queue:</span>
              <span className="font-mono text-cyan-400 font-bold">4 Jobs</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Today's Target:</span>
              <span className="font-mono text-pink-400 font-bold">$5,000</span>
            </div>
          </div>
        </div>
      </aside>

        {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {/* Top bar with notification bell */}
        <div className="flex justify-end items-center px-6 md:px-8 pt-5 pb-0 relative z-20">
          <NotificationBell onNavigate={setActiveTab} />
        </div>
        <div className="absolute top-[-10%] left-[20%] w-[35rem] h-[35rem] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40rem] h-[40rem] rounded-full bg-pink-500/5 blur-[150px] pointer-events-none" />
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

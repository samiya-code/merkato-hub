import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  Boxes,
  Users,
  Building2,
  Truck,
  TrendingDown,
  UserCheck,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  Store,
  X,
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Sales', path: '/sales', icon: ShoppingCart },
    { label: 'POS Terminal', path: '/sales/pos', icon: Receipt },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Inventory', path: '/inventory', icon: Boxes },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Suppliers', path: '/suppliers', icon: Building2 },
    { label: 'Purchases', path: '/purchases', icon: Truck },
    { label: 'Expenses', path: '/expenses', icon: TrendingDown },
    { label: 'Employees', path: '/employees', icon: UserCheck },
    { label: 'Invoices', path: '/invoices', icon: FileText },
    { label: 'Credit & Payments', path: '/payments', icon: CreditCard },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200/80 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4.5 border-b border-slate-100">
        <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onCloseMobile}>
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">MerkatoHub</span>
            </div>
            <p className="text-[9px] font-bold tracking-wider text-emerald-700 uppercase">
              Empowering Ethiopian SMEs
            </p>
          </div>
        </NavLink>

        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-50/80 text-emerald-800 font-bold border-l-3 border-emerald-600 pl-2.5'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Settings & Status */}
      <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/40">
        <NavLink
          to="/settings"
          onClick={onCloseMobile}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
            location.pathname === '/settings'
              ? 'bg-emerald-50 text-emerald-800 border-l-3 border-emerald-600 pl-2.5 font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Business Settings</span>
        </NavLink>

        <div className="pt-2 px-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>MERKATOHUB v2.4.0</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

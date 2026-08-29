import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Building2,
  Globe,
  LogOut,
  User,
  Settings,
  Plus,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBusiness } from '../../context/BusinessContext';

export const Navbar = ({ onOpenMobileSidebar, onOpenSearch }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { business, activeBranch, setActiveBranch, language, setLanguage } = useBusiness();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef(null);
  const branchRef = useRef(null);
  const langRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (branchRef.current && !branchRef.current.contains(e.target)) setBranchOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'AM', name: 'አማርኛ (Amharic)' },
    { code: 'OR', name: 'Afaan Oromoo' },
    { code: 'TI', name: 'ትግርኛ (Tigrinya)' },
  ];

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-xs text-slate-500 transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
              <span className="truncate">Search products, sales, customers...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Branch, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick New Sale button */}
          <button
            onClick={() => navigate('/sales/pos')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Sale</span>
          </button>

          {/* Branch Switcher */}
          <div className="relative" ref={branchRef}>
            <button
              onClick={() => setBranchOpen(!branchOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="max-w-[120px] truncate">{activeBranch}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {branchOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white p-1.5 shadow-xl border border-slate-100 ring-1 ring-slate-200 animate-fade-in z-30">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Branches
                </div>
                {business?.branches?.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveBranch(b.name);
                      setBranchOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                      activeBranch === b.name
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{b.name}</span>
                    {activeBranch === b.name && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher Badge */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white p-1.5 shadow-xl border border-slate-100 ring-1 ring-slate-200 animate-fade-in z-30">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  System Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                      language === l.code
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{l.name}</span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-1.5 w-80 rounded-2xl bg-white p-3 shadow-2xl border border-slate-100 ring-1 ring-slate-200 animate-fade-in z-30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications (3 New)</span>
                  <Link
                    to="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100">
                    <p className="font-semibold text-amber-900 text-[11px]">Low Stock: Hand-Woven Scarf</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">Only 12 units remaining in stock.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-100">
                    <p className="font-semibold text-rose-900 text-[11px]">Overdue Payment</p>
                    <p className="text-[10px] text-rose-700 mt-0.5">Dagmawi Solomon: 4,800.00 ETB due.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <p className="font-semibold text-emerald-900 text-[11px]">Sales Milestone</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Reached 57,750 ETB today (+18.4%).</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Abebe Bikila'}</p>
                <p className="text-[10px] font-semibold text-emerald-600">{user?.role || 'OWNER'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-1.5 w-60 rounded-2xl bg-white p-2 shadow-2xl border border-slate-100 ring-1 ring-slate-200 animate-fade-in z-30">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{business?.legalName || 'Bikila Trading PLC'}</span>
                  </div>
                </div>

                {/* Switch Role Fast Toggle */}
                <div className="px-3 py-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Demo Role Switcher</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {['OWNER', 'MANAGER', 'CASHIER'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          switchDemoRole(r);
                          setProfileOpen(false);
                        }}
                        className={`text-[10px] py-1 px-1 rounded-md font-semibold text-center transition-colors ${
                          user?.role === r
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 my-1 pt-1 space-y-0.5">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Business Profile & Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

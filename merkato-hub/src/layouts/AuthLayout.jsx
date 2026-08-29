import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Store, CheckCircle2, Phone, ShieldCheck } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export const AuthLayout = () => {
  const { language, setLanguage } = useBusiness();

  const languages = [
    { code: 'EN', label: 'EN' },
    { code: 'AM', label: 'AM (አማ)' },
    { code: 'OR', label: 'OR' },
    { code: 'TI', label: 'TI' },
  ];

  return (
    <div className="min-h-screen relative flex flex-col justify-center bg-slate-900 overflow-x-hidden">
      {/* Background Image with Dark Vignette & Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1600&auto=format&fit=crop&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-950/95 z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Hero Section */}
        <div className="flex-1 text-white space-y-6 max-w-lg">
          {/* Brand Tag */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight">MerkatoHub</div>
              <div className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase">
                Empowering Ethiopian SMEs
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Manage your business with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                confidence.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              The all-in-one SaaS platform tailored for Ethiopian merchants. From POS to inventory and financial reporting, everything you need in one unified dashboard.
            </p>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-2.5 pt-2">
            {[
              'Real-time Inventory & Low-Stock Alerts',
              'Integrated POS & Telebirr / CBE Sales',
              'Financial Workflows & 15% VAT Reports',
              'Customer Debt & Supplier Management',
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 text-xs font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>MERKATOHUB ENTERPRISE v2.4.0</span>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200/80 animate-fade-in">
          <Outlet />

          {/* Card Footer Links & Support */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
              <a href="#help" className="hover:text-emerald-700">Help Center</a>
              <span>•</span>
              <a href="#privacy" className="hover:text-emerald-700">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-emerald-700">Terms of Service</a>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>Contact support: +251 11 000 0000</span>
            </div>

            {/* Language Switcher Bar */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase transition-colors ${
                    language === l.code
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

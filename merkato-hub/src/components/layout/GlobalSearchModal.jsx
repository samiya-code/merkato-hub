import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Package,
  Users,
  Building2,
  Receipt,
  ArrowRight,
  X,
  TrendingUp,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { customerService } from '../../services/customerService';
import { supplierService } from '../../services/supplierService';
import { salesService } from '../../services/salesService';
import { formatCurrency } from '../../utils/currency';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], customers: [], suppliers: [], sales: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ products: [], customers: [], suppliers: [], sales: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], customers: [], suppliers: [], sales: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const q = query.toLowerCase();
        const [allProds, allCusts, allSups, allSales] = await Promise.all([
          productService.getProducts(),
          customerService.getCustomers(),
          supplierService.getSuppliers(),
          salesService.getSales(),
        ]);

        setResults({
          products: allProds.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 3),
          customers: allCusts.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 3),
          suppliers: allSups.filter(s => s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q)).slice(0, 3),
          sales: allSales.filter(s => s.receiptNumber.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q)).slice(0, 3),
        });
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  const totalHits = results.products.length + results.customers.length + results.suppliers.length + results.sales.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 text-center">
        <div
          className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <Search className="w-5 h-5 text-emerald-600 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, customers, suppliers, receipts..."
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white rounded border border-slate-200">
              ESC
            </kbd>
          </div>

          {/* Search Results Area */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-4">
            {!query.trim() ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <div className="flex items-center justify-center gap-2 mb-2 text-slate-500 font-semibold">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Popular quick shortcuts</span>
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap mt-3">
                  <button onClick={() => handleSelect('/sales/pos')} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">POS Terminal</button>
                  <button onClick={() => handleSelect('/products')} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">Product Catalog</button>
                  <button onClick={() => handleSelect('/inventory')} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">Stock In / Out</button>
                  <button onClick={() => handleSelect('/customers')} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">Customer Debt</button>
                </div>
              </div>
            ) : totalHits === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No matching results found for "<span className="font-semibold text-slate-800">{query}</span>"
              </div>
            ) : (
              <>
                {/* Products */}
                {results.products.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Products</span>
                    </div>
                    {results.products.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect('/products')}
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.sku} • Stock: {p.currentStock} {p.unit}</div>
                        </div>
                        <div className="text-xs font-bold text-emerald-700">{formatCurrency(p.sellingPrice)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Customers */}
                {results.customers.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-sky-600" />
                      <span>Customers</span>
                    </div>
                    {results.customers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => handleSelect('/customers')}
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">{c.name}</div>
                          <div className="text-[10px] text-slate-400">{c.phone} • {c.location}</div>
                        </div>
                        <div className="text-xs font-semibold text-slate-600">Debt: {formatCurrency(c.outstandingBalance)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suppliers */}
                {results.suppliers.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Suppliers</span>
                    </div>
                    {results.suppliers.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelect('/suppliers')}
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">{s.name}</div>
                          <div className="text-[10px] text-slate-400">{s.category} • {s.phone}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Sales */}
                {results.sales.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sales & Receipts</span>
                    </div>
                    {results.sales.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelect('/sales')}
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">{s.receiptNumber} — {s.customerName}</div>
                          <div className="text-[10px] text-slate-400">{s.paymentMethod} • {s.date.slice(0, 10)}</div>
                        </div>
                        <div className="text-xs font-bold text-slate-900">{formatCurrency(s.total)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;

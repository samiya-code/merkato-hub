import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Minus,
  Trash2,
  Scan,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Tag,
  User,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { salesService } from '../../services/salesService';
import { customerService } from '../../services/customerService';
import { formatCurrency, calculateVat } from '../../utils/currency';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ReceiptModal from '../../components/sales/ReceiptModal';
import BarcodeScannerModal from '../../components/sales/BarcodeScannerModal';

export const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Telebirr'); // 'Cash' | 'Telebirr' | 'CBE Birr' | 'Card'
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('#9717');
  
  // Modals
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const [prods, cats, custs] = await Promise.all([
      productService.getProducts(),
      productService.getCategories(),
      customerService.getCustomers(),
    ]);
    setProducts(prods);
    setCategories(cats);
    setCustomers(custs);
  };

  const handleAddToCart = (product) => {
    if (product.currentStock <= 0) {
      toast.warning('Out of Stock', `${product.name} is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          toast.warning('Stock Limit', `Only ${product.currentStock} units available.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.currentStock) {
              toast.warning('Stock Limit', `Maximum available stock is ${item.currentStock}.`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Calculations
  const grossSubtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const discountAmount = (grossSubtotal * discountPercent) / 100;
  const netSubtotal = grossSubtotal - discountAmount;
  // Ethiopian 15% VAT included in gross calculation or added
  const vatAmount = calculateVat(netSubtotal, 0.15);
  const grandTotal = netSubtotal + vatAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.warning('Empty Cart', 'Add at least one product to checkout.');
      return;
    }

    setIsProcessing(true);
    try {
      const custObj = customers.find((c) => c.id === selectedCustomer);
      const salePayload = {
        customerId: custObj ? custObj.id : null,
        customerName: custObj ? custObj.name : 'Walk-in Customer',
        cashierName: 'Abebe Bikila',
        paymentMethod,
        subtotal: netSubtotal,
        tax: vatAmount,
        discount: discountAmount,
        total: grandTotal,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.sellingPrice,
          quantity: item.quantity,
          total: item.sellingPrice * item.quantity,
        })),
      };

      const result = await salesService.createSale(salePayload);
      setCompletedSale(result);
      setReceiptModalOpen(true);
      toast.success('Sale Completed!', `Receipt ${result.receiptNumber} generated.`);
      
      // Reset cart and reload products to reflect decreased stock
      setCart([]);
      setDiscountPercent(0);
      setOrderNumber(`#${Math.floor(Math.random() * 9000 + 1000)}`);
      loadInitialData();
    } catch (err) {
      toast.error('Checkout Error', err.message || 'Unable to process checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Sales & POS</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your storefront operations and track financial growth.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScannerModalOpen(true)}
            icon={Scan}
          >
            Barcode Scanner
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sales')}
            icon={Tag}
          >
            Sales History
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          className="pb-2.5 text-xs font-bold border-b-2 border-emerald-600 text-emerald-700 flex items-center gap-1.5"
        >
          <Banknote className="w-4 h-4" />
          <span>Terminal Interface (POS)</span>
        </button>
        <button
          onClick={() => navigate('/sales')}
          className="pb-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
        >
          <span>Sales Insights & Tracking</span>
        </button>
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Search, Category Pills, Product Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Scanner Bar */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-colors shadow-2xs"
              />
            </div>
            <button
              onClick={() => setScannerModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
            >
              <Scan className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Scan</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid Matching Visily Page 3 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const inStock = p.currentStock;
              const isLow = inStock <= p.minStock && inStock > 0;
              const isOut = inStock <= 0;

              return (
                <div
                  key={p.id}
                  onClick={() => handleAddToCart(p)}
                  className="group bg-white rounded-xl border border-slate-200/80 p-3 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden select-none"
                >
                  {/* Stock Pill Badge at Top */}
                  <div className="flex justify-center mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOut
                          ? 'bg-rose-100 text-rose-700'
                          : isLow
                          ? 'bg-rose-100 text-rose-800'
                          : inStock < 40
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isOut ? 'Out of stock' : `${inStock} in stock`}
                    </span>
                  </div>

                  {/* Product Image / Icon */}
                  <div className="w-16 h-16 mx-auto my-1 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-7 h-7 text-slate-300" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="text-center mt-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-emerald-700">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.category}</p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-800">
                      {formatCurrency(p.sellingPrice)}
                    </span>
                    <button
                      type="button"
                      disabled={isOut}
                      className="w-6 h-6 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white flex items-center justify-center text-xs font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order / Cart (5 Cols Matching Visily Page 3) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Current Order</h3>
            </div>
            <span className="font-mono text-xs font-bold text-slate-500">{orderNumber}</span>
          </div>

          {/* Customer Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Customer (Optional)
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 outline-none cursor-pointer focus:border-emerald-600"
            >
              <option value="">Walk-in Customer (Standard Retail)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.phone} (Debt: {formatCurrency(c.outstandingBalance)})
                </option>
              ))}
            </select>
          </div>

          {/* Cart Items List */}
          <div className="min-h-[160px] max-h-[220px] overflow-y-auto space-y-2 pr-1">
            {cart.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-2">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Your cart is empty.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Select products to start an order.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs"
                >
                  <div className="flex-1 pr-2 truncate">
                    <p className="font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {formatCurrency(item.sellingPrice)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-20 text-right font-bold text-slate-900">
                    {formatCurrency(item.sellingPrice * item.quantity)}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pricing Totals */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-medium text-slate-800">{formatCurrency(grossSubtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (VAT 15%):</span>
              <span className="font-medium text-slate-800">{formatCurrency(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span className="text-lg text-emerald-800">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Payment Method Selector Matching Page 3 (Cash, Telebirr, Card) */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Cash', label: 'Cash', icon: Banknote },
                { id: 'Telebirr', label: 'Telebirr', icon: Smartphone },
                { id: 'Card', label: 'Card / CBE', icon: CreditCard },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSel = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all ${
                      isSel
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSel ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className="text-[11px]">{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pay Now Button Matching Visily Page 3 */}
          <button
            type="button"
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCheckout}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{isProcessing ? 'Processing Transaction...' : 'Pay Now'}</span>
            {!isProcessing && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Receipt Modal Preview */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        sale={completedSale}
      />

      {/* Barcode Scanner Simulator Modal */}
      <BarcodeScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        onScanProduct={handleAddToCart}
        products={products}
      />
    </div>
  );
};

export default POSPage;

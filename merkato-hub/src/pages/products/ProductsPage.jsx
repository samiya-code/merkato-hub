import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  XCircle,
  Coins,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Boxes,
  Eye,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { productService, inventoryService } from '../../services/productService';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Dropdown, { DropdownItem } from '../../components/ui/Dropdown';
import Pagination from '../../components/ui/Pagination';
import ProductModal from '../../components/products/ProductModal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import LoadingState from '../../components/ui/LoadingState';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'stock' | 'price'
  
  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (prod) => {
    setSelectedProduct(prod);
    setProductModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setProductModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await productService.deleteProduct(productToDelete.id);
      toast.success('Deleted', `${productToDelete.name} has been removed.`);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch {
      toast.error('Error', 'Unable to delete product.');
    }
  };

  // Metrics
  const totalProductsCount = products.length;
  const lowStockCount = products.filter((p) => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.status === 'Out of Stock').length;
  const totalInventoryValue = products.reduce((acc, p) => acc + p.currentStock * p.purchasePrice, 0);

  // Tabs
  const tabs = [
    { id: 'all', label: 'All Products', count: totalProductsCount },
    { id: 'low', label: 'Low Stock', count: lowStockCount, countVariant: 'warning' },
    { id: 'out', label: 'Out of Stock', count: outOfStockCount, countVariant: 'danger' },
    { id: 'categories', label: 'Categories' },
  ];

  // Filtering
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'low' && p.status !== 'Low Stock') return false;
    if (activeTab === 'out' && p.status !== 'Out of Stock') return false;
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (
      search &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.sku.toLowerCase().includes(search.toLowerCase()) &&
      !p.category.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Product & Inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your catalogue, track stock levels, and optimize procurement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={Download}>
            Export
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddNew} icon={Plus}>
            Add New Product
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards Matching Visily Page 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={String(totalProductsCount)}
          change="+12 vs last month"
          isPositive={true}
          icon={Package}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Low Stock Items"
          value={String(lowStockCount)}
          change="-2 vs last month"
          isPositive={false}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Out of Stock"
          value={String(outOfStockCount)}
          change="+1 vs last month"
          isPositive={false}
          icon={XCircle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(totalInventoryValue, { decimals: 0 })}
          change="+5.4% vs last month"
          isPositive={true}
          icon={Coins}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <button
            type="button"
            className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600"
            title="Filter"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Table Matching Visily Page 4 */}
      {isLoading ? (
        <LoadingState message="Loading catalog inventory..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-4">
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Item</TableHead>
                <TableHead>Product Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead className="text-right">Price (ETB)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => {
                const stockPercent = Math.min(100, Math.round((p.currentStock / (p.maxStock || 100)) * 100));

                return (
                  <TableRow key={p.id}>
                    <TableCell className="w-14">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-medium">
                      {p.category}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-500">
                      {p.sku}
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className={p.currentStock <= p.minStock ? 'text-amber-700' : 'text-slate-800'}>
                          {p.currentStock} {p.unit}s
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">Min: {p.minStock}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            p.currentStock <= 0
                              ? 'bg-rose-500'
                              : p.currentStock <= p.minStock
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                          }`}
                          style={{ width: `${Math.max(5, stockPercent)}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-black text-slate-900 text-xs">
                      {formatCurrency(p.sellingPrice, { showSymbol: false })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'In Stock' ? 'success' : p.status === 'Low Stock' ? 'warning' : 'danger'}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dropdown>
                        <DropdownItem icon={Edit2} onClick={() => handleEdit(p)}>
                          Edit Product
                        </DropdownItem>
                        <DropdownItem icon={Boxes} onClick={() => navigate('/inventory')}>
                          Adjust Stock
                        </DropdownItem>
                        <DropdownItem
                          icon={Trash2}
                          danger
                          onClick={() => {
                            setProductToDelete(p);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            pageSize={10}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Bottom Section: Recent Movements & Storage Capacity Matching Page 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Movements (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Movements</h3>
            <button
              onClick={() => navigate('/inventory/history')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View Log
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { type: 'IN', prod: 'Yirgacheffe Coffee', ref: 'Ref: PO-9842', amt: '+50', time: '10 mins ago', color: 'emerald' },
              { type: 'OUT', prod: 'Ceramic Set', ref: 'Ref: SALE-8821', amt: '-2', time: '1 hour ago', color: 'rose' },
              { type: 'ADJ', prod: 'Organic Honey', ref: 'Ref: Stocktake', amt: '-1', time: '3 hours ago', color: 'amber' },
              { type: 'IN', prod: 'Berbere Spice', ref: 'Ref: PO-9840', amt: '+120', time: '5 hours ago', color: 'emerald' },
            ].map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      m.type === 'IN'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.type === 'OUT'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {m.type}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">{m.prod}</p>
                    <p className="text-[10px] text-slate-400">{m.ref}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-black ${m.amt.startsWith('+') ? 'text-emerald-700' : 'text-slate-800'}`}>
                    {m.amt}
                  </span>
                  <p className="text-[10px] text-slate-400">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Capacity Circular Gauge (5 Cols Matching Page 4) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Storage Capacity</h3>

          <div className="py-4 text-center">
            {/* 75% Circular Ring Simulation */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-600"
                  strokeDasharray="75, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900">75%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Full</span>
              </div>
            </div>

            <p className="font-bold text-slate-900 text-xs mt-3">Merkato Main Warehouse</p>
            <p className="text-[11px] text-slate-500">Section A & B at high capacity</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Available Space:</span>
            <span className="font-bold text-slate-800">1,240 cu.ft</span>
          </div>

          <button
            onClick={() => navigate('/inventory')}
            className="mt-3 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Manage Storage Units
          </button>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={selectedProduct}
        onSaved={loadProducts}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to remove ${productToDelete?.name}? This will remove it from the catalog.`}
        confirmText="Delete Product"
      />
    </div>
  );
};

export default ProductsPage;

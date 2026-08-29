import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  AlertTriangle,
  Coins,
  Search,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { productService, inventoryService } from '../../services/productService';
import { formatCurrency } from '../../utils/currency';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import StockActionModal from '../../components/inventory/StockActionModal';
import LoadingState from '../../components/ui/LoadingState';

export const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prods, sum] = await Promise.all([
        productService.getProducts(),
        inventoryService.getInventorySummary(),
      ]);
      setProducts(prods);
      setSummary(sum);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track warehouse stock levels, low-stock reorders, and stock movements.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/inventory/history')}
            icon={History}
          >
            Movement Log
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setStockModalOpen(true)}
            icon={Plus}
          >
            Adjust Stock
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Stock Value"
          value={summary ? formatCurrency(summary.totalValue, { decimals: 0 }) : 'ETB 452,400'}
          change="+5.4% MTD"
          isPositive={true}
          icon={Coins}
        />
        <StatCard
          title="Catalog SKUs"
          value={summary ? String(summary.totalProducts) : '12'}
          description="Active tracked items"
          icon={Boxes}
        />
        <StatCard
          title="Low Stock Reorders"
          value={summary ? String(summary.lowStockItems) : '2'}
          description="Items below minimum"
          isPositive={false}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Storage Utilization"
          value="75% Full"
          description="Merkato Main Warehouse"
          icon={Boxes}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 font-semibold">
            {filtered.length} products listed
          </span>
        </div>

        {isLoading ? (
          <LoadingState message="Loading inventory..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Min Reorder</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valuation (Cost)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-bold text-slate-900 text-xs">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{p.sku}</TableCell>
                  <TableCell className="text-xs text-slate-600">{p.category}</TableCell>
                  <TableCell className="text-center font-extrabold text-slate-900 text-xs">
                    {p.currentStock} {p.unit}s
                  </TableCell>
                  <TableCell className="text-center text-xs text-slate-500 font-medium">
                    {p.minStock} {p.unit}s
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'In Stock' ? 'success' : p.status === 'Low Stock' ? 'warning' : 'danger'}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 text-xs">
                    {formatCurrency(p.currentStock * p.purchasePrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => setStockModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      Adjust
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <StockActionModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        products={products}
        onCompleted={loadData}
      />
    </div>
  );
};

export default InventoryPage;

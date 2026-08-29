import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Plus,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  DollarSign,
  PackageCheck,
} from 'lucide-react';
import { purchaseService } from '../../services/purchaseService';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import PurchaseOrderModal from '../../components/purchases/PurchaseOrderModal';
import LoadingState from '../../components/ui/LoadingState';

export const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const data = await purchaseService.getPurchases();
      setPurchases(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceivePO = async (poId) => {
    try {
      await purchaseService.receivePurchase(poId);
      toast.success('PO Received', `Inventory stock updated for items in ${poId}.`);
      loadPurchases();
    } catch {
      toast.error('Error', 'Unable to receive purchase order.');
    }
  };

  const totalProcurement = purchases.reduce((sum, p) => sum + p.totalAmount, 0);

  const filtered = purchases.filter(
    (p) =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Purchase Orders & Inbound Stock</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Procurement workflow: Supplier → PO → Receive Products → Stock Updated → Settle Balance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={Download}>
            Export Invoices
          </Button>
          <Button variant="primary" size="sm" onClick={() => setPoModalOpen(true)} icon={Plus}>
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Purchases (MTD)"
          value={formatCurrency(totalProcurement, { decimals: 0 })}
          change="+14.5% vs last month"
          isPositive={true}
          icon={Truck}
        />
        <StatCard
          title="Completed Shipments"
          value={String(purchases.filter(p => p.status === 'Received').length)}
          description="Inbound stock reconciled"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Receiving"
          value={String(purchases.filter(p => p.status === 'Pending').length)}
          description="En route to warehouse"
          isPositive={false}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Payment Health"
          value="100% On-Time"
          description="CBE & Telebirr Settlements"
          icon={DollarSign}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PO ID, supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 font-semibold">{filtered.length} POs recorded</span>
        </div>

        {isLoading ? (
          <LoadingState message="Loading purchase orders..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Items Count</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Shipment Status</TableHead>
                <TableHead className="text-right">Total (ETB)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-mono font-bold text-slate-900 text-xs">{po.id}</TableCell>
                  <TableCell className="font-bold text-slate-800 text-xs">{po.supplierName}</TableCell>
                  <TableCell className="text-xs text-slate-500">{po.orderDate}</TableCell>
                  <TableCell className="text-xs text-slate-700 font-medium">
                    {po.items?.length || 1} line item(s)
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-semibold text-slate-700">
                      {po.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={po.status === 'Received' ? 'success' : 'warning'}>
                      {po.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-black text-slate-900 text-xs">
                    {formatCurrency(po.totalAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {po.status === 'Pending' ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleReceivePO(po.id)}
                        icon={PackageCheck}
                      >
                        Receive Stock
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Stock Updated
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <PurchaseOrderModal
        isOpen={poModalOpen}
        onClose={() => setPoModalOpen(false)}
        onCreated={loadPurchases}
      />
    </div>
  );
};

export default PurchasesPage;

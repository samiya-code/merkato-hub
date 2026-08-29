import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Download,
  Filter,
  Plus,
  Receipt,
  Printer,
  Eye,
  Calendar,
} from 'lucide-react';
import { salesService } from '../../services/salesService';
import { formatCurrency, formatDateTime } from '../../utils/currency';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import ReceiptModal from '../../components/sales/ReceiptModal';
import LoadingState from '../../components/ui/LoadingState';

export const SalesHistoryPage = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const data = await salesService.getSales();
      setSales(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReceipt = (sale) => {
    setSelectedSale(sale);
    setReceiptOpen(true);
  };

  const filteredSales = sales.filter(
    (s) =>
      s.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.paymentMethod.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Sales History & Transactions</h1>
          <p className="text-xs text-slate-500 mt-0.5">Audit orders, cashier receipts, and customer settlements.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={Download}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/sales/pos')} icon={Plus}>
            New POS Sale
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by receipt #, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold w-full sm:w-auto justify-end">
          <span>Total Transactions: <strong className="text-slate-800">{filteredSales.length}</strong></span>
        </div>
      </div>

      {/* Sales Table */}
      {isLoading ? (
        <LoadingState message="Loading sales transactions..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-4">
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Receipt #</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-bold text-slate-900 text-xs">
                    {sale.receiptNumber}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {sale.date.replace('T', ' ').slice(0, 16)}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-700">
                    {sale.customerName}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {sale.cashierName}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">
                      {sale.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sale.status === 'Completed' ? 'success' : 'warning'}>
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-black text-slate-900 text-xs">
                    {formatCurrency(sale.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleViewReceipt(sale)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                      title="View & Print Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Receipt</span>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredSales.length}
            pageSize={10}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        sale={selectedSale}
      />
    </div>
  );
};

export default SalesHistoryPage;

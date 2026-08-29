import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Search,
  Filter,
  Download,
  Calendar,
  Phone,
  User,
} from 'lucide-react';
import { customerService } from '../../services/customerService';
import { formatCurrency } from '../../utils/currency';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import RecordPaymentModal from '../../components/customers/RecordPaymentModal';
import LoadingState from '../../components/ui/LoadingState';

export const CustomerDebtPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [paymentCustomer, setPaymentCustomer] = useState(null);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const debtors = customers.filter(c => c.outstandingBalance > 0);
  const totalDebt = debtors.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const overdueDebtors = debtors.filter(c => c.dueDate && new Date(c.dueDate) < new Date());

  const handleRecordPayment = (c) => {
    setPaymentCustomer(c);
    setRecordPaymentOpen(true);
  };

  const filtered = customers.filter(c => {
    if (filterStatus === 'debtors' && c.outstandingBalance <= 0) return false;
    if (filterStatus === 'overdue' && (!c.dueDate || new Date(c.dueDate) >= new Date() || c.outstandingBalance <= 0)) return false;
    if (filterStatus === 'settled' && c.outstandingBalance > 0) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.phone.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Credit & Debt Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor client credit balances, overdue settlements, and record Telebirr/CBE payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={Download}>
            Export Statement
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/sales/pos')}>
            New Credit Sale
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Outstanding Debt"
          value={formatCurrency(totalDebt, { decimals: 0 })}
          description="Receivables across all accounts"
          isPositive={false}
          icon={CreditCard}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <StatCard
          title="Clients with Active Debt"
          value={String(debtors.length)}
          description="Accounts with credit balance"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Overdue Accounts"
          value={String(overdueDebtors.length)}
          description="Exceeded agreed repayment date"
          isPositive={false}
          icon={Clock}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <StatCard
          title="Total Credit Limit"
          value={formatCurrency(customers.reduce((acc, c) => acc + (c.creditLimit || 0), 0), { decimals: 0 })}
          description="Authorized credit facility"
          icon={CheckCircle2}
        />
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Accounts' },
              { id: 'debtors', label: `Outstanding (${debtors.length})` },
              { id: 'overdue', label: `Overdue (${overdueDebtors.length})` },
              { id: 'settled', label: 'Settled (0 ETB)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  filterStatus === tab.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search debtor name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Loading debt ledger..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Customer</TableHead>
                <TableHead>Phone / Contact</TableHead>
                <TableHead className="text-right">Credit Limit</TableHead>
                <TableHead className="text-right">Total Purchases</TableHead>
                <TableHead className="text-right">Outstanding Debt</TableHead>
                <TableHead>Payment Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const isOverdue = c.dueDate && new Date(c.dueDate) < new Date() && c.outstandingBalance > 0;

                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.id}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-medium">
                      {c.phone}
                    </TableCell>
                    <TableCell className="text-right text-xs font-semibold text-slate-700">
                      {formatCurrency(c.creditLimit || 10000)}
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-slate-900">
                      {formatCurrency(c.totalPurchases)}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {c.outstandingBalance > 0 ? (
                        <span className="font-black text-rose-600">
                          {formatCurrency(c.outstandingBalance)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">0.00 ETB</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {c.dueDate ? (
                        <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                          {c.dueDate} {isOverdue && '(Overdue)'}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isOverdue ? 'danger' : c.outstandingBalance > 0 ? 'warning' : 'success'}>
                        {isOverdue ? 'Overdue' : c.outstandingBalance > 0 ? 'Unpaid' : 'Settled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {c.outstandingBalance > 0 ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleRecordPayment(c)}
                          icon={DollarSign}
                        >
                          Record Payment
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Clear</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <RecordPaymentModal
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        customer={paymentCustomer}
        onCompleted={loadCustomers}
      />
    </div>
  );
};

export default CustomerDebtPage;

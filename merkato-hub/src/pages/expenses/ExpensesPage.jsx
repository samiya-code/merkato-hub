import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
  Download,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Edit2,
  Calendar,
  FileText,
  Building2,
  ShoppingBag,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { expenseService } from '../../services/expenseService';
import { reportService } from '../../services/reportService';
import { purchaseService } from '../../services/purchaseService';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import ExpenseModal from '../../components/expenses/ExpenseModal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import LoadingState from '../../components/ui/LoadingState';

export const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [finReport, setFinReport] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [expList, report] = await Promise.all([
        expenseService.getExpenses(),
        reportService.getFinancialReport(),
      ]);
      setExpenses(expList);
      setFinReport(report);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await expenseService.deleteExpense(expenseToDelete.id);
      toast.success('Deleted', 'Expense record removed.');
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
      loadData();
    } catch {
      toast.error('Error', 'Unable to delete expense.');
    }
  };

  const cashFlowData = [
    { month: 'Jan', income: 42000, expenses: 28000 },
    { month: 'Feb', income: 48000, expenses: 31000 },
    { month: 'Mar', income: 44000, expenses: 29000 },
    { month: 'Apr', income: 58000, expenses: 36000 },
    { month: 'May', income: 52000, expenses: 33000 },
    { month: 'Jun', income: 74000, expenses: 41000 },
  ];

  const expenseAllocationData = [
    { name: 'Inventory', value: 53.2, color: '#059669' },
    { name: 'Rent & Utilities', value: 13.6, color: '#f59e0b' },
    { name: 'Salaries', value: 19.1, color: '#0284c7' },
    { name: 'Marketing', value: 5.1, color: '#8b5cf6' },
    { name: 'Logistics', value: 8.9, color: '#10b981' },
  ];

  const recentTransactions = [
    { id: 'PUR-8821', entity: 'Habesha Textiles PLC', type: 'Bank Transfer (CBE)', date: '2026-08-20', amount: 145000.00, status: 'Completed' },
    { id: 'PUR-8822', entity: 'Abyssinia Electronics', type: 'Credit / Telebirr', date: '2026-08-22', amount: 89000.00, status: 'Pending' },
    { id: 'PUR-8823', entity: 'Nile Logistics Ltd', type: 'Cash', date: '2026-08-24', amount: 32500.00, status: 'Completed' },
    { id: 'PAY-561', entity: 'Zemen Supermarket', type: 'Telebirr', date: '2026-08-28', amount: 42000.00, status: 'Received' },
    { id: 'PAY-562', entity: 'Tinsae Boutique', type: 'CBE Birr', date: '2026-08-28', amount: 12500.00, status: 'Received' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Financial Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your business liquidity, manage supply chain payments, and monitor operational overheads across your Ethiopian SME network.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={Download}>
            Export Report
          </Button>
          <Button variant="primary" size="sm" onClick={() => setExpenseModalOpen(true)} icon={Plus}>
            Add Transaction
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards Matching Visily Page 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Liquidity"
          value="2,840,500 ETB"
          change="+12.4% vs last month"
          isPositive={true}
          icon={DollarSign}
        />
        <StatCard
          title="Monthly Income"
          value="720,000 ETB"
          change="+8.2% vs last month"
          isPositive={true}
          icon={TrendingUp}
        />
        <StatCard
          title="Operational Expenses"
          value="450,000 ETB"
          change="+5.1% vs last month"
          isPositive={false}
          icon={TrendingDown}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <StatCard
          title="Pending Invoices"
          value="185,000 ETB"
          change="-2.4% vs last month"
          isPositive={false}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          onClick={() => navigate('/invoices')}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Financial Overview
        </button>
        <button
          onClick={() => navigate('/purchases')}
          className="pb-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors"
        >
          Purchases
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'expenses'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Operational Expenses ({expenses.length})
        </button>
        <button
          onClick={() => navigate('/payments')}
          className="pb-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors"
        >
          Incoming Payments
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Charts Grid: Cash Flow Trends + Expense Allocation Matching Visily Page 6 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cash Flow Trends Chart (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cash Flow Trends</h3>
                  <p className="text-xs text-slate-500">Monthly comparison of revenue vs. expenditures (ETB)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span className="text-slate-600">Income</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-slate-600">Expenses</span>
                  </div>
                </div>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip formatter={(v) => [formatCurrency(v), '']} />
                    <Area type="monotone" dataKey="income" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInc)" />
                    <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Allocation Donut Chart (1 Col) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Expense Allocation</h3>
                <p className="text-xs text-slate-500">Major spending categories this quarter</p>
              </div>

              <div className="h-44 my-2 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {expenseAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                {expenseAllocationData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 text-[11px]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions Table Matching Visily Page 6 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
                <p className="text-xs text-slate-500">Latest financial activities across all accounts</p>
              </div>
              <button
                onClick={() => setActiveTab('expenses')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View All Transactions ⇄
              </button>
            </div>

            <Table>
              <TableHeader>
                <TableRow hover={false}>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Entity / Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount (ETB)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono font-bold text-slate-900 text-xs">{tx.id}</TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900 text-xs">{tx.entity}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{tx.type}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{tx.date}</TableCell>
                    <TableCell className="text-right font-black text-slate-900 text-xs">
                      {formatCurrency(tx.amount, { showSymbol: false })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.status === 'Completed' || tx.status === 'Received' ? 'success' : 'warning'}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        /* Operational Expenses Full List */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900">Operational Expenses Log</h3>
            <Button variant="primary" size="sm" onClick={() => setExpenseModalOpen(true)} icon={Plus}>
              New Expense
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead className="text-right">Amount (ETB)</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs text-slate-400">{e.id}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-bold text-slate-800">
                      {e.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-800 max-w-xs truncate">
                    {e.description}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{e.date}</TableCell>
                  <TableCell className="text-xs text-slate-600 font-semibold">{e.paymentMethod}</TableCell>
                  <TableCell className="text-xs text-slate-500">{e.createdBy}</TableCell>
                  <TableCell className="text-right font-black text-rose-600 text-xs">
                    {formatCurrency(e.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => {
                        setExpenseToDelete(e);
                        setDeleteDialogOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Expense Modal */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSaved={loadData}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Expense Record"
        message={`Are you sure you want to remove ${expenseToDelete?.description}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default ExpensesPage;

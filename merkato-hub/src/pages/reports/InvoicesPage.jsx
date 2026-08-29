import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Plus,
  Download,
  Printer,
  Mail,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/currency';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const InvoicesPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const invoiceData = [
    { id: 'INV-2026-001', customer: 'Abeba Flowers PLC', date: '2026-08-20', amount: 12450.00, status: 'Paid' },
    { id: 'INV-2026-002', customer: 'Bole Café & Lounge', date: '2026-08-21', amount: 4200.00, status: 'Pending' },
    { id: 'INV-2026-003', customer: 'Teklehaimanot Hospital', date: '2026-08-22', amount: 28900.00, status: 'Paid' },
    { id: 'INV-2026-004', customer: 'Habesha Cement Share Co.', date: '2026-08-22', amount: 45000.00, status: 'Overdue' },
  ];

  const chartData = [
    { month: 'Jan', revenue: 42000, expenses: 26000 },
    { month: 'Feb', revenue: 48000, expenses: 29000 },
    { month: 'Mar', revenue: 44000, expenses: 27000 },
    { month: 'Apr', revenue: 58000, expenses: 34000 },
    { month: 'May', revenue: 52000, expenses: 31000 },
    { month: 'Jun', revenue: 74000, expenses: 39000 },
  ];

  const recentActivity = [
    { type: 'Invoice #INV-882', desc: '2 mins ago', amount: '+4,500 ETB', status: 'SUCCESS' },
    { type: 'Expense #EXP-102', desc: '1 hour ago', amount: '-1,200 ETB', status: 'PENDING' },
    { type: 'Payment #PAY-552', desc: '3 hours ago', amount: '+12,000 ETB', status: 'SUCCESS' },
    { type: 'Invoice #INV-881', desc: '5 hours ago', amount: '+2,800 ETB', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Invoices & Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">Generate professional billing and monitor your SME's performance in ETB.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={Download}>
            Export Reports
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/sales/pos')} icon={Plus}>
            Create New Invoice
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards Matching Visily Page 7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue (MTD)"
          value="156,420.00 ETB"
          change="+12.5%"
          isPositive={true}
          icon={TrendingUp}
        />
        <StatCard
          title="Unpaid Invoices"
          value="42,800.00 ETB"
          change="-2.4%"
          isPositive={false}
          icon={FileText}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Average Sale Value"
          value="3,450.00 ETB"
          change="+5.1%"
          isPositive={true}
          icon={DollarSign}
        />
        <StatCard
          title="Active Customers"
          value="128"
          change="+8 vs last month"
          isPositive={true}
          icon={Users}
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
          Business Overview
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'invoices'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Invoices History
        </button>
        <button
          onClick={() => navigate('/reports')}
          className="pb-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors"
        >
          Detailed Analytics
        </button>
      </div>

      {/* Main Charts + Recent Activity Grid Matching Visily Page 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue vs Expenses</h3>
              <p className="text-xs text-slate-500">Monthly growth performance in Ethiopian Birr</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              Last 6 Months
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev7" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExp7" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => [formatCurrency(v), '']} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev7)" />
                <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorExp7)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed (1 Col Matching Visily Page 7) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            <p className="text-xs text-slate-500 mb-4">Latest financial transactions</p>

            <div className="space-y-3 text-xs">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${act.amount.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{act.type}</p>
                      <p className="text-[10px] text-slate-400">{act.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900">{act.amount}</span>
                    <p className="text-[9px] font-bold text-emerald-600">{act.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/sales')}
            className="mt-4 text-xs font-semibold text-emerald-600 hover:text-emerald-700 text-center"
          >
            View All Activity ›
          </button>
        </div>
      </div>

      {/* Pending Invoices Table Matching Visily Page 7 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pending & Issued Invoices</h3>
            <p className="text-xs text-slate-500">Payments requiring your attention and client billing receipts</p>
          </div>
          <button
            onClick={() => navigate('/payments')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Manage All
          </button>
        </div>

        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead className="text-right">Amount (ETB)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceData.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono font-bold text-slate-900 text-xs">{inv.id}</TableCell>
                <TableCell className="font-bold text-slate-800 text-xs">{inv.customer}</TableCell>
                <TableCell className="text-xs text-slate-500">{inv.date}</TableCell>
                <TableCell className="text-right font-black text-slate-900 text-xs">
                  {formatCurrency(inv.amount, { showSymbol: false })}
                </TableCell>
                <TableCell>
                  <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'warning' : 'danger'}>
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 text-slate-400">
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => alert(`Sent invoice copy to ${inv.customer}`)}
                      className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Email Invoice"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoicesPage;

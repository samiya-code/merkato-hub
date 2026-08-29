import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Boxes,
  ArrowUpRight,
  TrendingUp,
  Download,
  Filter,
  Plus,
  ArrowRight,
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
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
import { reportService } from '../../services/reportService';
import { salesService } from '../../services/salesService';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatCompactNumber } from '../../utils/currency';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DatePicker from '../../components/ui/DatePicker';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState('This Month');
  const [metrics, setMetrics] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashMetrics, salesList] = await Promise.all([
          reportService.getDashboardMetrics(),
          salesService.getSales(),
        ]);
        setMetrics(dashMetrics);
        setRecentSales(salesList.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const financialData = metrics?.financialTrends || [
    { month: 'Jan', revenue: 42000, expenses: 28000 },
    { month: 'Feb', revenue: 48000, expenses: 31000 },
    { month: 'Mar', revenue: 44000, expenses: 29000 },
    { month: 'Apr', revenue: 58000, expenses: 36000 },
    { month: 'May', revenue: 52000, expenses: 33000 },
    { month: 'Jun', revenue: 74000, expenses: 41000 },
  ];

  const salesDistributionData = metrics?.salesDistribution || [
    { name: 'Electronics', value: 40, color: '#059669' },
    { name: 'Textiles', value: 30, color: '#10b981' },
    { name: 'Food/Agri', value: 20, color: '#f59e0b' },
    { name: 'Industrial', value: 10, color: '#6366f1' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Business Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time performance metrics for MerkatoHub</p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <DatePicker value={dateRange} onChange={setDateRange} />
          
          <button
            type="button"
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="Filter Insights"
          >
            <Filter className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="Export CSV / PDF"
          >
            <Download className="w-4 h-4" />
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/sales/pos')}
            icon={Plus}
          >
            New Sale
          </Button>
        </div>
      </div>

      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-100 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-bold mb-3 border border-emerald-200/60">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Business Growth: +12% this month</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Abebe'}!
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Your commerce dashboard is updated with the latest performance metrics from your branches in Addis Ababa and Hawassa. You have 3 pending invoices that require your attention.
          </p>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <Button variant="primary" size="sm" onClick={() => navigate('/reports')}>
              View Sales Reports
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/inventory')}>
              Manage Inventory
            </Button>
          </div>
        </div>

        {/* Decorative Modern SME 3D Isometric Art Badge */}
        <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2">
          <div className="w-40 h-40 rounded-full bg-emerald-100/50 flex items-center justify-center ring-8 ring-emerald-50">
            <img
              src="https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=300&auto=format&fit=crop&q=80"
              alt="Ethiopian Commerce"
              className="w-32 h-32 rounded-2xl object-cover shadow-lg transform rotate-2 hover:rotate-0 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* 4 Main StatCards Matching Visily Mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={metrics ? formatCurrency(metrics.totalRevenue, { decimals: 0 }) : 'ETB 842,500'}
          change={metrics?.revenueGrowth || '+14.2%'}
          isPositive={true}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          description="Gross revenue across all points of sale"
          onClick={() => navigate('/sales')}
        />

        <StatCard
          title="Daily Sales"
          value={metrics ? String(metrics.dailySalesCount) : '128'}
          change={metrics?.dailySalesGrowth || '+8.4%'}
          isPositive={true}
          icon={ShoppingCart}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          description="Completed transactions today"
          onClick={() => navigate('/sales')}
        />

        <StatCard
          title="Active Customers"
          value={metrics ? metrics.activeCustomers.toLocaleString() : '1,245'}
          change={metrics?.customersGrowth || '-2.1%'}
          isPositive={false}
          icon={Users}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          description="Unique buyers in the last 30 days"
          onClick={() => navigate('/customers')}
        />

        <StatCard
          title="Inventory Value"
          value={metrics ? formatCompactNumber(metrics.inventoryValue) : 'ETB 3.2M'}
          change={metrics?.inventoryGrowth || '+5.0%'}
          isPositive={true}
          icon={Boxes}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          description="Estimated value of current stock"
          onClick={() => navigate('/inventory')}
        />
      </div>

      {/* Charts Grid: Financial Trends + Sales Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Trends Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Financial Trends</h3>
              <p className="text-xs text-slate-500">Monthly comparison of revenue and operational costs (ETB)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-slate-600">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-300" />
                <span className="text-slate-600">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Distribution Donut Chart (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Sales Distribution</h3>
            <p className="text-xs text-slate-500">Top performing product segments</p>
          </div>

          <div className="h-44 my-2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {salesDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-semibold">Total</span>
              <span className="text-sm font-black text-slate-800">100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {salesDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section: Recent Sales + Sales Targets & Inventory Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Sales</h3>
              <p className="text-xs text-slate-500">Latest transactions across all channels</p>
            </div>
            <Link to="/sales" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>ID / Receipt</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.id} onClick={() => navigate('/sales')}>
                  <TableCell className="font-semibold text-slate-900 text-xs">{sale.receiptNumber}</TableCell>
                  <TableCell className="font-medium text-slate-700 text-xs">{sale.customerName}</TableCell>
                  <TableCell className="text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                      {sale.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sale.status === 'Completed' ? 'success' : 'warning'}>
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 text-xs">
                    {formatCurrency(sale.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right Column: Sales Targets + Inventory Insight Box */}
        <div className="space-y-4">
          {/* Sales Targets Progress */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Sales Targets</h3>
            <p className="text-[11px] text-slate-500 mb-4">Progress against Q3 performance objectives</p>

            <div className="space-y-3.5">
              {[
                { name: 'Retail Sales Goal', current: 'ETB 1.2M', target: '2.5M', percent: 48 },
                { name: 'Wholesale Partnership', current: 'ETB 4.1M', target: '5M', percent: 82 },
                { name: 'Customer Acquisition', current: '850', target: '1000', percent: 85 },
              ].map((target) => (
                <div key={target.name}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">{target.name}</span>
                    <span className="text-slate-500">{target.current} / {target.target} ({target.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${target.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Insight Card (Exact style from Visily Page 2) */}
          <div className="rounded-2xl bg-slate-900 text-white p-5 shadow-md relative overflow-hidden border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Inventory Insight</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              High-demand electronics and spices are depleting faster than expected. 12 items are currently below reorder levels.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 bg-slate-800/80 rounded-xl text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Critical</span>
                <p className="font-extrabold text-rose-400 text-sm">12 SKUs</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Pending</span>
                <p className="font-extrabold text-amber-400 text-sm">4 POs</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/inventory')}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold text-center transition-colors"
            >
              Manage Reorders
            </button>
          </div>
        </div>
      </div>

      {/* Live Bottom Indicators Bar Matching Page 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200/80 text-xs text-slate-500">
        <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/70">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-semibold text-slate-800">Stock Reconciliation</span>
            <p className="text-[11px] text-slate-400">Last verified: 2 hours ago</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/70">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="font-semibold text-slate-800">Shift Handover</span>
            <p className="text-[11px] text-slate-400">Scheduled at 06:00 PM</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/70">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
          <div>
            <span className="font-semibold text-slate-800">System Maintenance</span>
            <p className="text-[11px] text-slate-400">Saturday, 02:00 AM EAT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

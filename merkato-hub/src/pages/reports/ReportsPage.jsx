import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  PieChart as PieIcon,
  Package,
  Users,
  Printer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
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
import { formatCurrency } from '../../utils/currency';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import DatePicker from '../../components/ui/DatePicker';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import LoadingState from '../../components/ui/LoadingState';

export const ReportsPage = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [finReport, setFinReport] = useState(null);
  const [dateRange, setDateRange] = useState('This Month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sales, fin] = await Promise.all([
        reportService.getSalesReport(),
        reportService.getFinancialReport(),
      ]);
      setSalesReport(sales);
      setFinReport(fin);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    alert('Exporting Sales & Financial Statement (CSV format)...');
  };

  const paymentColors = ['#059669', '#10b981', '#f59e0b', '#0284c7'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Detailed Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics for Ethiopian business tax audits, daily revenue, and inventory velocity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <DatePicker value={dateRange} onChange={setDateRange} />
          <Button variant="outline" size="sm" onClick={() => window.print()} icon={Printer}>
            Print Report
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportCSV} icon={Download}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Revenue"
          value={finReport ? formatCurrency(finReport.totalRevenue) : 'ETB 184,470'}
          change="+18.2% vs target"
          isPositive={true}
          icon={DollarSign}
        />
        <StatCard
          title="Operating Expenses"
          value={finReport ? formatCurrency(finReport.totalExpenses) : 'ETB 253,900'}
          change="+4.5% vs budget"
          isPositive={false}
          icon={TrendingUp}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <StatCard
          title="Estimated Gross Profit"
          value={finReport ? formatCurrency(finReport.grossProfit) : 'ETB 70,098'}
          change="+14.2%"
          isPositive={true}
          icon={BarChart3}
        />
        <StatCard
          title="Telebirr & CBE Share"
          value="75%"
          description="Cashless transactions"
          icon={PieIcon}
        />
      </div>

      {isLoading ? (
        <LoadingState message="Generating business intelligence reports..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Sales Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Daily Revenue Velocity</h3>
                <p className="text-xs text-slate-500">Day-by-day sales volume (ETB)</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesReport?.dailyTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => [formatCurrency(v), 'Revenue']} />
                  <Bar dataKey="sales" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Payment Channel Breakdown</h3>
              <p className="text-xs text-slate-500 mb-2">Telebirr, CBE Birr, Cash & Bank Transfers</p>
            </div>

            <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesReport?.byPaymentMethod || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="amount"
                  >
                    {salesReport?.byPaymentMethod?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={paymentColors[index % paymentColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [formatCurrency(v), 'Volume']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
              {salesReport?.byPaymentMethod?.map((pm, idx) => (
                <div key={pm.method} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: paymentColors[idx % paymentColors.length] }} />
                    <span className="font-semibold text-slate-700 text-[11px]">{pm.method}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-[11px]">{pm.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

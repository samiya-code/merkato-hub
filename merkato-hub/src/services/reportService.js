/**
 * Report & Notification Services with dynamic real-time aggregation
 */
import { salesService } from './salesService';
import { productService } from './productService';
import { expenseService } from './expenseService';
import { customerService } from './customerService';
import { supplierService } from './supplierService';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications';
import { INITIAL_DASHBOARD_METRICS } from '../data/mockDashboard';

let notificationsStore = [...INITIAL_NOTIFICATIONS];

class ReportService {
  async getDashboardMetrics() {
    try {
      const sales = await salesService.getSales();
      const products = await productService.getProducts();
      const expenses = await expenseService.getExpenses();
      const customers = await customerService.getCustomers();

      const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
      const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
      const inventoryValue = products.reduce((acc, p) => acc + (p.currentStock * p.purchasePrice), 0);
      const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
      const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;
      const outstandingDebt = customers.reduce((acc, c) => acc + (c.outstandingBalance || 0), 0);

      return Promise.resolve({
        totalRevenue,
        revenueGrowth: '+14.2%',
        dailySalesCount: sales.length,
        dailySalesGrowth: '+8.4%',
        activeCustomers: customers.length,
        customersGrowth: '+3.5%',
        inventoryValue,
        inventoryGrowth: '+5.0%',
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        lowStockCount,
        outOfStockCount,
        outstandingDebt,
        financialTrends: INITIAL_DASHBOARD_METRICS.financialTrends,
        salesDistribution: INITIAL_DASHBOARD_METRICS.salesDistribution,
        salesTargets: INITIAL_DASHBOARD_METRICS.salesTargets,
        recentMovements: INITIAL_DASHBOARD_METRICS.recentMovements,
        storageCapacity: INITIAL_DASHBOARD_METRICS.storageCapacity,
      });
    } catch {
      return Promise.resolve(INITIAL_DASHBOARD_METRICS);
    }
  }

  async getFinancialReport() {
    const sales = await salesService.getSales();
    const expenses = await expenseService.getExpenses();
    const customers = await customerService.getCustomers();
    const suppliers = await supplierService.getSuppliers();

    const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const customerDebt = customers.reduce((acc, c) => acc + (c.outstandingBalance || 0), 0);
    const supplierDebt = suppliers.reduce((acc, s) => acc + (s.outstandingBalance || 0), 0);

    return Promise.resolve({
      totalRevenue,
      totalExpenses,
      grossProfit: totalRevenue * 0.38,
      netProfit: totalRevenue - totalExpenses,
      customerDebt,
      supplierDebt,
      totalLiquidity: 2840500,
      monthlyIncome: 720000,
      operationalExpenses: 450000,
      pendingInvoices: 185000,
    });
  }

  async getSalesReport() {
    const sales = await salesService.getSales();
    return Promise.resolve({
      sales,
      dailyTrend: [
        { day: 'Mon', sales: 18200 },
        { day: 'Tue', sales: 24500 },
        { day: 'Wed', sales: 31000 },
        { day: 'Thu', sales: 28400 },
        { day: 'Fri', sales: 42000 },
        { day: 'Sat', sales: 56000 },
        { day: 'Sun', sales: 38000 },
      ],
      byPaymentMethod: [
        { method: 'Telebirr', amount: 345000, percent: 45 },
        { method: 'CBE Birr', amount: 230000, percent: 30 },
        { method: 'Cash', amount: 115000, percent: 15 },
        { method: 'Bank Transfer', amount: 76000, percent: 10 },
      ]
    });
  }
}

class NotificationService {
  async getNotifications() {
    return Promise.resolve([...notificationsStore]);
  }

  async markAsRead(id) {
    const notif = notificationsStore.find(n => n.id === id);
    if (notif) notif.read = true;
    return Promise.resolve({ success: true, notification: notif });
  }

  async markAllAsRead() {
    notificationsStore.forEach(n => { n.read = true; });
    return Promise.resolve({ success: true });
  }

  async clearNotification(id) {
    notificationsStore = notificationsStore.filter(n => n.id !== id);
    return Promise.resolve({ success: true });
  }
}

export const reportService = new ReportService();
export const notificationService = new NotificationService();
export default reportService;

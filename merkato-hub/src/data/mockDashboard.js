/**
 * Initial Dashboard Data & Trend Models
 */

export const INITIAL_DASHBOARD_METRICS = {
  totalRevenue: 842500,
  revenueGrowth: '+14.2%',
  dailySalesCount: 128,
  dailySalesGrowth: '+8.4%',
  activeCustomers: 1245,
  customersGrowth: '-2.1%',
  inventoryValue: 3200000,
  inventoryGrowth: '+5.0%',
  
  // Financial Trends
  financialTrends: [
    { month: 'Jan', revenue: 42000, expenses: 28000 },
    { month: 'Feb', revenue: 48000, expenses: 31000 },
    { month: 'Mar', revenue: 44000, expenses: 29000 },
    { month: 'Apr', revenue: 58000, expenses: 36000 },
    { month: 'May', revenue: 52000, expenses: 33000 },
    { month: 'Jun', revenue: 74000, expenses: 41000 },
  ],

  // Sales Distribution
  salesDistribution: [
    { name: 'Electronics', value: 40, color: '#059669' },
    { name: 'Textiles', value: 30, color: '#10b981' },
    { name: 'Food/Agri', value: 20, color: '#f59e0b' },
    { name: 'Industrial', value: 10, color: '#6366f1' },
  ],

  // Sales Targets
  salesTargets: [
    { name: 'Retail Sales Goal', current: '1.2M', target: '2.5M', percent: 48 },
    { name: 'Wholesale Partnership', current: '4.1M', target: '5M', percent: 82 },
    { name: 'Customer Acquisition', current: '850', target: '1000', percent: 85 },
  ],

  // Recent Stock Movements
  recentMovements: [
    { id: 1, type: 'IN', product: 'Yirgacheffe Coffee', ref: 'PO-9842', amount: '+50', time: '10 mins ago' },
    { id: 2, type: 'OUT', product: 'Ceramic Set', ref: 'SALE-8821', amount: '-2', time: '1 hour ago' },
    { id: 3, type: 'ADJ', product: 'Organic Honey', ref: 'Stocktake', amount: '-1', time: '3 hours ago' },
    { id: 4, type: 'IN', product: 'Berbere Spice', ref: 'PO-9840', amount: '+120', time: '5 hours ago' },
  ],

  // Storage Capacity
  storageCapacity: {
    name: 'Merkato Main Warehouse',
    sections: 'Section A & B at high capacity',
    usedPercentage: 75,
    availableSpace: '1,240 cu.ft',
  }
};

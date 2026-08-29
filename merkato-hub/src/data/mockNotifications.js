/**
 * Realistic Ethiopian SME Notifications & Alerts
 */

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    title: 'Low Stock Alert',
    message: 'Traditional Hand-Woven Scarf (Netela) has reached minimum stock level (12 units remaining).',
    category: 'Inventory',
    type: 'warning',
    timestamp: '10 mins ago',
    read: false,
    link: '/products?status=Low+Stock',
  },
  {
    id: 'NOTIF-002',
    title: 'Overdue Customer Balance',
    message: 'Customer Dagmawi Solomon has an overdue balance of 4,800.00 ETB since Aug 28.',
    category: 'Customers',
    type: 'danger',
    timestamp: '1 hour ago',
    read: false,
    link: '/customers',
  },
  {
    id: 'NOTIF-003',
    title: 'Upcoming Supplier Payment',
    message: 'Tomoca Coffee Roasters invoice payment of 18,500.00 ETB is due in 3 days.',
    category: 'Suppliers',
    type: 'info',
    timestamp: '3 hours ago',
    read: false,
    link: '/suppliers',
  },
  {
    id: 'NOTIF-004',
    title: 'Daily Sales Milestone Reached',
    message: "Today's sales have reached 57,750.00 ETB, surpassing daily target by +18.4%!",
    category: 'Sales',
    type: 'success',
    timestamp: '5 hours ago',
    read: true,
    link: '/reports',
  },
  {
    id: 'NOTIF-005',
    title: 'Expiring Product Notice',
    message: 'Fresh Baked Injera batch expires in 5 days. Consider running a promotional discount.',
    category: 'Inventory',
    type: 'warning',
    timestamp: '1 day ago',
    read: true,
    link: '/inventory',
  },
];

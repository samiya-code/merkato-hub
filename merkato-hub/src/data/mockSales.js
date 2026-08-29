/**
 * Realistic Ethiopian SME Sales and Transactions
 */

export const INITIAL_SALES = [
  {
    id: 'INV-2026-001',
    receiptNumber: 'RCP-9842',
    date: '2026-08-29T09:15:00',
    customerId: 'CUST-1001',
    customerName: 'Tewodros Kassahun',
    cashierName: 'Dawit Yohannes',
    paymentMethod: 'Telebirr',
    subtotal: 10826.09,
    tax: 1623.91, // 15% VAT
    discount: 0,
    total: 12450.00,
    status: 'Completed',
    paymentStatus: 'Paid',
    items: [
      { id: 'PRD-001', name: 'Yirgacheffe Coffee Beans (500g)', price: 450.00, quantity: 10, total: 4500.00 },
      { id: 'PRD-002', name: 'Traditional Hand-Woven Scarf', price: 1200.00, quantity: 5, total: 6000.00 },
      { id: 'PRD-005', name: 'Organic Honey (Sidamo, 1kg)', price: 850.00, quantity: 2, total: 1700.00 },
      { id: 'PRD-007', name: 'Fresh Baked Injera (10pcs)', price: 15.00, quantity: 16.67, total: 250.00 }
    ]
  },
  {
    id: 'INV-2026-002',
    receiptNumber: 'RCP-9841',
    date: '2026-08-29T08:45:00',
    customerId: 'CUST-1006',
    customerName: 'Bole Café & Lounge',
    cashierName: 'Abebe Bikila',
    paymentMethod: 'CBE Birr',
    subtotal: 39391.30,
    tax: 5908.70,
    discount: 0,
    total: 45300.00,
    status: 'Completed',
    paymentStatus: 'Paid',
    items: [
      { id: 'PRD-001', name: 'Yirgacheffe Coffee Beans (500g)', price: 450.00, quantity: 80, total: 36000.00 },
      { id: 'PRD-008', name: 'Habesha Beer (330ml)', price: 45.00, quantity: 200, total: 9000.00 },
      { id: 'PRD-007', name: 'Fresh Baked Injera (10pcs)', price: 15.00, quantity: 20, total: 300.00 }
    ]
  },
  {
    id: 'INV-2026-003',
    receiptNumber: 'RCP-9840',
    date: '2026-08-28T16:30:00',
    customerId: 'CUST-1003',
    customerName: 'Amanuel Gebre',
    cashierName: 'Sara Tadesse',
    paymentMethod: 'Cash',
    subtotal: 7739.13,
    tax: 1160.87,
    discount: 0,
    total: 8900.00,
    status: 'Completed',
    paymentStatus: 'Paid',
    items: [
      { id: 'PRD-003', name: 'Buna Ceramic Coffee Set', price: 3200.00, quantity: 2, total: 6400.00 },
      { id: 'PRD-005', name: 'Organic Honey (Sidamo, 1kg)', price: 850.00, quantity: 2, total: 1700.00 },
      { id: 'PRD-006', name: 'Teff Flour Magna (5kg)', price: 850.00, quantity: 1, total: 850.00 }
    ]
  },
  {
    id: 'INV-2026-004',
    receiptNumber: 'RCP-9839',
    date: '2026-08-28T14:10:00',
    customerId: null,
    customerName: 'Walk-in Customer',
    cashierName: 'Dawit Yohannes',
    paymentMethod: 'Telebirr',
    subtotal: 2713.04,
    tax: 406.96,
    discount: 0,
    total: 3120.00,
    status: 'Completed',
    paymentStatus: 'Paid',
    items: [
      { id: 'PRD-011', name: 'Samsung USB-C Charger', price: 750.00, quantity: 3, total: 2250.00 },
      { id: 'PRD-012', name: 'Black Cumin Oil (250ml)', price: 420.00, quantity: 2, total: 840.00 },
      { id: 'PRD-007', name: 'Fresh Baked Injera (10pcs)', price: 15.00, quantity: 2, total: 30.00 }
    ]
  },
  {
    id: 'INV-2026-005',
    receiptNumber: 'RCP-9838',
    date: '2026-08-28T11:00:00',
    customerId: 'CUST-1005',
    customerName: 'Dagmawi Solomon',
    cashierName: 'Abebe Bikila',
    paymentMethod: 'Bank Transfer (Awash)',
    subtotal: 100000.00,
    tax: 15000.00,
    discount: 0,
    total: 115000.00,
    status: 'Completed',
    paymentStatus: 'Paid',
    items: [
      { id: 'PRD-002', name: 'Traditional Hand-Woven Scarf', price: 1200.00, quantity: 50, total: 60000.00 },
      { id: 'PRD-001', name: 'Yirgacheffe Coffee Beans', price: 450.00, quantity: 100, total: 45000.00 },
      { id: 'PRD-003', name: 'Buna Ceramic Set', price: 3200.00, quantity: 3.125, total: 10000.00 }
    ]
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'EXP-101',
    category: 'Rent',
    description: 'Monthly store lease for Bole Road branch',
    amount: 85000.00,
    date: '2026-08-01',
    paymentMethod: 'Bank Transfer (CBE)',
    receiptUrl: 'https://example.com/receipt-bole-rent.pdf',
    createdBy: 'Abebe Bikila',
    status: 'Approved',
  },
  {
    id: 'EXP-102',
    category: 'Electricity',
    description: 'Ethiopian Electric Utility (EEU) power bill',
    amount: 14200.00,
    date: '2026-08-05',
    paymentMethod: 'Telebirr',
    receiptUrl: 'https://example.com/receipt-eeu.pdf',
    createdBy: 'Sara Tadesse',
    status: 'Approved',
  },
  {
    id: 'EXP-103',
    category: 'Internet',
    description: 'Ethio Telecom Broadband fiber business plan',
    amount: 6800.00,
    date: '2026-08-07',
    paymentMethod: 'Telebirr',
    receiptUrl: 'https://example.com/receipt-telecom.pdf',
    createdBy: 'Sara Tadesse',
    status: 'Approved',
  },
  {
    id: 'EXP-104',
    category: 'Salary',
    description: 'Staff payroll disbursement for mid-month advances',
    amount: 120000.00,
    date: '2026-08-15',
    paymentMethod: 'Bank Transfer (CBE)',
    receiptUrl: null,
    createdBy: 'Abebe Bikila',
    status: 'Approved',
  },
  {
    id: 'EXP-105',
    category: 'Transportation',
    description: 'Fuel and transport for Mercato wholesale deliveries',
    amount: 8500.00,
    date: '2026-08-22',
    paymentMethod: 'Cash',
    receiptUrl: 'https://example.com/receipt-fuel.pdf',
    createdBy: 'Dawit Yohannes',
    status: 'Approved',
  },
  {
    id: 'EXP-106',
    category: 'Marketing',
    description: 'Telegram Channel & TikTok Ethiopian SME promotion',
    amount: 15000.00,
    date: '2026-08-24',
    paymentMethod: 'CBE Birr',
    receiptUrl: null,
    createdBy: 'Sara Tadesse',
    status: 'Approved',
  },
  {
    id: 'EXP-107',
    category: 'Water',
    description: 'Addis Ababa Water & Sewerage Authority (AAWSA) bill',
    amount: 3400.00,
    date: '2026-08-26',
    paymentMethod: 'Telebirr',
    receiptUrl: null,
    createdBy: 'Sara Tadesse',
    status: 'Approved',
  },
];

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Electricity',
  'Water',
  'Internet',
  'Salary',
  'Transportation',
  'Marketing',
  'Supplies',
  'Maintenance',
  'Tax',
  'Other',
];

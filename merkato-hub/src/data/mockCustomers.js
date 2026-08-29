/**
 * Realistic Ethiopian SME Customer Database
 */

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-1001',
    name: 'Tewodros Kassahun',
    email: 'tewodros.k@gmail.com',
    phone: '+251 911 234 567',
    location: 'Bole, Addis Ababa',
    totalPurchases: 45200.00,
    outstandingBalance: 3500.00,
    creditLimit: 15000.00,
    status: 'VIP',
    dueDate: '2026-09-10',
    history: [
      { id: 'INV-001', date: '2026-08-25', amount: 12450.00, paid: 8950.00, status: 'Partially Paid' },
      { id: 'INV-089', date: '2026-08-12', amount: 18200.00, paid: 18200.00, status: 'Paid' },
      { id: 'INV-045', date: '2026-07-28', amount: 14550.00, paid: 14550.00, status: 'Paid' },
    ],
    payments: [
      { id: 'PAY-101', date: '2026-08-25', amount: 8950.00, method: 'Telebirr', ref: 'TB-998242' },
      { id: 'PAY-092', date: '2026-08-12', amount: 18200.00, method: 'CBE Birr', ref: 'CBE-445120' },
    ]
  },
  {
    id: 'CUST-1002',
    name: 'Liya Kebede',
    email: 'liya.marketing@outlook.com',
    phone: '+251 912 888 999',
    location: 'Kazanchis, Addis Ababa',
    totalPurchases: 12850.00,
    outstandingBalance: 0.00,
    creditLimit: 10000.00,
    status: 'Active',
    dueDate: null,
    history: [
      { id: 'INV-102', date: '2026-08-22', amount: 4850.00, paid: 4850.00, status: 'Paid' },
      { id: 'INV-067', date: '2026-08-05', amount: 8000.00, paid: 8000.00, status: 'Paid' },
    ],
    payments: [
      { id: 'PAY-104', date: '2026-08-22', amount: 4850.00, method: 'Telebirr', ref: 'TB-778103' },
    ]
  },
  {
    id: 'CUST-1003',
    name: 'Amanuel Gebre',
    email: 'amanuel.g@gmail.com',
    phone: '+251 911 555 444',
    location: 'Piazza, Addis Ababa',
    totalPurchases: 8400.00,
    outstandingBalance: 2400.00,
    creditLimit: 5000.00,
    status: 'Active',
    dueDate: '2026-09-05',
    history: [
      { id: 'INV-115', date: '2026-08-20', amount: 5400.00, paid: 3000.00, status: 'Partially Paid' },
      { id: 'INV-071', date: '2026-07-15', amount: 3000.00, paid: 3000.00, status: 'Paid' },
    ],
    payments: [
      { id: 'PAY-111', date: '2026-08-20', amount: 3000.00, method: 'Cash', ref: 'CSH-00381' },
    ]
  },
  {
    id: 'CUST-1004',
    name: 'Saba Mengistu',
    email: 'saba.m@ethionet.et',
    phone: '+251 911 111 222',
    location: 'Megenagna, Addis Ababa',
    totalPurchases: 2100.00,
    outstandingBalance: 0.00,
    creditLimit: 3000.00,
    status: 'Inactive',
    dueDate: null,
    history: [
      { id: 'INV-012', date: '2026-06-10', amount: 2100.00, paid: 2100.00, status: 'Paid' },
    ],
    payments: [
      { id: 'PAY-018', date: '2026-06-10', amount: 2100.00, method: 'CBE Birr', ref: 'CBE-112093' },
    ]
  },
  {
    id: 'CUST-1005',
    name: 'Dagmawi Solomon',
    email: 'dagm.solomon@gmail.com',
    phone: '+251 922 333 444',
    location: 'Old Airport, Addis Ababa',
    totalPurchases: 28600.00,
    outstandingBalance: 4800.00,
    creditLimit: 20000.00,
    status: 'Active',
    dueDate: '2026-08-28', // Overdue
    history: [
      { id: 'INV-098', date: '2026-08-10', amount: 9800.00, paid: 5000.00, status: 'Overdue' },
      { id: 'INV-050', date: '2026-07-22', amount: 18800.00, paid: 18800.00, status: 'Paid' },
    ],
    payments: [
      { id: 'PAY-099', date: '2026-08-10', amount: 5000.00, method: 'Bank Transfer', ref: 'AWASH-88391' },
    ]
  },
  {
    id: 'CUST-1006',
    name: 'Bole Café & Lounge',
    email: 'contact@bolecafe.com',
    phone: '+251 911 777 888',
    location: 'Bole Medhanealem, Addis Ababa',
    totalPurchases: 62400.00,
    outstandingBalance: 4200.00,
    creditLimit: 30000.00,
    status: 'VIP',
    dueDate: '2026-09-15',
    history: [
      { id: 'INV-2023-002', date: '2026-08-24', amount: 4200.00, paid: 0.00, status: 'Unpaid' },
      { id: 'INV-120', date: '2026-08-01', amount: 58200.00, paid: 58200.00, status: 'Paid' },
    ],
    payments: [
      { id: 'PAY-120', date: '2026-08-01', amount: 58200.00, method: 'CBE Birr', ref: 'CBE-994112' }
    ]
  }
];

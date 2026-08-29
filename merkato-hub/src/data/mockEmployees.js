/**
 * Realistic Ethiopian SME Employees and Roles
 */

export const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-001',
    name: 'Abebe Bikila',
    email: 'abebe@bikilatrading.et',
    phone: '+251 911 234 567',
    role: 'OWNER',
    branch: 'Bole Main Branch',
    status: 'Active',
    totalSales: 485000.00,
    lastActive: 'Just now',
    permissions: {
      pos: true,
      inventory: true,
      customers: true,
      suppliers: true,
      expenses: true,
      reports: true,
      employees: true,
      settings: true,
    }
  },
  {
    id: 'EMP-002',
    name: 'Sara Tadesse',
    email: 'sara.t@bikilatrading.et',
    phone: '+251 912 345 678',
    role: 'MANAGER',
    branch: 'Bole Main Branch',
    status: 'Active',
    totalSales: 215000.00,
    lastActive: '15 mins ago',
    permissions: {
      pos: true,
      inventory: true,
      customers: true,
      suppliers: true,
      expenses: true,
      reports: true,
      employees: false,
      settings: false,
    }
  },
  {
    id: 'EMP-003',
    name: 'Dawit Yohannes',
    email: 'dawit.y@bikilatrading.et',
    phone: '+251 913 456 789',
    role: 'CASHIER',
    branch: 'Bole Main Branch',
    status: 'Active',
    totalSales: 142500.00,
    lastActive: '5 mins ago',
    permissions: {
      pos: true,
      inventory: false,
      customers: true,
      suppliers: false,
      expenses: false,
      reports: false,
      employees: false,
      settings: false,
    }
  },
  {
    id: 'EMP-004',
    name: 'Bethlehem Haile',
    email: 'bethlehem.h@bikilatrading.et',
    phone: '+251 914 567 890',
    role: 'EMPLOYEE',
    branch: 'Mercato Warehouse',
    status: 'Active',
    totalSales: 0.00,
    lastActive: '2 hours ago',
    permissions: {
      pos: false,
      inventory: true,
      customers: false,
      suppliers: false,
      expenses: false,
      reports: false,
      employees: false,
      settings: false,
    }
  }
];

export const EMPLOYEE_ROLES = ['OWNER', 'MANAGER', 'CASHIER', 'EMPLOYEE'];

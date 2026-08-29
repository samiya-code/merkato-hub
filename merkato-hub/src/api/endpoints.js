/**
 * API Endpoints configuration for MerkatoHub Express REST API
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
  },

  // Business & Onboarding
  BUSINESS: {
    ONBOARDING: '/business/onboarding',
    PROFILE: '/business/profile',
    UPDATE_PROFILE: '/business/profile',
    SETTINGS: '/business/settings',
    BRANCHES: '/business/branches',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    GET: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    IMPORT: '/products/import',
    EXPORT: '/products/export',
  },

  // Inventory
  INVENTORY: {
    SUMMARY: '/inventory/summary',
    STOCK_ACTION: '/inventory/action',
    HISTORY: '/inventory/history',
    WAREHOUSES: '/inventory/warehouses',
  },

  // Sales & POS
  SALES: {
    LIST: '/sales',
    GET: (id) => `/sales/${id}`,
    CREATE: '/sales',
    SUMMARY: '/sales/summary',
    RECEIPT: (id) => `/sales/${id}/receipt`,
  },

  // Customers & CRM
  CUSTOMERS: {
    LIST: '/customers',
    GET: (id) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id) => `/customers/${id}`,
    DELETE: (id) => `/customers/${id}`,
    RECORD_PAYMENT: (id) => `/customers/${id}/payments`,
    PAYMENTS_HISTORY: (id) => `/customers/${id}/payments`,
  },

  // Suppliers
  SUPPLIERS: {
    LIST: '/suppliers',
    GET: (id) => `/suppliers/${id}`,
    CREATE: '/suppliers',
    UPDATE: (id) => `/suppliers/${id}`,
    DELETE: (id) => `/suppliers/${id}`,
    RECORD_PAYMENT: (id) => `/suppliers/${id}/payments`,
  },

  // Purchases
  PURCHASES: {
    LIST: '/purchases',
    GET: (id) => `/purchases/${id}`,
    CREATE: '/purchases',
    UPDATE_STATUS: (id) => `/purchases/${id}/status`,
    RECORD_PAYMENT: (id) => `/purchases/${id}/payments`,
  },

  // Expenses
  EXPENSES: {
    LIST: '/expenses',
    GET: (id) => `/expenses/${id}`,
    CREATE: '/expenses',
    UPDATE: (id) => `/expenses/${id}`,
    DELETE: (id) => `/expenses/${id}`,
    CATEGORIES: '/expenses/categories',
    SUMMARY: '/expenses/summary',
  },

  // Employees
  EMPLOYEES: {
    LIST: '/employees',
    GET: (id) => `/employees/${id}`,
    CREATE: '/employees',
    UPDATE: (id) => `/employees/${id}`,
    UPDATE_PERMISSIONS: (id) => `/employees/${id}/permissions`,
    DELETE: (id) => `/employees/${id}`,
  },

  // Reports
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    FINANCIAL: '/reports/financial',
    INVOICES: '/reports/invoices',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
};

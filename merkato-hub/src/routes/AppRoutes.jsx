import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Guards
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';

// Onboarding
import Onboarding from '../pages/onboarding/Onboarding';

// App Pages
import Dashboard from '../pages/dashboard/Dashboard';
import POSPage from '../pages/sales/POSPage';
import SalesHistoryPage from '../pages/sales/SalesHistoryPage';
import ProductsPage from '../pages/products/ProductsPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import InventoryHistoryPage from '../pages/inventory/InventoryHistoryPage';
import CustomersPage from '../pages/customers/CustomersPage';
import CustomerDebtPage from '../pages/customers/CustomerDebtPage';
import SuppliersPage from '../pages/suppliers/SuppliersPage';
import PurchasesPage from '../pages/purchases/PurchasesPage';
import ExpensesPage from '../pages/expenses/ExpensesPage';
import EmployeesPage from '../pages/employees/EmployeesPage';
import InvoicesPage from '../pages/reports/InvoicesPage';
import ReportsPage from '../pages/reports/ReportsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import SettingsPage from '../pages/settings/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
      </Route>

      {/* Onboarding Wizard */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Authenticated SaaS Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Sales & POS */}
          <Route path="/sales" element={<SalesHistoryPage />} />
          <Route path="/sales/pos" element={<POSPage />} />
          <Route path="/sales/history" element={<SalesHistoryPage />} />

          {/* Products & Inventory */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/history" element={<InventoryHistoryPage />} />

          {/* Customers & Credit Debt */}
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/payments" element={<CustomerDebtPage />} />

          {/* Suppliers & Procurement */}
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />

          {/* Financials & Expenses */}
          <Route path="/expenses" element={<ExpensesPage />} />

          {/* Staff & RBAC */}
          <Route path="/employees" element={<EmployeesPage />} />

          {/* Invoices & Analytics */}
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          {/* Alerts & Settings */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;

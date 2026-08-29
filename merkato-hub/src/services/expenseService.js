/**
 * Expenses and Employees Services
 */
import { INITIAL_EXPENSES, EXPENSE_CATEGORIES } from '../data/mockSales';
import { INITIAL_EMPLOYEES, EMPLOYEE_ROLES } from '../data/mockEmployees';

let expensesStore = [...INITIAL_EXPENSES];
let employeesStore = [...INITIAL_EMPLOYEES];

class ExpenseService {
  async getExpenses() {
    return Promise.resolve([...expensesStore]);
  }

  async createExpense(data) {
    const newId = `EXP-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newExpense = {
      id: newId,
      category: data.category,
      description: data.description,
      amount: Number(data.amount) || 0,
      date: data.date || new Date().toISOString().slice(0, 10),
      paymentMethod: data.paymentMethod || 'Cash',
      receiptUrl: data.receiptUrl || null,
      createdBy: data.createdBy || 'Abebe Bikila',
      status: 'Approved',
    };

    expensesStore.unshift(newExpense);
    return Promise.resolve(newExpense);
  }

  async updateExpense(id, updates) {
    const idx = expensesStore.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Expense not found');

    const updated = { ...expensesStore[idx], ...updates };
    expensesStore[idx] = updated;
    return Promise.resolve(updated);
  }

  async deleteExpense(id) {
    expensesStore = expensesStore.filter(e => e.id !== id);
    return Promise.resolve({ success: true });
  }

  getCategories() {
    return Promise.resolve(EXPENSE_CATEGORIES);
  }
}

class EmployeeService {
  async getEmployees() {
    return Promise.resolve([...employeesStore]);
  }

  async createEmployee(data) {
    const newId = `EMP-${String(employeesStore.length + 1).padStart(3, '0')}`;
    const newEmp = {
      id: newId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role || 'CASHIER',
      branch: data.branch || 'Bole Main Branch',
      status: 'Active',
      totalSales: 0,
      lastActive: 'Just registered',
      permissions: data.permissions || {
        pos: true,
        inventory: false,
        customers: true,
        suppliers: false,
        expenses: false,
        reports: false,
        employees: false,
        settings: false,
      }
    };

    employeesStore.unshift(newEmp);
    return Promise.resolve(newEmp);
  }

  async updateEmployee(id, updates) {
    const idx = employeesStore.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Employee not found');

    const updated = { ...employeesStore[idx], ...updates };
    employeesStore[idx] = updated;
    return Promise.resolve(updated);
  }

  async toggleStatus(id) {
    const emp = employeesStore.find(e => e.id === id);
    if (!emp) throw new Error('Employee not found');
    emp.status = emp.status === 'Active' ? 'Inactive' : 'Active';
    return Promise.resolve(emp);
  }

  getRoles() {
    return Promise.resolve(EMPLOYEE_ROLES);
  }
}

export const expenseService = new ExpenseService();
export const employeeService = new EmployeeService();
export default expenseService;

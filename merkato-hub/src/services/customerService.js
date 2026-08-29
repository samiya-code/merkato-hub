/**
 * Customers & Debt / Credit Service
 */
import { INITIAL_CUSTOMERS } from '../data/mockCustomers';

let customersStore = [...INITIAL_CUSTOMERS];

class CustomerService {
  async getCustomers() {
    return Promise.resolve([...customersStore]);
  }

  async getCustomerById(id) {
    const customer = customersStore.find(c => c.id === id);
    if (!customer) throw new Error('Customer not found');
    return Promise.resolve({ ...customer });
  }

  async createCustomer(customerData) {
    const newId = `CUST-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newCustomer = {
      id: newId,
      name: customerData.name,
      email: customerData.email || '',
      phone: customerData.phone,
      location: customerData.location || 'Addis Ababa, Ethiopia',
      totalPurchases: Number(customerData.initialPurchase) || 0,
      outstandingBalance: Number(customerData.initialDebt) || 0,
      creditLimit: Number(customerData.creditLimit) || 10000,
      status: 'Active',
      dueDate: customerData.dueDate || null,
      history: [],
      payments: [],
    };

    customersStore.unshift(newCustomer);
    return Promise.resolve(newCustomer);
  }

  async updateCustomer(id, updates) {
    const idx = customersStore.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Customer not found');

    const updated = { ...customersStore[idx], ...updates };
    customersStore[idx] = updated;
    return Promise.resolve(updated);
  }

  async recordPayment(id, { amount, paymentMethod = 'Telebirr', notes = '', reference = '' }) {
    const customer = customersStore.find(c => c.id === id);
    if (!customer) throw new Error('Customer not found');

    const payNum = Number(amount) || 0;
    const prevDebt = customer.outstandingBalance;
    const newDebt = Math.max(0, prevDebt - payNum);

    const paymentRecord = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      amount: payNum,
      method: paymentMethod,
      ref: reference || `REF-${Math.floor(Math.random() * 900000 + 100000)}`,
      notes,
    };

    customer.outstandingBalance = newDebt;
    if (!customer.payments) customer.payments = [];
    customer.payments.unshift(paymentRecord);

    return Promise.resolve({ success: true, customer, payment: paymentRecord });
  }

  async deleteCustomer(id) {
    customersStore = customersStore.filter(c => c.id !== id);
    return Promise.resolve({ success: true });
  }
}

export const customerService = new CustomerService();
export default customerService;

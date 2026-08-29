/**
 * Suppliers and Purchases Services
 */
import { INITIAL_SUPPLIERS, INITIAL_PURCHASES } from '../data/mockSuppliers';
import { inventoryService } from './productService';

let suppliersStore = [...INITIAL_SUPPLIERS];
let purchasesStore = [...INITIAL_PURCHASES];

class SupplierService {
  async getSuppliers() {
    return Promise.resolve([...suppliersStore]);
  }

  async getSupplierById(id) {
    const supplier = suppliersStore.find(s => s.id === id);
    if (!supplier) throw new Error('Supplier not found');
    return Promise.resolve({ ...supplier });
  }

  async createSupplier(data) {
    const newId = `SUP-${String(suppliersStore.length + 1).padStart(3, '0')}`;
    const newSupplier = {
      id: newId,
      name: data.name,
      company: data.company || data.name,
      contactPerson: data.contactPerson || data.name,
      phone: data.phone,
      email: data.email || '',
      location: data.location || 'Addis Ababa',
      totalPurchases: 0,
      outstandingBalance: Number(data.outstandingBalance) || 0,
      status: 'Active',
      category: data.category || 'General',
      paymentTerms: data.paymentTerms || 'Net 15',
    };

    suppliersStore.unshift(newSupplier);
    return Promise.resolve(newSupplier);
  }

  async updateSupplier(id, updates) {
    const idx = suppliersStore.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Supplier not found');

    const updated = { ...suppliersStore[idx], ...updates };
    suppliersStore[idx] = updated;
    return Promise.resolve(updated);
  }

  async recordPayment(id, { amount }) {
    const supplier = suppliersStore.find(s => s.id === id);
    if (!supplier) throw new Error('Supplier not found');

    supplier.outstandingBalance = Math.max(0, supplier.outstandingBalance - Number(amount));
    return Promise.resolve({ success: true, supplier });
  }

  async deleteSupplier(id) {
    suppliersStore = suppliersStore.filter(s => s.id !== id);
    return Promise.resolve({ success: true });
  }
}

class PurchaseService {
  async getPurchases() {
    return Promise.resolve([...purchasesStore]);
  }

  async getPurchaseById(id) {
    const po = purchasesStore.find(p => p.id === id);
    if (!po) throw new Error('Purchase order not found');
    return Promise.resolve({ ...po });
  }

  async createPurchase(purchaseData) {
    const newId = `PUR-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newPO = {
      id: newId,
      supplierId: purchaseData.supplierId,
      supplierName: purchaseData.supplierName,
      orderDate: new Date().toISOString().slice(0, 10),
      deliveryDate: purchaseData.deliveryDate || new Date().toISOString().slice(0, 10),
      totalAmount: Number(purchaseData.totalAmount) || 0,
      paidAmount: Number(purchaseData.paidAmount) || 0,
      paymentMethod: purchaseData.paymentMethod || 'Bank Transfer (CBE)',
      status: purchaseData.status || 'Pending',
      paymentStatus: purchaseData.paidAmount >= purchaseData.totalAmount ? 'Paid' : (purchaseData.paidAmount > 0 ? 'Partially Paid' : 'Unpaid'),
      items: purchaseData.items || [],
      notes: purchaseData.notes || '',
    };

    purchasesStore.unshift(newPO);

    // If status is received, auto increment inventory
    if (newPO.status === 'Received') {
      for (const item of newPO.items) {
        try {
          await inventoryService.recordStockAction({
            productId: item.productId,
            actionType: 'STOCK_IN',
            quantity: item.quantity,
            reason: `Purchase Received (${newId})`,
            user: 'Abebe Bikila',
          });
        } catch (err) {
          console.warn('Could not increment stock for purchase item:', item.name, err);
        }
      }
    }

    return Promise.resolve(newPO);
  }

  async receivePurchase(id) {
    const po = purchasesStore.find(p => p.id === id);
    if (!po) throw new Error('Purchase order not found');

    if (po.status !== 'Received') {
      po.status = 'Received';
      for (const item of po.items) {
        try {
          await inventoryService.recordStockAction({
            productId: item.productId,
            actionType: 'STOCK_IN',
            quantity: item.quantity,
            reason: `Purchase Order Received (${id})`,
            user: 'Abebe Bikila',
          });
        } catch (err) {
          console.warn('Could not increment stock:', item.name, err);
        }
      }
    }

    return Promise.resolve(po);
  }
}

export const supplierService = new SupplierService();
export const purchaseService = new PurchaseService();
export default supplierService;

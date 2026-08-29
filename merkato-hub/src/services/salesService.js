/**
 * Sales & POS Service
 */
import { INITIAL_SALES } from '../data/mockSales';
import { productService, inventoryService } from './productService';

let salesStore = [...INITIAL_SALES];

class SalesService {
  async getSales() {
    return Promise.resolve([...salesStore]);
  }

  async getSaleById(id) {
    const sale = salesStore.find(s => s.id === id || s.receiptNumber === id);
    if (!sale) throw new Error('Sale not found');
    return Promise.resolve({ ...sale });
  }

  async createSale(saleData) {
    const receiptNum = `RCP-${Math.floor(Math.random() * 9000 + 1000)}`;
    const saleId = `INV-2026-${String(salesStore.length + 1).padStart(3, '0')}`;

    const newSale = {
      id: saleId,
      receiptNumber: receiptNum,
      date: new Date().toISOString(),
      customerId: saleData.customerId || null,
      customerName: saleData.customerName || 'Walk-in Customer',
      cashierName: saleData.cashierName || 'Abebe Bikila',
      paymentMethod: saleData.paymentMethod || 'Cash',
      subtotal: Number(saleData.subtotal) || 0,
      tax: Number(saleData.tax) || 0,
      discount: Number(saleData.discount) || 0,
      total: Number(saleData.total) || 0,
      status: 'Completed',
      paymentStatus: saleData.paymentStatus || 'Paid',
      items: saleData.items || [],
      notes: saleData.notes || '',
    };

    salesStore.unshift(newSale);

    // Automatically decrement product inventory for each item in the sale
    for (const item of newSale.items) {
      try {
        await inventoryService.recordStockAction({
          productId: item.id,
          actionType: 'STOCK_OUT',
          quantity: item.quantity,
          reason: `POS Checkout (${receiptNum})`,
          user: newSale.cashierName,
        });
      } catch (err) {
        console.warn('Could not auto-decrement item:', item.name, err);
      }
    }

    return Promise.resolve(newSale);
  }

  async getSalesSummary() {
    const totalSales = salesStore.length;
    const totalRevenue = salesStore.reduce((sum, s) => sum + s.total, 0);
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = salesStore.filter(s => s.date.startsWith(today));
    const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

    return Promise.resolve({
      totalSales,
      totalRevenue,
      todaySalesCount: todaySales.length,
      todayRevenue,
    });
  }
}

export const salesService = new SalesService();
export default salesService;

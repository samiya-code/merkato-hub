/**
 * Product & Inventory Services with in-memory persistence and Express API fallback
 */
import { INITIAL_PRODUCTS, PRODUCT_CATEGORIES, PRODUCT_UNITS } from '../data/mockProducts';

// In-memory product store initialized from mock data
let productsStore = [...INITIAL_PRODUCTS];

let inventoryHistoryStore = [
  { id: 'MOV-001', productId: 'PRD-001', productName: 'Yirgacheffe Coffee Beans (500g)', prevQty: 35, change: '+10', newQty: 45, reason: 'Restocked (PO-9842)', user: 'Sara Tadesse', date: '2026-08-29 08:30' },
  { id: 'MOV-002', productId: 'PRD-002', productName: 'Traditional Hand-Woven Scarf', prevQty: 17, change: '-5', newQty: 12, reason: 'Sold in POS (#RCP-9842)', user: 'Dawit Yohannes', date: '2026-08-29 09:15' },
  { id: 'MOV-003', productId: 'PRD-003', productName: 'Buna Ceramic Coffee Set (12pcs)', prevQty: 2, change: '-2', newQty: 0, reason: 'Sold in POS (#RCP-9840)', user: 'Dawit Yohannes', date: '2026-08-28 16:30' },
  { id: 'MOV-004', productId: 'PRD-005', productName: 'Organic Honey (Sidamo, 1kg)', prevQty: 9, change: '-1', newQty: 8, reason: 'Damaged Jar / Write-off', user: 'Abebe Bikila', date: '2026-08-28 14:00' },
  { id: 'MOV-005', productId: 'PRD-004', productName: 'Berbere Spice Blend (250g)', prevQty: 4, change: '+120', newQty: 124, reason: 'Restocked (PO-9840)', user: 'Sara Tadesse', date: '2026-08-28 10:15' },
];

class ProductService {
  async getProducts() {
    return Promise.resolve([...productsStore]);
  }

  async getProductById(id) {
    const product = productsStore.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return Promise.resolve({ ...product });
  }

  async createProduct(productData) {
    const newId = `PRD-${String(productsStore.length + 1).padStart(3, '0')}`;
    const newProduct = {
      id: newId,
      sku: productData.sku || `SKU-${Date.now().toString().slice(-6)}`,
      barcode: productData.barcode || `${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      name: productData.name,
      category: productData.category || 'General',
      description: productData.description || '',
      purchasePrice: Number(productData.purchasePrice) || 0,
      sellingPrice: Number(productData.sellingPrice) || 0,
      currentStock: Number(productData.currentStock) || 0,
      minStock: Number(productData.minStock) || 5,
      maxStock: Number(productData.maxStock) || 100,
      supplierId: productData.supplierId || 'SUP-001',
      supplierName: productData.supplierName || 'Tomoca Coffee Roasters',
      unit: productData.unit || 'Piece',
      status: Number(productData.currentStock) <= 0 ? 'Out of Stock' : (Number(productData.currentStock) <= Number(productData.minStock) ? 'Low Stock' : 'In Stock'),
      expirationDate: productData.expirationDate || null,
      image: productData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    };

    productsStore = [newProduct, ...productsStore];

    // Log initial inventory movement
    if (newProduct.currentStock > 0) {
      inventoryHistoryStore.unshift({
        id: `MOV-${Date.now().toString().slice(-4)}`,
        productId: newProduct.id,
        productName: newProduct.name,
        prevQty: 0,
        change: `+${newProduct.currentStock}`,
        newQty: newProduct.currentStock,
        reason: 'Initial Product Stock',
        user: 'Abebe Bikila',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      });
    }

    return Promise.resolve(newProduct);
  }

  async updateProduct(id, updates) {
    const idx = productsStore.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    const updated = {
      ...productsStore[idx],
      ...updates,
    };

    // Re-evaluate status
    if (updated.currentStock <= 0) {
      updated.status = 'Out of Stock';
    } else if (updated.currentStock <= updated.minStock) {
      updated.status = 'Low Stock';
    } else {
      updated.status = 'In Stock';
    }

    productsStore[idx] = updated;
    return Promise.resolve(updated);
  }

  async deleteProduct(id) {
    productsStore = productsStore.filter(p => p.id !== id);
    return Promise.resolve({ success: true });
  }

  getCategories() {
    return Promise.resolve(PRODUCT_CATEGORIES);
  }

  getUnits() {
    return Promise.resolve(PRODUCT_UNITS);
  }
}

class InventoryService {
  async getInventorySummary() {
    const totalProducts = productsStore.length;
    const lowStockItems = productsStore.filter(p => p.status === 'Low Stock').length;
    const outOfStockItems = productsStore.filter(p => p.status === 'Out of Stock').length;
    const totalValue = productsStore.reduce((acc, p) => acc + (p.currentStock * p.purchasePrice), 0);

    return Promise.resolve({
      totalProducts,
      lowStockItems,
      outOfStockItems,
      totalValue,
      storageCapacity: {
        usedPercentage: 75,
        warehouseName: 'Merkato Main Warehouse',
        section: 'Section A & B at high capacity',
        availableSpace: '1,240 cu.ft',
      }
    });
  }

  async recordStockAction({ productId, actionType, quantity, reason, notes, user = 'Abebe Bikila' }) {
    const product = productsStore.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');

    const qtyNum = Number(quantity) || 0;
    const prevQty = product.currentStock;
    let newQty = prevQty;
    let changeText = '';

    if (actionType === 'STOCK_IN') {
      newQty = prevQty + qtyNum;
      changeText = `+${qtyNum}`;
    } else if (actionType === 'STOCK_OUT' || actionType === 'DAMAGED') {
      newQty = Math.max(0, prevQty - qtyNum);
      changeText = `-${qtyNum}`;
    } else if (actionType === 'ADJUSTMENT') {
      newQty = qtyNum;
      const diff = newQty - prevQty;
      changeText = diff >= 0 ? `+${diff}` : `${diff}`;
    } else if (actionType === 'RETURNED') {
      newQty = prevQty + qtyNum;
      changeText = `+${qtyNum}`;
    }

    product.currentStock = newQty;
    if (newQty <= 0) {
      product.status = 'Out of Stock';
    } else if (newQty <= product.minStock) {
      product.status = 'Low Stock';
    } else {
      product.status = 'In Stock';
    }

    const movement = {
      id: `MOV-${Date.now().toString().slice(-5)}`,
      productId: product.id,
      productName: product.name,
      prevQty,
      change: changeText,
      newQty,
      reason: `${actionType.replace('_', ' ')}: ${reason || notes || 'Manual adjustment'}`,
      user,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    inventoryHistoryStore.unshift(movement);

    return Promise.resolve({ success: true, product, movement });
  }

  async getHistory() {
    return Promise.resolve([...inventoryHistoryStore]);
  }
}

export const productService = new ProductService();
export const inventoryService = new InventoryService();
export default productService;

import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { purchaseService } from '../../services/purchaseService';
import { supplierService } from '../../services/supplierService';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/currency';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';

export const PurchaseOrderModal = ({ isOpen, onClose, onCreated }) => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer (CBE)');
  const [paidAmount, setPaidAmount] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('Received'); // Default received updates stock immediately
  const [items, setItems] = useState([
    { productId: '', quantity: 10, unitCost: 100 }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const load = async () => {
        const [sups, prods] = await Promise.all([
          supplierService.getSuppliers(),
          productService.getProducts(),
        ]);
        setSuppliers(sups);
        setProducts(prods);
        if (sups.length > 0) setSupplierId(sups[0].id);
        if (prods.length > 0) {
          setItems([{ productId: prods[0].id, quantity: 20, unitCost: prods[0].purchasePrice || 100 }]);
        }
      };
      load();
    }
  }, [isOpen]);

  const handleItemChange = (idx, field, value) => {
    const next = [...items];
    next[idx][field] = value;
    if (field === 'productId') {
      const prod = products.find(p => p.id === value);
      if (prod) {
        next[idx].unitCost = prod.purchasePrice || 100;
      }
    }
    setItems(next);
  };

  const handleAddItem = () => {
    const prod = products[0];
    setItems([...items, { productId: prod ? prod.id : '', quantity: 10, unitCost: prod ? prod.purchasePrice : 100 }]);
  };

  const handleRemoveItem = (idx) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const totalAmount = items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitCost) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId) {
      toast.warning('Required', 'Please select a supplier.');
      return;
    }

    const sup = suppliers.find(s => s.id === supplierId);

    setIsLoading(true);
    try {
      const payload = {
        supplierId,
        supplierName: sup ? sup.name : 'Wholesale Supplier',
        deliveryDate,
        totalAmount,
        paidAmount: Number(paidAmount) || totalAmount,
        paymentMethod,
        status,
        items: items.map(it => {
          const p = products.find(prod => prod.id === it.productId);
          return {
            productId: it.productId,
            name: p ? p.name : 'Item',
            quantity: Number(it.quantity),
            unitCost: Number(it.unitCost),
            total: Number(it.quantity) * Number(it.unitCost),
          };
        }),
      };

      await purchaseService.createPurchase(payload);
      toast.success('PO Created', `Purchase Order logged. Inventory updated.`);
      onCreated && onCreated();
      onClose();
    } catch (err) {
      toast.error('Error', err.message || 'Failed to create PO.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Purchase Order"
      subtitle="Procure inventory from Ethiopian suppliers with automated stock receiving."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Supplier"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            options={suppliers.map(s => ({ value: s.id, label: `${s.name} (${s.company})` }))}
            required
          />

          <Input
            label="Expected Delivery Date"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>

        {/* PO Line Items */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Purchased Items & Quantities
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Item
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex-1">
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                    className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-300 bg-white text-center font-bold"
                  />
                </div>

                <div className="w-28">
                  <input
                    type="number"
                    value={item.unitCost}
                    onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                    placeholder="Unit Cost"
                    className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-300 bg-white text-right font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <Select
            label="Receiving Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'Received', label: 'Received (Update Stock Immediately)' },
              { value: 'Pending', label: 'Pending Shipment' },
            ]}
          />

          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={['Bank Transfer (CBE)', 'Telebirr', 'Cash', 'Credit Purchase']}
          />

          <Input
            label="Paid Amount (ETB)"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            placeholder={String(totalAmount)}
            suffix="ETB"
          />
        </div>

        {/* Total Price Callout */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-900">Total Purchase Order Cost:</span>
          <span className="text-base font-black text-emerald-950">{formatCurrency(totalAmount)}</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Submit Purchase Order
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PurchaseOrderModal;

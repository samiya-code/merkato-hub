import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { inventoryService } from '../../services/productService';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

export const StockActionModal = ({ isOpen, onClose, products = [], onCompleted }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [actionType, setActionType] = useState('STOCK_IN'); // 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'DAMAGED' | 'RETURNED'
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prodId = selectedProductId || (products[0] ? products[0].id : null);
    if (!prodId) {
      toast.warning('Required', 'Please select a product.');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      toast.warning('Required', 'Please enter a valid quantity.');
      return;
    }

    setIsLoading(true);
    try {
      await inventoryService.recordStockAction({
        productId: prodId,
        actionType,
        quantity: Number(quantity),
        reason: reason || actionType.replace('_', ' '),
        notes,
      });

      toast.success('Stock Updated', `Inventory adjustment logged successfully.`);
      onCompleted && onCompleted();
      onClose();
    } catch (err) {
      toast.error('Error', err.message || 'Failed to record stock movement.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stock Action & Inventory Adjustment"
      subtitle="Record incoming shipments, manual write-offs, or damaged items."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Product"
          value={selectedProductId || (products[0] ? products[0].id : '')}
          onChange={(e) => setSelectedProductId(e.target.value)}
          options={products.map(p => ({
            value: p.id,
            label: `${p.name} (Current: ${p.currentStock} ${p.unit}s)`
          }))}
          required
        />

        <Select
          label="Action Type"
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          options={[
            { value: 'STOCK_IN', label: 'Stock In (Shipment Received / Restock)' },
            { value: 'STOCK_OUT', label: 'Stock Out (Manual Transfer / Wholesale Out)' },
            { value: 'ADJUSTMENT', label: 'Stock Adjustment (Physical Stocktake Count)' },
            { value: 'DAMAGED', label: 'Damaged / Spoiled (Write-off)' },
            { value: 'RETURNED', label: 'Customer Returned Goods' },
          ]}
          required
        />

        <Input
          label={actionType === 'ADJUSTMENT' ? 'New Exact Stock Count' : 'Quantity to Add / Deduct'}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 10"
          required
        />

        <Input
          label="Reason / Reference #"
          placeholder="e.g. PO-9842, Supplier delivery, Damaged package..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <Textarea
          label="Notes (Optional)"
          placeholder="Additional audit notes for the manager..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Save Stock Movement
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StockActionModal;

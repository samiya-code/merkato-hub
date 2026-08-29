import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { expenseService } from '../../services/expenseService';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import FileUpload from '../ui/FileUpload';

export const ExpenseModal = ({ isOpen, onClose, onSaved }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: 'Rent',
    amount: '',
    description: '',
    paymentMethod: 'Bank Transfer (CBE)',
    date: new Date().toISOString().slice(0, 10),
    receiptUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.warning('Invalid Amount', 'Please enter a valid expense amount.');
      return;
    }
    if (!formData.description.trim()) {
      toast.warning('Required', 'Please describe the expense purpose.');
      return;
    }

    setIsLoading(true);
    try {
      await expenseService.createExpense(formData);
      toast.success('Expense Recorded', `${formData.category} expense logged successfully.`);
      onSaved && onSaved();
      onClose();
    } catch (err) {
      toast.error('Error', err.message || 'Failed to record expense.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Operational Expense"
      subtitle="Log utility bills, rent, employee salaries, marketing, or supplies."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Expense Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={[
            'Rent',
            'Electricity',
            'Water',
            'Internet',
            'Salary',
            'Transportation',
            'Marketing',
            'Supplies',
            'Maintenance',
            'Tax',
            'Other',
          ]}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount (ETB)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            suffix="ETB"
            required
          />

          <Input
            label="Expense Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <Select
          label="Payment Method"
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          options={[
            'Telebirr',
            'CBE Birr',
            'Cash',
            'Bank Transfer (CBE)',
            'Bank Transfer (Awash)',
            'Bank Transfer (Dashen)',
          ]}
        />

        <Input
          label="Description / Purpose"
          placeholder="e.g. Ethiopian Electric Utility (EEU) power bill"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <FileUpload
          label="Attach Bill / Receipt Photo (Optional)"
          value={formData.receiptUrl}
          onChange={(url) => setFormData({ ...formData, receiptUrl: url })}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseModal;

import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { customerService } from '../../services/customerService';
import { formatCurrency } from '../../utils/currency';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export const RecordPaymentModal = ({ isOpen, onClose, customer, onCompleted }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Telebirr');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!customer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.warning('Invalid Amount', 'Enter a payment amount greater than zero.');
      return;
    }
    if (Number(amount) > customer.outstandingBalance) {
      toast.warning('Excess Amount', `Customer debt is only ${formatCurrency(customer.outstandingBalance)}.`);
    }

    setIsLoading(true);
    try {
      await customerService.recordPayment(customer.id, {
        amount: Number(amount),
        paymentMethod,
        reference,
        notes,
      });

      toast.success('Payment Recorded', `Received ${formatCurrency(amount)} from ${customer.name}.`);
      onCompleted && onCompleted();
      onClose();
    } catch (err) {
      toast.error('Error', err.message || 'Failed to record payment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Customer Debt Payment"
      subtitle={`Settle balance for ${customer.name} (${customer.id})`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Balance Summary */}
        <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
          <div>
            <span className="text-amber-800 font-semibold">Current Outstanding Debt:</span>
            <p className="text-lg font-black text-amber-950 mt-0.5">{formatCurrency(customer.outstandingBalance)}</p>
          </div>
          <span className="px-2 py-1 bg-amber-200/80 text-amber-900 font-bold rounded-lg text-[10px]">
            Due: {customer.dueDate || 'Immediate'}
          </span>
        </div>

        <Input
          label="Payment Amount (ETB)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={String(customer.outstandingBalance)}
          suffix="ETB"
          required
        />

        <Select
          label="Payment Channel"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={[
            'Telebirr',
            'CBE Birr',
            'Cash',
            'Bank Transfer (Awash)',
            'Bank Transfer (Dashen)',
            'M-Pesa',
          ]}
        />

        <Input
          label="Transaction Reference / Confirmation Code"
          placeholder="e.g. TB-998242 or CBE-445120"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        <Input
          label="Receipt Notes (Optional)"
          placeholder="e.g. Partial debt settlement for Aug invoice"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Confirm Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RecordPaymentModal;

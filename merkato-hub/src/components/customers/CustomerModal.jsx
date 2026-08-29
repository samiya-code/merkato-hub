import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { customerService } from '../../services/customerService';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export const CustomerModal = ({ isOpen, onClose, customer = null, onSaved }) => {
  const isEdit = !!customer;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '+251 ',
    email: '',
    location: 'Bole, Addis Ababa',
    creditLimit: '10000',
    initialDebt: '0',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (customer) {
        setFormData({
          name: customer.name || '',
          phone: customer.phone || '+251 ',
          email: customer.email || '',
          location: customer.location || 'Addis Ababa',
          creditLimit: customer.creditLimit || '10000',
          initialDebt: customer.outstandingBalance || '0',
        });
      } else {
        setFormData({
          name: '',
          phone: '+251 9',
          email: '',
          location: 'Bole, Addis Ababa',
          creditLimit: '10000',
          initialDebt: '0',
        });
      }
    }
  }, [isOpen, customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Required', 'Please enter customer name.');
      return;
    }
    if (!formData.phone.trim()) {
      toast.warning('Required', 'Please enter customer phone number.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit) {
        await customerService.updateCustomer(customer.id, formData);
        toast.success('Updated', `${formData.name} customer profile updated.`);
      } else {
        await customerService.createCustomer(formData);
        toast.success('Customer Registered', `${formData.name} added to CRM.`);
      }
      onSaved && onSaved();
      onClose();
    } catch (err) {
      toast.error('Error', err.message || 'Failed to save customer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Customer Profile' : 'Add New Customer'}
      subtitle="Register client details, phone number, and credit account limits."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Customer Full Name"
          placeholder="e.g. Tewodros Kassahun"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="+251 911 234 567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="client@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <Select
          label="Location / Sub-City"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          options={[
            'Bole, Addis Ababa',
            'Kazanchis, Addis Ababa',
            'Piazza, Addis Ababa',
            'Megenagna, Addis Ababa',
            'Old Airport, Addis Ababa',
            'Merkato, Addis Ababa',
            'CMC / Summit, Addis Ababa',
            'Hawassa, Sidama',
            'Adama, Oromia',
            'Bahir Dar, Amhara',
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Credit Limit (ETB)"
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
            placeholder="10000"
            suffix="ETB"
          />

          {!isEdit && (
            <Input
              label="Starting Outstanding Debt (ETB)"
              type="number"
              value={formData.initialDebt}
              onChange={(e) => setFormData({ ...formData, initialDebt: e.target.value })}
              placeholder="0.00"
              suffix="ETB"
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Register Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;

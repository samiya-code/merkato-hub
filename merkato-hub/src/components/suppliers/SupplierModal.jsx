import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { supplierService } from '../../services/supplierService';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export const SupplierModal = ({ isOpen, onClose, supplier = null, onSaved }) => {
  const isEdit = !!supplier;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '+251 ',
    email: '',
    location: 'Merkato, Addis Ababa',
    category: 'Spices & Grains',
    paymentTerms: 'Net 15',
    outstandingBalance: '0',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        setFormData({
          name: supplier.name || '',
          company: supplier.company || '',
          phone: supplier.phone || '+251 ',
          email: supplier.email || '',
          location: supplier.location || 'Addis Ababa',
          category: supplier.category || 'General',
          paymentTerms: supplier.paymentTerms || 'Net 15',
          outstandingBalance: String(supplier.outstandingBalance || 0),
        });
      } else {
        setFormData({
          name: '',
          company: '',
          phone: '+251 9',
          email: '',
          location: 'Merkato, Addis Ababa',
          category: 'Spices & Grains',
          paymentTerms: 'Net 15',
          outstandingBalance: '0',
        });
      }
    }
  }, [isOpen, supplier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Required', 'Please enter supplier name.');
      return;
    }
    if (!formData.phone.trim()) {
      toast.warning('Required', 'Please enter phone number.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit) {
        await supplierService.updateSupplier(supplier.id, formData);
        toast.success('Updated', `${formData.name} supplier profile updated.`);
      } else {
        await supplierService.createSupplier(formData);
        toast.success('Supplier Created', `${formData.name} added to suppliers.`);
      }
      onSaved && onSaved();
      onClose();
    } catch (err) {
      toast.error('Error', err.message || 'Failed to save supplier.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Supplier' : 'Add New Supplier'}
      subtitle="Register vendor info, contact representative, and payment terms."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Supplier Name"
          placeholder="e.g. Tomoca Coffee Roasters"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Company / Enterprise Legal Name"
          placeholder="e.g. Tomoca Coffee Share Co."
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="+251 911 202 020"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="orders@supplier.et"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location / Warehouse Address"
            placeholder="e.g. Piazza / Churchill Ave, Addis Ababa"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Select
            label="Product Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              'Coffee & Honey',
              'Textiles & Garments',
              'Traditional Ceramics',
              'Spices, Teff & Grains',
              'Fresh Injera & Pastes',
              'Beverages & Soft Drinks',
              'Electronics & Accessories',
              'General Wholesale',
            ]}
          />
        </div>

        <Select
          label="Payment Terms"
          value={formData.paymentTerms}
          onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
          options={['Cash On Delivery', 'Net 15', 'Net 30', 'Advance 50%']}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Register Supplier'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SupplierModal;

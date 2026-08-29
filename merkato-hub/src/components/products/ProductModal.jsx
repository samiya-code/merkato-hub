import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { productService } from '../../services/productService';
import { supplierService } from '../../services/supplierService';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import FileUpload from '../ui/FileUpload';

export const ProductModal = ({ isOpen, onClose, product = null, onSaved }) => {
  const isEdit = !!product;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'Food & Beverage',
    description: '',
    purchasePrice: '',
    sellingPrice: '',
    currentStock: '',
    minStock: '10',
    maxStock: '100',
    supplierId: 'SUP-001',
    supplierName: 'Tomoca Coffee Roasters',
    unit: 'Piece',
    expirationDate: '',
    image: '',
  });

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMeta = async () => {
      const [cats, un, sups] = await Promise.all([
        productService.getCategories(),
        productService.getUnits(),
        supplierService.getSuppliers(),
      ]);
      setCategories(cats.filter(c => c !== 'All'));
      setUnits(un);
      setSuppliers(sups);
    };
    if (isOpen) {
      loadMeta();
      if (product) {
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          barcode: product.barcode || '',
          category: product.category || 'Food & Beverage',
          description: product.description || '',
          purchasePrice: product.purchasePrice || '',
          sellingPrice: product.sellingPrice || '',
          currentStock: product.currentStock || '',
          minStock: product.minStock || '10',
          maxStock: product.maxStock || '100',
          supplierId: product.supplierId || 'SUP-001',
          supplierName: product.supplierName || 'Tomoca Coffee Roasters',
          unit: product.unit || 'Piece',
          expirationDate: product.expirationDate || '',
          image: product.image || '',
        });
      } else {
        setFormData({
          name: '',
          sku: `SKU-${Date.now().toString().slice(-6)}`,
          barcode: `${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          category: 'Food & Beverage',
          description: '',
          purchasePrice: '',
          sellingPrice: '',
          currentStock: '20',
          minStock: '10',
          maxStock: '100',
          supplierId: 'SUP-001',
          supplierName: 'Tomoca Coffee Roasters',
          unit: 'Piece',
          expirationDate: '',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
        });
      }
    }
  }, [isOpen, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Required', 'Please enter product name.');
      return;
    }
    if (!formData.sellingPrice) {
      toast.warning('Required', 'Please enter selling price.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit) {
        await productService.updateProduct(product.id, formData);
        toast.success('Product Updated', `${formData.name} updated successfully.`);
      } else {
        await productService.createProduct(formData);
        toast.success('Product Created', `${formData.name} added to catalog.`);
      }
      onSaved && onSaved();
      onClose();
    } catch (err) {
      toast.error('Error', err.message || 'Failed to save product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Product' : 'Add New Product'}
      subtitle="Fill in catalog details, pricing in ETB, and inventory reorder levels."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Product Name"
              placeholder="e.g. Yirgacheffe Coffee Beans (500g)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <Input
            label="SKU (Stock Keeping Unit)"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="e.g. YRG-500G-A1"
            required
          />

          <Input
            label="Barcode / EAN"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            placeholder="e.g. 6001001001"
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories}
          />

          <Select
            label="Unit of Measure"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            options={units}
          />

          <Input
            label="Purchase / Cost Price (ETB)"
            type="number"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
            placeholder="0.00"
            suffix="ETB"
            required
          />

          <Input
            label="Selling Price (ETB)"
            type="number"
            value={formData.sellingPrice}
            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
            placeholder="0.00"
            suffix="ETB"
            required
          />

          <Input
            label="Initial Stock Quantity"
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
            placeholder="0"
            required
          />

          <Input
            label="Minimum Reorder Threshold"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
            placeholder="5"
          />

          <Select
            label="Primary Supplier"
            value={formData.supplierId}
            onChange={(e) => {
              const s = suppliers.find(sup => sup.id === e.target.value);
              setFormData({ ...formData, supplierId: e.target.value, supplierName: s ? s.name : '' });
            }}
            options={suppliers.map(s => ({ value: s.id, label: `${s.name} (${s.company})` }))}
          />

          <Input
            label="Expiration Date (If Applicable)"
            type="date"
            value={formData.expirationDate || ''}
            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
          />

          <div className="sm:col-span-2">
            <FileUpload
              label="Product Image"
              value={formData.image}
              onChange={(imgUrl) => setFormData({ ...formData, image: imgUrl })}
            />
          </div>

          <div className="sm:col-span-2">
            <Textarea
              label="Product Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed specs, packaging, or brand notes..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;

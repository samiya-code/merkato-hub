import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Plus,
  Download,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Truck,
  DollarSign,
} from 'lucide-react';
import { supplierService } from '../../services/supplierService';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Dropdown, { DropdownItem } from '../../components/ui/Dropdown';
import SupplierModal from '../../components/suppliers/SupplierModal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import LoadingState from '../../components/ui/LoadingState';

export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (s) => {
    setSelectedSupplier(s);
    setSupplierModalOpen(true);
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;
    try {
      await supplierService.deleteSupplier(supplierToDelete.id);
      toast.success('Deleted', `${supplierToDelete.name} has been removed.`);
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
      loadSuppliers();
    } catch {
      toast.error('Error', 'Unable to delete supplier.');
    }
  };

  const totalOutstanding = suppliers.reduce((sum, s) => sum + (s.outstandingBalance || 0), 0);

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.company.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Suppliers & Vendors</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage trade wholesale relationships, procurement agreements, and supplier debt.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => navigate('/purchases')} icon={Truck}>
            Purchase Orders
          </Button>
          <Button variant="primary" size="sm" onClick={() => { setSelectedSupplier(null); setSupplierModalOpen(true); }} icon={Plus}>
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Suppliers"
          value={String(suppliers.length)}
          description="Wholesale distribution partners"
          icon={Building2}
        />
        <StatCard
          title="Accounts Payable (Debt)"
          value={formatCurrency(totalOutstanding, { decimals: 0 })}
          description="Due to wholesale partners"
          isPositive={false}
          icon={DollarSign}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Total Lifetime Purchases"
          value={formatCurrency(suppliers.reduce((acc, s) => acc + (s.totalPurchases || 0), 0), { decimals: 0 })}
          description="Gross procurement expenditure"
          icon={Truck}
        />
        <StatCard
          title="Payment Health"
          value="Good"
          description="Average Net 15 fulfillment"
          icon={Building2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search suppliers by name, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 font-semibold">{filtered.length} suppliers active</span>
        </div>

        {isLoading ? (
          <LoadingState message="Loading supplier records..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Supplier & Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead className="text-right">Outstanding Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-bold text-slate-900 text-xs">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.company} • {s.id}</div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                      {s.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-0.5">
                      <div className="font-semibold text-slate-800">{s.phone}</div>
                      {s.email && <div className="text-[11px] text-slate-500">{s.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{s.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700">
                    {s.paymentTerms}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {s.outstandingBalance > 0 ? (
                      <span className="font-black text-amber-700">
                        {formatCurrency(s.outstandingBalance)}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">0.00 ETB</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dropdown>
                      <DropdownItem icon={Truck} onClick={() => navigate('/purchases')}>
                        Create Purchase Order
                      </DropdownItem>
                      <DropdownItem icon={Edit2} onClick={() => handleEdit(s)}>
                        Edit Profile
                      </DropdownItem>
                      <DropdownItem
                        icon={Trash2}
                        danger
                        onClick={() => {
                          setSupplierToDelete(s);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Supplier Modal */}
      <SupplierModal
        isOpen={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        supplier={selectedSupplier}
        onSaved={loadSuppliers}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message={`Are you sure you want to remove ${supplierToDelete?.name}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default SuppliersPage;

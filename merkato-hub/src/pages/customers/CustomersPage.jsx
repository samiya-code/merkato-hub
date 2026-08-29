import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  TrendingUp,
  Clock,
  Plus,
  Download,
  Filter,
  Search,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Eye,
  Edit2,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { customerService } from '../../services/customerService';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Dropdown, { DropdownItem } from '../../components/ui/Dropdown';
import Pagination from '../../components/ui/Pagination';
import CustomerModal from '../../components/customers/CustomerModal';
import RecordPaymentModal from '../../components/customers/RecordPaymentModal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import LoadingState from '../../components/ui/LoadingState';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('customers');
  
  // Modals
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [paymentCustomer, setPaymentCustomer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (c) => {
    setSelectedCustomer(c);
    setCustomerModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setCustomerModalOpen(true);
  };

  const handleRecordPayment = (c) => {
    setPaymentCustomer(c);
    setRecordPaymentOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    try {
      await customerService.deleteCustomer(customerToDelete.id);
      toast.success('Deleted', `${customerToDelete.name} has been removed.`);
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      loadCustomers();
    } catch {
      toast.error('Error', 'Unable to delete customer.');
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Database Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your customer relationships and supplier network.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={Download}>
            Export
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddNew} icon={Plus}>
            Add New Customer
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards Matching Visily Page 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={String(customers.length ? customers.length.toLocaleString() : '1,284')}
          change="+12%"
          isPositive={true}
          icon={Users}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Total Suppliers"
          value="84"
          description="Active Wholesale Hubs"
          icon={Building2}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          onClick={() => navigate('/suppliers')}
        />
        <StatCard
          title="Customer Retention"
          value="78.4%"
          change="+3.2% vs Q2"
          isPositive={true}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Supplier Turnaround"
          value="4.2 Days"
          description="Last 30 Days Average"
          icon={Clock}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          className="pb-2.5 text-xs font-bold border-b-2 border-emerald-600 text-emerald-700 flex items-center gap-1.5"
        >
          <Users className="w-4 h-4" />
          <span>Customers (CRM)</span>
        </button>
        <button
          onClick={() => navigate('/suppliers')}
          className="pb-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
        >
          <Building2 className="w-4 h-4" />
          <span>Suppliers</span>
        </button>
        <button
          onClick={() => navigate('/payments')}
          className="pb-2.5 text-xs font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
        >
          <CreditCard className="w-4 h-4" />
          <span>Credit & Debt Ledger</span>
        </button>
      </div>

      {/* Customer Database Subtitle & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Customer Database</h3>
            <p className="text-xs text-slate-500">View and manage detailed information for all your registered clients.</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-80">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers by name, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>
            <button className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Customer Table Matching Visily Page 5 */}
        {isLoading ? (
          <LoadingState message="Loading CRM customer records..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Outstanding Debt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5 text-xs">
                      {c.email && (
                        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{c.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-slate-700 font-semibold text-[11px]">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{c.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{c.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-black text-slate-900 text-xs">
                    {formatCurrency(c.totalPurchases)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {c.outstandingBalance > 0 ? (
                      <span className="font-black text-rose-600">
                        {formatCurrency(c.outstandingBalance)}
                      </span>
                    ) : (
                      <span className="font-medium text-emerald-700">0.00 ETB</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.status === 'VIP' ? 'vip' : c.status === 'Active' ? 'success' : 'neutral'}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dropdown>
                      {c.outstandingBalance > 0 && (
                        <DropdownItem
                          icon={DollarSign}
                          onClick={() => handleRecordPayment(c)}
                        >
                          Record Payment
                        </DropdownItem>
                      )}
                      <DropdownItem icon={Edit2} onClick={() => handleEdit(c)}>
                        Edit Profile
                      </DropdownItem>
                      <DropdownItem
                        icon={Trash2}
                        danger
                        onClick={() => {
                          setCustomerToDelete(c);
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

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={10}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        customer={selectedCustomer}
        onSaved={loadCustomers}
      />

      <RecordPaymentModal
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        customer={paymentCustomer}
        onCompleted={loadCustomers}
      />

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to remove ${customerToDelete?.name}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default CustomersPage;

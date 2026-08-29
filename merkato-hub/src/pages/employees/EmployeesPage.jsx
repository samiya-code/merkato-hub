import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Shield,
  Phone,
  Mail,
  MoreVertical,
  Edit2,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { employeeService } from '../../services/expenseService';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import LoadingState from '../../components/ui/LoadingState';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+251 9',
    role: 'CASHIER',
    branch: 'Bole Main Branch',
    permissions: {
      pos: true,
      inventory: false,
      customers: true,
      suppliers: false,
      expenses: false,
      reports: false,
      employees: false,
      settings: false,
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedEmp(null);
    setFormData({
      name: '',
      email: '',
      phone: '+251 9',
      role: 'CASHIER',
      branch: 'Bole Main Branch',
      permissions: {
        pos: true,
        inventory: false,
        customers: true,
        suppliers: false,
        expenses: false,
        reports: false,
        employees: false,
        settings: false,
      }
    });
    setModalOpen(true);
  };

  const handleEdit = (emp) => {
    setSelectedEmp(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      branch: emp.branch,
      permissions: emp.permissions || {},
    });
    setModalOpen(true);
  };

  const handleTogglePerm = (key) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: !formData.permissions[key],
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.warning('Required', 'Please enter employee name and email.');
      return;
    }

    try {
      if (selectedEmp) {
        await employeeService.updateEmployee(selectedEmp.id, formData);
        toast.success('Updated', `${formData.name}'s profile and permissions updated.`);
      } else {
        await employeeService.createEmployee(formData);
        toast.success('Employee Added', `${formData.name} invited as ${formData.role}.`);
      }
      setModalOpen(false);
      loadEmployees();
    } catch {
      toast.error('Error', 'Unable to save employee.');
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Team & Staff Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based access control (RBAC), cashier permissions, and sales productivity.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={Plus}>
          Add Team Member
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Staff"
          value={String(employees.length)}
          description="Across all branches"
          icon={UserCheck}
        />
        <StatCard
          title="Active Cashiers"
          value={String(employees.filter(e => e.role === 'CASHIER').length)}
          description="Authorized POS operators"
          icon={Shield}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Managers & Admins"
          value={String(employees.filter(e => e.role === 'OWNER' || e.role === 'MANAGER').length)}
          description="Supervisory access"
          icon={Shield}
        />
        <StatCard
          title="System Security"
          value="Role Enforced"
          description="Full audit logging active"
          icon={Lock}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 font-semibold">{filtered.length} active users</span>
        </div>

        {isLoading ? (
          <LoadingState message="Loading staff list..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch Location</TableHead>
                <TableHead>Phone / Contact</TableHead>
                <TableHead className="text-right">Sales Handled</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{emp.name}</div>
                        <div className="text-[10px] text-slate-400">{emp.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {emp.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium">
                    {emp.branch}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700">
                    {emp.phone}
                  </TableCell>
                  <TableCell className="text-right font-black text-slate-900 text-xs">
                    {formatCurrency(emp.totalSales)}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{emp.lastActive}</TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold transition-colors"
                    >
                      Permissions
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add / Edit Staff Modal & Permissions Matrix */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedEmp ? `Edit Permissions: ${selectedEmp.name}` : 'Invite Team Member'}
        subtitle="Configure role hierarchy and system feature permissions."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Dawit Yohannes"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="dawit@bikilatrading.et"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+251 911 234 567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="System Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={['OWNER', 'MANAGER', 'CASHIER', 'EMPLOYEE']}
            />
            <Select
              label="Branch"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              options={['Bole Main Branch', 'Mercato Wholesale Hub', 'Hawassa Branch']}
            />
          </div>

          {/* Permissions Checkbox Grid */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Feature Access Permissions
            </label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              {[
                { key: 'pos', label: 'POS Terminal & Sales' },
                { key: 'inventory', label: 'Inventory & Restocking' },
                { key: 'customers', label: 'Customer CRM & Debt' },
                { key: 'suppliers', label: 'Suppliers & Purchases' },
                { key: 'expenses', label: 'Operational Expenses' },
                { key: 'reports', label: 'Financial Analytics' },
                { key: 'employees', label: 'Staff Management' },
                { key: 'settings', label: 'Business Profile & TIN' },
              ].map((perm) => (
                <label key={perm.key} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!formData.permissions?.[perm.key]}
                    onChange={() => handleTogglePerm(perm.key)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 font-medium">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Permissions
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeesPage;

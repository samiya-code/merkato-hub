import React, { useState, useEffect } from 'react';
import {
  Building2,
  User,
  Shield,
  Bell,
  Sliders,
  Store,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Save,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';

export const SettingsPage = () => {
  const { business, updateBusiness } = useBusiness();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('business');

  const [formData, setFormData] = useState({
    legalName: 'Bikila Trading PLC',
    tinNumber: '0012456789',
    email: 'ops@bikilatrading.et',
    phone: '+251 91 123 4567',
    address: 'Bole Road, Africa Avenue, Addis Ababa, Ethiopia',
    sector: 'Retail & Commerce',
    currency: 'ETB',
    logo: '',
  });

  const [hours, setHours] = useState({
    Monday: { open: '08:00 AM', close: '06:00 PM', active: true },
    Tuesday: { open: '08:00 AM', close: '06:00 PM', active: true },
    Wednesday: { open: '08:00 AM', close: '06:00 PM', active: true },
    Thursday: { open: '08:00 AM', close: '06:00 PM', active: true },
    Friday: { open: '08:00 AM', close: '06:00 PM', active: true },
    Saturday: { open: '08:00 AM', close: '06:00 PM', active: true },
    Sunday: { open: '08:00 AM', close: '06:00 PM', active: false },
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (business) {
      setFormData({
        legalName: business.legalName || 'Bikila Trading PLC',
        tinNumber: business.tinNumber || '0012456789',
        email: business.email || 'ops@bikilatrading.et',
        phone: business.phone || '+251 91 123 4567',
        address: business.address || 'Bole Road, Africa Avenue, Addis Ababa, Ethiopia',
        sector: business.sector || 'Retail & Commerce',
        currency: business.currency || 'ETB',
        logo: business.logo || '',
      });
    }
  }, [business]);

  const handleToggleDay = (day) => {
    setHours({
      ...hours,
      [day]: { ...hours[day], active: !hours[day].active },
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateBusiness({ ...formData, operationalHours: hours });
      toast.success('Settings Saved', 'Business profile and operational hours updated.');
    } catch {
      toast.error('Error', 'Unable to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your business identity, account security, and system preferences.
        </p>
      </div>

      {/* Tabs Matching Visily Page 8 */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'business', label: 'Business Profile', icon: Building2 },
          { id: 'personal', label: 'Personal Account', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'preferences', label: 'Preferences', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2-Column Grid Layout Matching Visily Page 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Business Form + Operational Hours (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Business Information Card */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Business Information</h3>
              <p className="text-xs text-slate-500">Public information about your company. This will appear on invoices and reports.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Legal Business Name"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                required
              />

              <Input
                label="Tax Identification Number (TIN)"
                value={formData.tinNumber}
                onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                placeholder="0012456789"
                required
              />

              <Input
                label="Business Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Contact Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <div className="sm:col-span-2">
                <Input
                  label="Headquarters Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <Select
                label="Business Sector"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                options={[
                  'Retail & Commerce',
                  'Grocery & Mini Market',
                  'Pharmacy & Medical',
                  'Clothing & Boutique',
                  'Electronics & Hardware',
                  'Restaurant & Café',
                  'Services & Salon',
                ]}
              />

              <Select
                label="Operational Currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                options={[
                  { value: 'ETB', label: 'Ethiopian Birr (ETB)' },
                  { value: 'USD', label: 'US Dollar (USD)' },
                ]}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" type="button" onClick={() => window.location.reload()}>
                Discard Changes
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} icon={Save}>
                Save Profile
              </Button>
            </div>
          </form>

          {/* Operational Hours Card Matching Visily Page 8 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Operational Hours</h3>
              <p className="text-xs text-slate-500">Define your business working hours for delivery and support coordination.</p>
            </div>

            <div className="space-y-2.5">
              {Object.keys(hours).map((day) => {
                const item = hours[day];
                return (
                  <div key={day} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5 w-32 font-bold text-slate-800">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{day}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
                        {item.open}
                      </span>
                      <span className="text-slate-400">to</span>
                      <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
                        {item.close}
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        item.active ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          item.active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Brand Assets + Subscription + Compliance Alert (4 Cols Matching Visily Page 8) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Brand Assets */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-center space-y-3">
            <h3 className="text-sm font-bold text-slate-900 text-left">Brand Assets</h3>

            <div className="w-24 h-24 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-600 shadow-inner">
              <Store className="w-12 h-12" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">Store Logo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Recommended: 512×512px SVG or PNG</p>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              Update Logo
            </Button>
          </div>

          {/* Subscription Plan Card Matching Page 8 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Subscription Plan</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                Active
              </span>
            </div>

            <div>
              <p className="text-base font-black text-slate-900">Enterprise Plus</p>
              <p className="text-xs text-slate-500">Up to 50 locations</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Storage used</span>
                <span>8.2 GB / 20 GB</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '41%' }} />
              </div>
            </div>

            <button
              onClick={() => alert('Opening Upgrade Plan Portal')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 block"
            >
              Upgrade Plan ›
            </button>
          </div>

          {/* Compliance Alert Box Matching Page 8 */}
          <div className="rounded-2xl bg-rose-50/80 border border-rose-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Compliance Alert</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Your trade license expires in 14 days. Please upload the renewed document to avoid POS disruption.
            </p>
          </div>

          {/* 24/7 Support Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Need help with configuration?</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Our support team is available 24/7 for Ethiopian merchants.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

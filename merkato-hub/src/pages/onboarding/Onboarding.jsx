import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Store,
  Building,
  MapPin,
  Coins,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Utensils,
  Coffee,
  Scissors,
  Hammer,
  Smartphone,
  Shirt,
  Pill,
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

export const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { completeOnboarding } = useBusiness();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    businessName: 'Bikila Trading PLC',
    businessType: 'Retail Shop',
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    subcity: 'Bole Sub-City',
    woreda: 'Woreda 03 (Medhanealem)',
    currency: 'ETB',
    tin: '0012456789',
    employeeCount: '6 - 20 Employees',
  });

  const businessTypes = [
    { label: 'Retail Shop', icon: Store, desc: 'General merchandise & goods' },
    { label: 'Grocery / Mini Market', icon: ShoppingBag, desc: 'Food items & daily essentials' },
    { label: 'Pharmacy', icon: Pill, desc: 'Medicines & health supplies' },
    { label: 'Clothing & Boutique', icon: Shirt, desc: 'Fashion, netela & apparel' },
    { label: 'Electronics & Mobile', icon: Smartphone, desc: 'Phones, chargers & appliances' },
    { label: 'Restaurant & Bar', icon: Utensils, desc: 'Dine-in, traditional dishes' },
    { label: 'Café & Pastry', icon: Coffee, desc: 'Buna, espresso & snacks' },
    { label: 'Salon & Spa', icon: Scissors, desc: 'Hair, cosmetics & beauty' },
    { label: 'Hardware & Building', icon: Hammer, desc: 'Tools, paints & materials' },
  ];

  const handleNext = () => {
    if (step === 1 && !formData.businessName.trim()) {
      toast.warning('Required', 'Please enter your business name.');
      return;
    }
    if (step < 5) {
      setStep(step + 1);
    } else if (step === 5) {
      // Step 6 Trigger
      setStep(6);
      triggerConfetti();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#10b981', '#f59e0b', '#0284c7'],
    });
  };

  const handleFinish = async () => {
    await completeOnboarding(formData);
    toast.success('Setup Completed!', `Welcome to ${formData.businessName} on MerkatoHub.`);
    navigate('/dashboard');
  };

  const stepsList = [
    { num: 1, label: 'Business Name' },
    { num: 2, label: 'Type' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Currency & Tax' },
    { num: 5, label: 'Staff Size' },
    { num: 6, label: 'Finish' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-slate-900 to-slate-950 -z-10" />

      <div className="max-w-2xl w-full mx-auto">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Ethiopian SME Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Set up your MerkatoHub workspace</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Let's configure your shop settings in under 2 minutes.
          </p>
        </div>

        {/* Stepper indicator */}
        <div className="flex items-center justify-between mb-8 px-2 max-w-lg mx-auto">
          {stepsList.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.num
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                      : step === s.num
                      ? 'bg-white text-slate-900 ring-4 ring-white/20'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="hidden sm:block text-[10px] mt-1.5 font-medium text-slate-400">
                  {s.label}
                </span>
              </div>
              {idx < stepsList.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    step > s.num ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card Body */}
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 animate-fade-in">
          {/* STEP 1: Business Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">What is your business called?</h2>
                  <p className="text-xs text-slate-500">This name will appear on your POS receipts and reports.</p>
                </div>
              </div>

              <Input
                label="Legal Business / Store Name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Bikila Trading PLC, Selam Fashion..."
                required
              />

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600">
                💡 <span className="font-semibold">Quick suggestion:</span> You can register multiple branches later from your dashboard settings.
              </div>
            </div>
          )}

          {/* STEP 2: Business Type */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Select your industry / sector</h2>
                  <p className="text-xs text-slate-500">We'll tailor your default categories and POS workflows.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {businessTypes.map((bt) => {
                  const Icon = bt.icon;
                  const isSelected = formData.businessType === bt.label;
                  return (
                    <button
                      key={bt.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, businessType: bt.label })}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold text-slate-900 leading-tight">{bt.label}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{bt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Business Location */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Where is your business located?</h2>
                  <p className="text-xs text-slate-500">Required for official Ethiopian tax invoices and delivery zones.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Region / State"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  options={['Addis Ababa', 'Oromia', 'Amhara', 'Sidama', 'Dire Dawa', 'Tigray', 'SNNPR', 'Somali']}
                />
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Addis Ababa"
                />
                <Select
                  label="Sub-City / Zone"
                  value={formData.subcity}
                  onChange={(e) => setFormData({ ...formData, subcity: e.target.value })}
                  options={[
                    'Bole Sub-City',
                    'Kirkos Sub-City',
                    'Arada Sub-City',
                    'Yeka Sub-City',
                    'Nifas Silk-Lafto',
                    'Lideta Sub-City',
                    'Kolfe Keranio',
                    'Akaki Kality',
                    'Gullele Sub-City',
                    'Addis Ketema (Merkato)',
                  ]}
                />
                <Input
                  label="Woreda / Street / Landmark"
                  value={formData.woreda}
                  onChange={(e) => setFormData({ ...formData, woreda: e.target.value })}
                  placeholder="e.g. Woreda 03, Africa Avenue"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Currency & Tax TIN */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Currency & Tax Profile</h2>
                  <p className="text-xs text-slate-500">Configure Ethiopian Birr (ETB) and your Ministry of Revenues TIN.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Operational Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  options={[
                    { value: 'ETB', label: 'ETB — Ethiopian Birr (Default)' },
                    { value: 'USD', label: 'USD — US Dollar' },
                  ]}
                />
                <Input
                  label="Tax Identification Number (TIN)"
                  value={formData.tin}
                  onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                  placeholder="10-digit TIN (e.g. 0012456789)"
                  helperText="15% standard VAT will be automatically computed."
                />
              </div>
            </div>
          )}

          {/* STEP 5: Staff Size */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">How many employees work at your business?</h2>
                  <p className="text-xs text-slate-500">We'll set up appropriate cashier and manager access roles.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Just me (1 Person)', desc: 'Sole proprietorship / Solo merchant' },
                  { label: '2 - 5 Employees', desc: 'Small retail shop or café' },
                  { label: '6 - 20 Employees', desc: 'Growing SME with multiple cashiers' },
                  { label: '20+ Employees', desc: 'Multi-branch enterprise or distributor' },
                ].map((size) => (
                  <button
                    key={size.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, employeeCount: size.label })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.employeeCount === size.label
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="text-sm font-bold">{size.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{size.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Setup Complete Celebration */}
          {step === 6 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">You're ready to run smarter!</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                <span className="font-bold text-slate-800">{formData.businessName}</span> has been configured with Ethiopian SME tools, sample product catalog, and active POS terminal.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Business Sector:</span>
                  <span className="font-bold text-slate-800">{formData.businessType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-800">{formData.subcity}, {formData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Currency & Tax:</span>
                  <span className="font-bold text-slate-800">{formData.currency} (15% VAT)</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full max-w-md mx-auto justify-center"
                  onClick={handleFinish}
                  iconRight={ArrowRight}
                >
                  Launch MerkatoHub Dashboard
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {step < 6 && (
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                disabled={step === 1}
                icon={ArrowLeft}
              >
                Back
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                iconRight={ArrowRight}
              >
                {step === 5 ? 'Complete Setup' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

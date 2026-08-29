import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export const Login = () => {
  const { login, switchDemoRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('abebe@bikilatrading.et');
  const [password, setPassword] = useState('••••••••');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password, remember });
      toast.success('Welcome Back!', 'Signed into Bikila Trading PLC dashboard.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      toast.error('Login Failed', 'Please check your login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    switchDemoRole(role);
    toast.info('Demo Profile Activated', `Logged in as ${role}`);
    navigate('/dashboard');
  };

  return (
    <div>
      {/* Title */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-xs text-slate-500 mt-1">
          Sign in to your merchant account to manage your operations.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@business.com.et"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</span>
            <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="remember" className="ml-2 text-xs text-slate-600 cursor-pointer select-none">
            Remember this device for 30 days
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-between"
          isLoading={isLoading}
          iconRight={ArrowRight}
        >
          Sign In to Dashboard
        </Button>
      </form>

      {/* Register Switch */}
      <div className="mt-5 text-center">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          New to MerkatoHub?
        </div>
        <Link to="/register">
          <Button variant="outline" size="md" className="w-full">
            Register Your Business
          </Button>
        </Link>
      </div>

      {/* Fast Demo Quick Logins */}
      <div className="mt-5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>One-Click Demo Roles</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickDemo('OWNER')}
            className="text-[11px] font-semibold py-1 px-1.5 rounded-md bg-white border border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
          >
            Abebe (Owner)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('MANAGER')}
            className="text-[11px] font-semibold py-1 px-1.5 rounded-md bg-white border border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
          >
            Sara (Manager)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('CASHIER')}
            className="text-[11px] font-semibold py-1 px-1.5 rounded-md bg-white border border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
          >
            Dawit (Cashier)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

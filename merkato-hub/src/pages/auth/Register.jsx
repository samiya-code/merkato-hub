import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export const Register = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+251 ');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.warning('Terms Required', 'Please accept the terms and conditions.');
      return;
    }

    setIsLoading(true);
    try {
      await register({ fullName, email, phone, password });
      toast.success('Account Created!', 'Welcome to MerkatoHub. Let us set up your business.');
      navigate('/onboarding');
    } catch {
      toast.error('Registration Failed', 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create Merchant Account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Join thousands of Ethiopian businesses growing with MerkatoHub.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          type="text"
          icon={User}
          placeholder="e.g. Abebe Bikila"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@business.com.et"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Ethiopian Phone Number"
          type="tel"
          icon={Phone}
          placeholder="+251 911 234 567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="terms" className="ml-2 text-xs text-slate-600 cursor-pointer select-none">
            I agree to the <a href="#terms" className="text-emerald-600 underline">Terms of Service</a> and <a href="#privacy" className="text-emerald-600 underline">Privacy Policy</a>.
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-between mt-2"
          isLoading={isLoading}
          iconRight={ArrowRight}
        >
          Continue to Business Setup
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

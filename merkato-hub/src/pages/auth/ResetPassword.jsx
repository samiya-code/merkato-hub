import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Mismatch', 'Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword('mock_token', password);
      toast.success('Password Reset', 'You can now sign in with your new password.');
      navigate('/login');
    } catch {
      toast.error('Error', 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Set New Password</h2>
        <p className="text-xs text-slate-500 mt-1">Please enter your new strong password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
          Update Password & Sign In
        </Button>
      </form>
    </div>
  );
};

export const VerifyEmail = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (index, val) => {
    if (val.length <= 1) {
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);
      if (val && index < 5) {
        document.getElementById(`digit-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      toast.warning('Invalid Code', 'Please enter all 6 digits.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyEmail(fullCode);
      toast.success('Verified!', 'Your email has been confirmed.');
      navigate('/dashboard');
    } catch {
      toast.error('Error', 'Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5 text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Verify Your Email</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter the 6-digit confirmation code sent to your email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`digit-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          ))}
        </div>

        <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
          Verify & Continue
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;

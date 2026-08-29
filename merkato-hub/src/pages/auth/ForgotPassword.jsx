import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Reset Code Sent', `Instructions sent to ${email}`);
    } catch {
      toast.error('Error', 'Unable to send recovery email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reset Password</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered business email and we will send you a password reset link.
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Check your inbox</p>
          <p className="text-xs text-slate-500">
            We sent a verification link to <span className="font-semibold text-slate-700">{email}</span>.
          </p>
          <Link to="/login" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full">
              Return to Login
            </Button>
          </Link>
        </div>
      ) : (
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

          <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
            Send Reset Instructions
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;

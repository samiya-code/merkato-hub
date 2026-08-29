import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  suffix,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={`block w-full rounded-lg text-sm transition-colors border outline-none
            ${Icon ? 'pl-9' : 'pl-3.5'}
            ${isPassword || suffix ? 'pr-10' : 'pr-3.5'}
            py-2.5 bg-white text-slate-900 placeholder:text-slate-400
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
            }
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {!isPassword && suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-semibold text-slate-500">
            {suffix}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  required,
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`block w-full appearance-none rounded-lg text-sm transition-colors border outline-none
            ${Icon ? 'pl-9' : 'pl-3.5'}
            pr-10 py-2.5 bg-white text-slate-900 cursor-pointer
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
            }
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        >
          {children ? (
            children
          ) : (
            options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })
          )}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;

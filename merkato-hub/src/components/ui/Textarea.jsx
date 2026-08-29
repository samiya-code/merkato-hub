import React from 'react';

export const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  rows = 3,
  id,
  required,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`block w-full rounded-lg text-sm transition-colors border outline-none p-3 bg-white text-slate-900 placeholder:text-slate-400
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
            }
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;

import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info' | 'vip' | 'neutral'
  size = 'sm', // 'sm' | 'md'
  dot = false,
  className = '',
}) => {
  // Normalize string variant from common status names
  let resolvedVariant = variant;
  const lower = typeof children === 'string' ? children.toLowerCase() : '';

  if (variant === 'default') {
    if (lower.includes('in stock') || lower.includes('paid') || lower.includes('completed') || lower.includes('active') || lower.includes('approved') || lower.includes('received')) {
      resolvedVariant = 'success';
    } else if (lower.includes('low stock') || lower.includes('partially') || lower.includes('pending') || lower.includes('warning')) {
      resolvedVariant = 'warning';
    } else if (lower.includes('out of stock') || lower.includes('overdue') || lower.includes('cancelled') || lower.includes('inactive') || lower.includes('danger')) {
      resolvedVariant = 'danger';
    } else if (lower.includes('vip')) {
      resolvedVariant = 'vip';
    } else if (lower.includes('info') || lower.includes('telebirr') || lower.includes('cbe')) {
      resolvedVariant = 'info';
    }
  }

  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    vip: 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    vip: 'bg-white',
    neutral: 'bg-slate-400',
    default: 'bg-slate-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${sizes[size]} ${variants[resolvedVariant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[resolvedVariant]}`} />}
      {children}
    </span>
  );
};

export default Badge;

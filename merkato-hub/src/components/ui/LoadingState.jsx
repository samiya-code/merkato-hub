import React from 'react';
import { Loader2, PackageOpen, AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const LoadingState = ({
  message = 'Loading data...',
  rows = 5,
  type = 'spinner', // 'spinner' | 'skeleton'
}) => {
  if (type === 'skeleton') {
    return (
      <div className="w-full space-y-3 animate-pulse p-4">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 my-4 ${className}`}>
      <div className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl mb-3.5 ring-8 ring-slate-50/50">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-rose-50/50 rounded-xl border border-rose-200/80 my-4">
      <div className="p-3 bg-rose-100 text-rose-600 rounded-xl mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-rose-900 mb-1">{title}</h3>
      <p className="text-xs text-rose-700 max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
};

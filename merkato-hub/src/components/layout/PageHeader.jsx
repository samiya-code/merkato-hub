import React from 'react';
import Breadcrumb from '../ui/Breadcrumb';

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  children,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {breadcrumbs.length > 0 && (
        <div className="mb-2">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center flex-wrap gap-2.5">{actions}</div>}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;

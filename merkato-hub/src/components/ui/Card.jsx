import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = 'p-5 sm:p-6',
  headerClassName = 'px-5 py-4 border-b border-slate-100 flex items-center justify-between',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <div className={headerClassName}>
          <div>
            {title && <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default Card;

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  iconColor = 'text-emerald-600',
  iconBg = 'bg-emerald-50',
  description,
  className = '',
  onClick,
}) => {
  const isUp = isPositive !== undefined ? isPositive : (change && !change.startsWith('-'));

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 relative overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shrink-0 shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3.5 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          {change && (
            <div
              className={`inline-flex items-center font-semibold gap-0.5 ${
                isUp ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isUp ? (
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span>{change}</span>
            </div>
          )}
          {description && (
            <span className="text-slate-400 truncate max-w-[200px]" title={description}>
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;

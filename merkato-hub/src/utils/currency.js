/**
 * Utility functions for Ethiopian Birr (ETB) and number formatting
 */

export const formatCurrency = (amount, options = {}) => {
  const { showSymbol = true, decimals = 2 } = options;
  const num = Number(amount) || 0;
  
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return showSymbol ? `${formatted} ETB` : formatted;
};

export const formatCompactNumber = (number) => {
  const num = Number(number) || 0;
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M ETB';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K ETB';
  }
  return `${num.toLocaleString()} ETB`;
};

export const calculateVat = (subtotal, rate = 0.15) => {
  const num = Number(subtotal) || 0;
  return Math.round(num * rate * 100) / 100;
};

export { formatDate, formatDateTime, formatTime, getRelativeTime } from './date';

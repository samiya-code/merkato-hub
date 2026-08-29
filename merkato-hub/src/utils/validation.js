/**
 * Validation utilities for Ethiopian business context
 */

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validateEthiopianPhone = (phone) => {
  if (!phone) return 'Phone number is required';
  // Matches +251 9... or +251 7... or 09... or 07...
  const cleaned = phone.replace(/[\s-]/g, '');
  const re = /^(\+251|0)(9|7)\d{8}$/;
  if (!re.test(cleaned)) {
    return 'Enter a valid Ethiopian phone number (e.g. +251 911 234 567 or 0911234567)';
  }
  return '';
};

export const validateTIN = (tin) => {
  if (!tin) return 'TIN is required';
  const cleaned = tin.replace(/\s/g, '');
  if (!/^\d{10}$/.test(cleaned)) {
    return 'Ethiopian TIN must be exactly 10 digits';
  }
  return '';
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return '';
};

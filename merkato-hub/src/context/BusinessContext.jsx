import React, { createContext, useContext, useState, useEffect } from 'react';
import { businessService } from '../services/businessService';

const BusinessContext = createContext(null);

export const BusinessProvider = ({ children }) => {
  const [business, setBusiness] = useState(null);
  const [activeBranch, setActiveBranch] = useState('Bole Main Branch');
  const [language, setLanguage] = useState('EN'); // EN | AM | OR | TI
  const [isLoading, setIsLoading] = useState(true);

  const loadBusiness = async () => {
    try {
      const data = await businessService.getProfile();
      setBusiness(data);
      if (data.branches && data.branches.length > 0) {
        const primary = data.branches.find(b => b.isPrimary) || data.branches[0];
        setActiveBranch(primary.name);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBusiness();
  }, []);

  const updateBusiness = async (updates) => {
    const updated = await businessService.updateProfile(updates);
    setBusiness(updated);
    return updated;
  };

  const completeOnboarding = async (onboardingData) => {
    const res = await businessService.completeOnboarding(onboardingData);
    if (res.business) {
      setBusiness(res.business);
    }
    return res;
  };

  const value = {
    business,
    activeBranch,
    setActiveBranch,
    language,
    setLanguage,
    isLoading,
    updateBusiness,
    completeOnboarding,
    reloadBusiness: loadBusiness,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

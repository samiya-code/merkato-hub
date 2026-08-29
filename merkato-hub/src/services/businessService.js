/**
 * Business & Onboarding Service
 */
import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

const DEFAULT_BUSINESS = {
  id: 'BIZ-001',
  legalName: 'Bikila Trading PLC',
  tradeName: 'MerkatoHub Bole',
  tinNumber: '0012456789',
  email: 'ops@bikilatrading.et',
  phone: '+251 911 234 567',
  address: 'Bole Road, Africa Avenue, Addis Ababa, Ethiopia',
  sector: 'Retail & Commerce',
  currency: 'ETB',
  vatRate: 0.15,
  vatRegistered: true,
  branches: [
    { id: 'BR-1', name: 'Bole Main Branch', isPrimary: true },
    { id: 'BR-2', name: 'Mercato Wholesale Hub', isPrimary: false },
    { id: 'BR-3', name: 'Hawassa Branch', isPrimary: false },
  ],
  operationalHours: {
    Monday: { open: '08:00 AM', close: '06:00 PM', closed: false },
    Tuesday: { open: '08:00 AM', close: '06:00 PM', closed: false },
    Wednesday: { open: '08:00 AM', close: '06:00 PM', closed: false },
    Thursday: { open: '08:00 AM', close: '06:00 PM', closed: false },
    Friday: { open: '08:00 AM', close: '06:00 PM', closed: false },
    Saturday: { open: '08:00 AM', close: '06:00 PM', closed: false },
    Sunday: { open: '08:00 AM', close: '06:00 PM', closed: true },
  },
  subscription: {
    plan: 'Enterprise Plus',
    status: 'Active',
    maxLocations: 50,
    storageUsed: '8.2 GB',
    storageMax: '20 GB',
    complianceAlert: 'Trade license renews in 14 days.',
  }
};

class BusinessService {
  getProfile() {
    const saved = localStorage.getItem('merkatohub_business');
    if (saved) {
      try {
        return Promise.resolve(JSON.parse(saved));
      } catch {
        // pass
      }
    }
    return Promise.resolve(DEFAULT_BUSINESS);
  }

  async updateProfile(updates) {
    try {
      const current = await this.getProfile();
      const updated = { ...current, ...updates };
      localStorage.setItem('merkatohub_business', JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_BUSINESS;
    }
  }

  async completeOnboarding(onboardingData) {
    try {
      const business = {
        ...DEFAULT_BUSINESS,
        legalName: onboardingData.businessName || DEFAULT_BUSINESS.legalName,
        sector: onboardingData.businessType || DEFAULT_BUSINESS.sector,
        address: `${onboardingData.subcity || ''}, ${onboardingData.city || 'Addis Ababa'}, ${onboardingData.region || 'Addis Ababa'}`,
        currency: onboardingData.currency || 'ETB',
        tinNumber: onboardingData.tin || DEFAULT_BUSINESS.tinNumber,
      };
      localStorage.setItem('merkatohub_business', JSON.stringify(business));
      
      const userStr = localStorage.getItem('merkatohub_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.needsOnboarding = false;
        user.businessName = business.legalName;
        localStorage.setItem('merkatohub_user', JSON.stringify(user));
      }

      return { success: true, business };
    } catch (e) {
      console.error(e);
      return { success: true, business: DEFAULT_BUSINESS };
    }
  }
}

export const businessService = new BusinessService();
export default businessService;

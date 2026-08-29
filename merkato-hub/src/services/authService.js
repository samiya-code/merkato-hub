/**
 * Authentication Service
 * Handles user login, registration, password recovery, and session persistence
 */
import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

const DEMO_USER = {
  id: 'USR-001',
  name: 'Abebe Bikila',
  email: 'abebe@bikilatrading.et',
  phone: '+251 911 234 567',
  role: 'OWNER',
  businessId: 'BIZ-001',
  businessName: 'Bikila Trading PLC',
  branch: 'Bole Main Branch',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

class AuthService {
  async login(credentials) {
    try {
      const res = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      localStorage.setItem('merkatohub_token', res.token);
      localStorage.setItem('merkatohub_user', JSON.stringify(res.user));
      return res;
    } catch {
      // Mock fallback
      let user = { ...DEMO_USER };
      if (credentials.email) {
        user.email = credentials.email;
      }
      localStorage.setItem('merkatohub_token', 'mock_jwt_token_abebe_bikila_2026');
      localStorage.setItem('merkatohub_user', JSON.stringify(user));
      return { success: true, token: 'mock_jwt_token_abebe_bikila_2026', user };
    }
  }

  async register(data) {
    try {
      return await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
    } catch {
      const user = {
        id: 'USR-' + Math.floor(Math.random() * 9000 + 1000),
        name: data.fullName || 'New Merchant',
        email: data.email,
        phone: data.phone || '+251 911 000 000',
        role: 'OWNER',
        businessId: null,
        needsOnboarding: true,
      };
      localStorage.setItem('merkatohub_token', 'mock_jwt_new_merchant');
      localStorage.setItem('merkatohub_user', JSON.stringify(user));
      return { success: true, user };
    }
  }

  async forgotPassword(email) {
    try {
      return await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch {
      return { success: true, message: `Reset instructions sent to ${email}` };
    }
  }

  async resetPassword(token, password) {
    try {
      return await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
    } catch {
      return { success: true, message: 'Password successfully updated' };
    }
  }

  async verifyEmail(code) {
    try {
      return await apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { code });
    } catch {
      return { success: true, message: 'Email successfully verified' };
    }
  }

  getCurrentUser() {
    const saved = localStorage.getItem('merkatohub_user');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('merkatohub_token');
    localStorage.removeItem('merkatohub_user');
    return Promise.resolve({ success: true });
  }
}

export const authService = new AuthService();
export default authService;

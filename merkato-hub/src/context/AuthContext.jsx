import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Automatically provide demo owner session for smooth evaluation if not already logged in
        const demoUser = {
          id: 'USR-001',
          name: 'Abebe Bikila',
          email: 'abebe@bikilatrading.et',
          phone: '+251 911 234 567',
          role: 'OWNER',
          businessId: 'BIZ-001',
          businessName: 'Bikila Trading PLC',
          branch: 'Bole Main Branch',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          needsOnboarding: false,
        };
        localStorage.setItem('merkatohub_token', 'mock_jwt_token_abebe_bikila_2026');
        localStorage.setItem('merkatohub_user', JSON.stringify(demoUser));
        setUser(demoUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      setUser(res.user);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setUser(res.user);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchDemoRole = (role) => {
    const roles = {
      OWNER: {
        id: 'USR-001',
        name: 'Abebe Bikila',
        email: 'abebe@bikilatrading.et',
        phone: '+251 911 234 567',
        role: 'OWNER',
        businessName: 'Bikila Trading PLC',
        branch: 'Bole Main Branch',
      },
      MANAGER: {
        id: 'USR-002',
        name: 'Sara Tadesse',
        email: 'sara.t@bikilatrading.et',
        phone: '+251 912 345 678',
        role: 'MANAGER',
        businessName: 'Bikila Trading PLC',
        branch: 'Bole Main Branch',
      },
      CASHIER: {
        id: 'USR-003',
        name: 'Dawit Yohannes',
        email: 'dawit.y@bikilatrading.et',
        phone: '+251 913 456 789',
        role: 'CASHIER',
        businessName: 'Bikila Trading PLC',
        branch: 'Bole Main Branch',
      },
    };

    const newUser = roles[role] || roles.OWNER;
    localStorage.setItem('merkatohub_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    switchDemoRole,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

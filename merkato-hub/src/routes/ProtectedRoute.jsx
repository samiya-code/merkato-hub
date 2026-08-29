import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingState from '../components/ui/LoadingState';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingState message="Loading your business session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingState message="Loading..." />
      </div>
    );
  }

  if (user && !user.needsOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

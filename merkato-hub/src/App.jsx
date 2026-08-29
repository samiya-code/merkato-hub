import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <BusinessProvider>
            <AppRoutes />
          </BusinessProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;

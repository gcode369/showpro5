import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { HomePage } from '../pages/Home';
import { LearnMorePage } from '../pages/LearnMore';
import { PropertiesPage } from '../pages/Properties';
import { CalendarPage } from '../pages/Calendar';
import { ClientsPage } from '../pages/Clients';
import { ProfilePage } from '../pages/Profile';
import { SubscriptionPage } from '../pages/subscription';
import { OpenHousesPage } from '../pages/agent/OpenHousesPage';
import { 
  AgentLoginPage,
  ClientLoginPage,
  AgentRegisterPage,
  ClientRegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage
} from '../pages/auth';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { supabase } from '../services/supabase';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function AppRoutes() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/learn-more" element={<LearnMorePage />} />
      <Route path="/login/agent" element={<AgentLoginPage />} />
      <Route path="/login/client" element={<ClientLoginPage />} />
      <Route path="/register/agent" element={<AgentRegisterPage />} />
      <Route path="/register/client" element={<ClientRegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected Routes */}
      <Route path="/subscription" element={
        <ProtectedRoute userType="agent">
          <SubscriptionPage />
        </ProtectedRoute>
      } />

      <Route path="/agent" element={
        <ProtectedRoute userType="agent" requiresSubscription>
          <Layout userType="agent" />
        </ProtectedRoute>
      }>
        <Route index element={<CalendarPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="open-houses" element={<OpenHousesPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/client" element={
        <ProtectedRoute userType="client">
          <Layout userType="client" />
        </ProtectedRoute>
      }>
        <Route index element={<PropertiesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
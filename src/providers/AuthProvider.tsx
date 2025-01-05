import React from 'react';
import { useAuthState } from '../hooks/auth/useAuthState';
import { LoadingGuard } from '../components/common/LoadingGuard';

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { loading, error } = useAuthState();

  return (
    <LoadingGuard loading={loading} error={error}>
      {children}
    </LoadingGuard>
  );
}
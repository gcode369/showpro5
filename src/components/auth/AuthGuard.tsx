import React from 'react';
import { useAuthGuard } from '../../hooks/auth/useAuthGuard';
import { LoadingGuard } from '../common/LoadingGuard';
import { useAuthState } from '../../hooks/auth/useAuthState';

type AuthGuardProps = {
  children: React.ReactNode;
  userType?: 'agent' | 'client';
  requiresSubscription?: boolean;
};

export function AuthGuard({ children, userType, requiresSubscription = false }: AuthGuardProps) {
  const { loading, error } = useAuthState();
  useAuthGuard(userType, requiresSubscription);

  return (
    <LoadingGuard loading={loading} error={error}>
      {children}
    </LoadingGuard>
  );
}
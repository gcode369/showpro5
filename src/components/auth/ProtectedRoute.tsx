import React from 'react';
import { AuthGuard } from './AuthGuard';

type ProtectedRouteProps = {
  children: React.ReactNode;
  userType?: 'agent' | 'client';
  requiresSubscription?: boolean;
};

export function ProtectedRoute({ children, userType, requiresSubscription = false }: ProtectedRouteProps) {
  return (
    <AuthGuard userType={userType} requiresSubscription={requiresSubscription}>
      {children}
    </AuthGuard>
  );
}
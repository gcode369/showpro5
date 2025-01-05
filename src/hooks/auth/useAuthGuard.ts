import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function useAuthGuard(userType?: 'agent' | 'client', requiresSubscription = false) {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate(`/login/${userType || 'client'}`, { 
        state: { from: location },
        replace: true 
      });
      return;
    }

    if (userType && user.role !== userType) {
      navigate(`/${user.role}`, { 
        state: { from: location },
        replace: true 
      });
      return;
    }

    if (requiresSubscription && user.role === 'agent') {
      const needsSubscription = !user.subscriptionStatus || user.subscriptionStatus === 'inactive';
      const isSubscriptionPage = location.pathname === '/subscription';

      if (needsSubscription && !isSubscriptionPage) {
        navigate('/subscription', { 
          state: { from: location },
          replace: true 
        });
      }
    }
  }, [user, isAuthenticated, userType, requiresSubscription, navigate, location]);

  return { user, isAuthenticated };
}
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function useSubscriptionCheck() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'agent') {
      const needsSubscription = !user.subscriptionStatus || user.subscriptionStatus === 'inactive';
      const isSubscriptionPage = window.location.pathname === '/subscription';

      if (needsSubscription && !isSubscriptionPage) {
        navigate('/subscription');
      }
    }
  }, [user, navigate]);

  return {
    needsSubscription: user?.role === 'agent' && (!user.subscriptionStatus || user.subscriptionStatus === 'inactive')
  };
}
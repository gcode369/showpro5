import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import type { PlanType } from '../types/subscription';

export function useSubscription() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    // Immediately redirect if:
    // 1. User is not logged in
    // 2. User is not an agent
    // 3. User is already subscribed or in trial
    if (!user) {
      navigate('/login/agent', { replace: true });
      return;
    }

    if (user.role !== 'agent') {
      navigate('/', { replace: true });
      return;
    }

    if (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trial') {
      navigate('/agent', { replace: true });
      return;
    }
  }, [user, navigate]);

  const handleSubscribe = (planType: PlanType) => {
    if (!user) return;
    window.location.href = SUBSCRIPTION_PLANS[planType].paymentLink;
  };

  return {
    canAccessSubscription: user?.role === 'agent' && (!user.subscriptionStatus || user.subscriptionStatus === 'inactive'),
    handleSubscribe
  };
}
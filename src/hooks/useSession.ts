import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { getUserProfile } from '../services/auth/profileService';
import { useLoadingState } from './useLoadingState';
import { handleAuthError } from '../utils/errorHandling';

export function useSession() {
  const { setUser, clearUser } = useAuthStore();
  const { startLoading, stopLoading } = useLoadingState();

  const initSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!session?.user) {
        clearUser();
        stopLoading();
        return;
      }

      const userRole = session.user.user_metadata.role || 'client';
      const profile = await getUserProfile(session.user.id, userRole);

      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: profile.name,
        role: userRole,
        subscriptionStatus: 'subscription_status' in profile ? profile.subscription_status : undefined,
        subscriptionTier: 'subscription_tier' in profile ? profile.subscription_tier : undefined
      });
      stopLoading();
    } catch (err) {
      console.error('Session initialization error:', err);
      clearUser();
      stopLoading(handleAuthError(err).message);
    }
  }, [setUser, clearUser, stopLoading]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      startLoading();
      initSession();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        clearUser();
        stopLoading();
      } else if (event === 'SIGNED_IN') {
        await initSession();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initSession, startLoading, clearUser, stopLoading]);
}
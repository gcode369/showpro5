import { useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import { useLoadingState } from '../useLoadingState';
import { getUserProfile } from '../../services/auth/profileService';
import { handleAuthError } from '../../utils/errorHandling';

export function useSession() {
  const { setUser, clearUser } = useAuthStore();
  const { startLoading, stopLoading } = useLoadingState();

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        startLoading();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session?.user) {
          clearUser();
          return;
        }

        const userRole = session.user.user_metadata.role || 'client';
        const profile = await getUserProfile(session.user.id, userRole);
        
        if (!mounted) return;

        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile.name,
          role: userRole,
          subscriptionStatus: 'subscription_status' in profile ? profile.subscription_status : undefined,
          subscriptionTier: 'subscription_tier' in profile ? profile.subscription_tier : undefined
        });
      } catch (err) {
        console.error('Session initialization error:', err);
        if (mounted) {
          clearUser();
          stopLoading(handleAuthError(err).message);
        }
      } finally {
        if (mounted) {
          stopLoading();
        }
      }
    };

    initSession();

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
  }, [setUser, clearUser, startLoading, stopLoading]);
}
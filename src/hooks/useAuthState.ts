import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { getUserProfile } from '../services/auth/profileService';

export function useAuthState() {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user || !mounted) {
          clearUser();
          setIsInitialized(true);
          return;
        }

        const userRole = session.user.user_metadata.role || 'client';
        const profile = await getUserProfile(session.user.id, userRole);
        
        if (mounted) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile.name,
            role: userRole,
            subscriptionStatus: 'subscription_status' in profile ? profile.subscription_status : undefined,
            subscriptionTier: 'subscription_tier' in profile ? profile.subscription_tier : undefined
          });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          clearUser();
        }
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        clearUser();
      } else if (event === 'SIGNED_IN' && session?.user) {
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
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, clearUser]);

  return {
    user,
    isAuthenticated,
    isInitialized
  };
}
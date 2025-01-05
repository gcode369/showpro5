import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';
import { getUserProfile } from '../../services/auth/profileService';

export function useAuthState() {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session?.user) {
          if (mounted) {
            clearUser();
            setLoading(false);
          }
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
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          clearUser();
          setError(err instanceof Error ? err.message : 'Failed to initialize auth');
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        clearUser();
        setLoading(false);
      } else if (event === 'SIGNED_IN' && session?.user) {
        await initAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, clearUser]);

  return { user, isAuthenticated, loading, error };
}
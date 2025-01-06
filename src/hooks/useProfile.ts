import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import type { Agent } from '../types/agent';

export function useProfile() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      syncProfile();
    }
  }, [user?.id]);

  const syncProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data: profile, error: profileError } = await supabase
        .from(user.role === 'agent' ? 'agent_profiles' : 'client_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      // Update local state with synced profile data
      updateUser({
        ...user,
        ...profile
      });
    } catch (err) {
      console.error('Profile sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Agent>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) throw new Error('User not authenticated');

      const { error: updateError } = await supabase
        .from(user.role === 'agent' ? 'agent_profiles' : 'client_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local state
      updateUser({
        ...user,
        ...updates
      });

      return true;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
    syncProfile
  };
}
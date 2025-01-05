import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Agent } from '../types/agent';

export function useAgentProfile(agentId: string) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const { data, error } = await supabase
          .from('agent_profiles')
          .select(`
            *,
            users:user_id (
              email
            ),
            follower_count:agent_followers (count)
          `)
          .eq('user_id', agentId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Agent not found');

        setAgent({
          id: data.user_id,
          email: data.users.email,
          name: data.name,
          username: data.username,
          phone: data.phone,
          areas: data.areas || [],
          rating: data.rating,
          reviews: data.reviews,
          bio: data.bio,
          languages: data.languages,
          certifications: data.certifications,
          subscriptionStatus: data.subscription_status,
          subscriptionTier: data.subscription_tier
        });
      } catch (err) {
        console.error('Error fetching agent:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch agent profile');
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgent();
    }
  }, [agentId]);

  return { agent, loading, error };
}
import { useState } from 'react';
import { supabase } from '../services/supabase';
import type { Agent } from '../types/agent';

export function useAgentSearch() {
  const [results, setResults] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAgents = async (query: string, area?: string) => {
    try {
      setLoading(true);
      setError(null);

      let searchQuery = supabase
        .from('agent_profiles')
        .select(`
          *,
          users:user_id (email),
          follower_count:agent_followers (count)
        `)
        .eq('subscription_status', 'active');

      if (query) {
        searchQuery = searchQuery.or(`username.ilike.%${query}%,name.ilike.%${query}%`);
      }

      if (area) {
        searchQuery = searchQuery.contains('areas', [area]);
      }

      const { data, error: searchError } = await searchQuery;

      if (searchError) throw searchError;

      setResults(data.map(agent => ({
        id: agent.user_id,
        email: agent.users.email,
        name: agent.name,
        username: agent.username,
        phone: agent.phone,
        areas: agent.areas || [],
        rating: agent.rating,
        reviews: agent.reviews,
        bio: agent.bio,
        languages: agent.languages,
        certifications: agent.certifications,
        subscriptionStatus: agent.subscription_status,
        subscriptionTier: agent.subscription_tier
      })));
    } catch (err) {
      console.error('Agent search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search agents');
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    searchAgents
  };
}
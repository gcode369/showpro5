import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export function useFollowing(userId: string) {
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_followers')
        .select('agent_id')
        .eq('follower_id', userId);

      if (error) throw error;
      setFollowing(data.map(f => f.agent_id));
    } catch (err) {
      console.error('Error fetching following:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch following');
    } finally {
      setLoading(false);
    }
  };

  const followAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agent_followers')
        .insert({ follower_id: userId, agent_id: agentId });

      if (error) throw error;
      setFollowing(prev => [...prev, agentId]);
    } catch (err) {
      console.error('Error following agent:', err);
      throw err;
    }
  };

  const unfollowAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agent_followers')
        .delete()
        .eq('follower_id', userId)
        .eq('agent_id', agentId);

      if (error) throw error;
      setFollowing(prev => prev.filter(id => id !== agentId));
    } catch (err) {
      console.error('Error unfollowing agent:', err);
      throw err;
    }
  };

  const isFollowing = (agentId: string) => following.includes(agentId);
  const getFollowedAgents = () => following;

  return {
    following,
    loading,
    error,
    followAgent,
    unfollowAgent,
    isFollowing,
    getFollowedAgents
  };
}
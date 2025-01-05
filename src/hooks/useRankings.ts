import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useFollowing } from './useFollowing';
import { useClients } from './useClients';
import type { AgentRanking, AreaRanking } from '../types/ranking';
import { BC_CITIES } from '../constants/locations';

export function useRankings() {
  const [topAgents, setTopAgents] = useState<AgentRanking[]>([]);
  const [areaRankings, setAreaRankings] = useState<AreaRanking[]>([]);
  const { getFollowerCount } = useFollowing('');
  const { clients } = useClients();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      const { data: agents, error: agentsError } = await supabase
        .from('agent_profiles')
        .select(`
          user_id,
          name,
          photo_url,
          areas,
          subscription_status,
          subscription_tier
        `)
        .eq('subscription_status', 'active')
        .order('created_at', { ascending: false });

      if (agentsError) throw agentsError;

      // Transform to AgentRanking format
      const rankedAgents = agents
        .map((agent, index) => ({
          agentId: agent.user_id,
          name: agent.name,
          photo: agent.photo_url,
          username: `agent${agent.user_id.slice(0, 8)}`,
          areas: agent.areas || [],
          followerCount: getFollowerCount(agent.user_id),
          rank: index + 1
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
        .map((agent, index) => ({ ...agent, rank: index + 1 }));

      setTopAgents(rankedAgents);

      // Calculate area rankings
      const areaRankings = BC_CITIES.map(area => {
        const areaAgents = rankedAgents.filter(agent => 
          agent.areas.includes(area)
        );

        return {
          area,
          agents: areaAgents.slice(0, 10),
          stats: {
            agentCount: areaAgents.length,
            clientCount: clients.filter(client => 
              client.areasOfInterest.includes(area)
            ).length
          }
        };
      });

      setAreaRankings(areaRankings);
    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError('Failed to fetch rankings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    topAgents,
    areaRankings,
    loading,
    error,
    refreshRankings: fetchAgents
  };
}
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { AgentRanking, AreaRanking } from '../types/ranking';

export function useRankings() {
  const [topAgents, setTopAgents] = useState<AgentRanking[]>([]);
  const [areaRankings, setAreaRankings] = useState<AreaRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        // Get top agents across all areas with follower counts
        const { data: agentsData, error: agentsError } = await supabase
          .from('agent_profiles')
          .select(`
            user_id,
            name,
            username,
            photo_url,
            areas,
            follower_count:agent_followers(count)
          `)
          .eq('subscription_status', 'active')
          .order('follower_count', { ascending: false })
          .limit(10);

        if (agentsError) throw agentsError;

        // Transform to rankings format with proper follower count handling
        const rankings = agentsData.map((agent, index) => {
          // Safely get follower count, defaulting to 0 if not available
          const followerCount = agent.follower_count?.[0]?.count 
            ? Number(agent.follower_count[0].count) 
            : 0;

          return {
            agentId: agent.user_id,
            name: agent.name,
            username: agent.username || `agent${agent.user_id.slice(0, 8)}`,
            photo: agent.photo_url,
            areas: agent.areas || [],
            followerCount,
            rank: index + 1
          };
        });

        setTopAgents(rankings);

        // Get area-specific rankings
        const uniqueAreas = Array.from(new Set(rankings.flatMap(r => r.areas)));
        const areaRankings = uniqueAreas.map(area => ({
          area,
          agents: rankings
            .filter(agent => agent.areas.includes(area))
            .sort((a, b) => b.followerCount - a.followerCount)
            .slice(0, 10)
            .map((agent, index) => ({ ...agent, rank: index + 1 }))
        }));

        setAreaRankings(areaRankings);
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setError('Failed to fetch rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return {
    topAgents,
    areaRankings,
    loading,
    error
  };
}
import React from 'react';
import { Trophy } from 'lucide-react';
import { RankingCard } from './RankingCard';
import { useNavigate } from 'react-router-dom';
import type { AgentRanking } from '../../types/ranking';

type TopAgentsListProps = {
  agents: AgentRanking[];
  title: string;
  area?: string;
};

export function TopAgentsList({ agents, title, area }: TopAgentsListProps) {
  const navigate = useNavigate();

  const handleViewProfile = (agentId: string) => {
    navigate(`/client/agent/${agentId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
          {area && <span className="text-gray-600 ml-2">in {area}</span>}
        </h2>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <RankingCard
            key={agent.agentId}
            agent={agent}
            onViewProfile={handleViewProfile}
          />
        ))}
      </div>
    </div>
  );
}
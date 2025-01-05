import React from 'react';
import { MapPin, Star, Users } from 'lucide-react';
import { Button } from '../common/Button';
import { useFollowing } from '../../hooks/useFollowing';
import { useAuthStore } from '../../store/authStore';
import type { Agent } from '../../types/agent';

type AgentCardProps = {
  agent: Agent;
  onViewProfile: () => void;
};

export function AgentCard({ agent, onViewProfile }: AgentCardProps) {
  const { user } = useAuthStore();
  const { isFollowing, followAgent, unfollowAgent } = useFollowing(user?.id || '');
  const following = isFollowing(agent.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{agent.name}</h3>
          <p className="text-gray-600">@{agent.username}</p>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold">{agent.rating}</span>
              <span className="text-gray-600">({agent.reviews} reviews)</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{agent.areas.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant={following ? 'outline' : 'primary'}
            onClick={() => following ? unfollowAgent(agent.id) : followAgent(agent.id)}
          >
            {following ? 'Unfollow' : 'Follow'}
          </Button>
          <Button variant="outline" onClick={onViewProfile}>
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
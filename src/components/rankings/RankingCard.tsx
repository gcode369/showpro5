import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { Button } from '../common/Button';
import { useFollowing } from '../../hooks/useFollowing';
import { useAuthStore } from '../../store/authStore';
import type { AgentRanking } from '../../types/ranking';

type RankingCardProps = {
  agent: AgentRanking;
  onViewProfile: (agentId: string) => void;
};

export function RankingCard({ agent, onViewProfile }: RankingCardProps) {
  const { user } = useAuthStore();
  const { isFollowing, followAgent, unfollowAgent } = useFollowing(user?.id || '');
  const following = isFollowing(agent.agentId);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
            #{agent.rank}
          </div>
          {agent.photo ? (
            <img
              src={agent.photo}
              alt={agent.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{agent.name}</h3>
              <p className="text-gray-600">@{agent.username}</p>
              
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{agent.areas.join(', ')}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{agent.followerCount} followers</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant={following ? 'outline' : 'primary'}
                onClick={() => following ? unfollowAgent(agent.agentId) : followAgent(agent.agentId)}
              >
                {following ? 'Unfollow' : 'Follow'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => onViewProfile(agent.agentId)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
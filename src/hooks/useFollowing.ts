import { useState } from 'react';

type Following = {
  userId: string;
  agentId: string;
  timestamp: string;
};

export function useFollowing(userId: string) {
  const [following, setFollowing] = useState<Following[]>([]);

  const followAgent = (agentId: string) => {
    const newFollowing: Following = {
      userId,
      agentId,
      timestamp: new Date().toISOString()
    };
    setFollowing(prev => [...prev, newFollowing]);
  };

  const unfollowAgent = (agentId: string) => {
    setFollowing(prev => prev.filter(f => f.agentId !== agentId));
  };

  const isFollowing = (agentId: string) => {
    return following.some(f => f.agentId === agentId);
  };

  const getFollowedAgents = () => {
    return following.map(f => f.agentId);
  };

  const getFollowerCount = (agentId: string) => {
    // In a real app, this would be fetched from the backend
    // For now, return a random number between 50 and 500
    return Math.floor(Math.random() * (500 - 50 + 1)) + 50;
  };

  return {
    following,
    followAgent,
    unfollowAgent,
    isFollowing,
    getFollowedAgents,
    getFollowerCount
  };
}
import React from 'react';
import { useFollowing } from '../../hooks/useFollowing';
import { useProperties } from '../../hooks/useProperties';
import { PropertyCard } from '../properties/PropertyCard';
import { useAuthStore } from '../../store/authStore';

export function AgentFeed() {
  const { user } = useAuthStore();
  const { getFollowedAgents } = useFollowing(user?.id || '');
  const { properties } = useProperties();
  const followedAgents = getFollowedAgents();

  const feedProperties = properties.filter(property => 
    followedAgents.includes(property.agentId) && 
    property.status === 'available'
  );

  if (feedProperties.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-600">
          No new properties from your followed agents. Start following agents to see their listings here!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {feedProperties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
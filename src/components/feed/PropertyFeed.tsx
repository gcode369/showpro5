import React from 'react';
import { useProperties } from '../../hooks/useProperties';
import { PropertyCard } from '../properties/PropertyCard';
import { useAuthStore } from '../../store/authStore';
import { useFollowing } from '../../hooks/useFollowing';

export function PropertyFeed() {
  const { user } = useAuthStore();
  const { properties } = useProperties();
  const { getFollowedAgents } = useFollowing(user?.id || '');
  const followedAgents = getFollowedAgents();

  const feedProperties = properties
    .filter(property => 
      followedAgents.includes(property.agentId) && 
      property.status === 'available'
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (feedProperties.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-600">
          No properties to show. Follow some agents to see their listings here!
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
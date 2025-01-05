import React from 'react';
import { Building2, UserCircle } from 'lucide-react';
import { AgentFeed } from './AgentFeed';
import { PropertyFeed } from './PropertyFeed';
import { Button } from '../common/Button';

export function FeedPage() {
  const [feedType, setFeedType] = React.useState<'properties' | 'agents'>('properties');

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Feed</h1>
        <p className="text-gray-600 mt-2">Stay updated with your followed agents and properties</p>
      </header>

      <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
        <Button
          variant={feedType === 'properties' ? 'primary' : 'secondary'}
          onClick={() => setFeedType('properties')}
          className="flex items-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          Properties
        </Button>
        <Button
          variant={feedType === 'agents' ? 'primary' : 'secondary'}
          onClick={() => setFeedType('agents')}
          className="flex items-center gap-2"
        >
          <UserCircle className="w-4 h-4" />
          Agents
        </Button>
      </div>

      {feedType === 'properties' ? <PropertyFeed /> : <AgentFeed />}
    </div>
  );
}
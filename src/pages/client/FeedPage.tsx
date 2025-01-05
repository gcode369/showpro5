import React from 'react';
import { AgentFeed } from '../../components/feed/AgentFeed';
import { PropertyFeed } from '../../components/feed/PropertyFeed';
import { FeedTabs } from '../../components/feed/FeedTabs';

export function FeedPage() {
  const [activeTab, setActiveTab] = React.useState<'properties' | 'agents'>('properties');

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Feed</h1>
        <p className="text-gray-600 mt-2">Stay updated with your followed agents and properties</p>
      </header>

      <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-6">
        {activeTab === 'properties' ? <PropertyFeed /> : <AgentFeed />}
      </div>
    </>
  );
}
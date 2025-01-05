import React from 'react';
import { Building2, UserCircle } from 'lucide-react';
import { Button } from '../common/Button';

type FeedTabsProps = {
  activeTab: 'properties' | 'agents';
  onTabChange: (tab: 'properties' | 'agents') => void;
};

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
      <Button
        variant={activeTab === 'properties' ? 'primary' : 'secondary'}
        onClick={() => onTabChange('properties')}
        className="flex items-center gap-2"
      >
        <Building2 className="w-4 h-4" />
        Properties
      </Button>
      <Button
        variant={activeTab === 'agents' ? 'primary' : 'secondary'}
        onClick={() => onTabChange('agents')}
        className="flex items-center gap-2"
      >
        <UserCircle className="w-4 h-4" />
        Agents
      </Button>
    </div>
  );
}
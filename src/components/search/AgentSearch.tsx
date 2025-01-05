import React, { useState } from 'react';
import { Search, MapPin, Star, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { useFollowing } from '../../hooks/useFollowing';
import { useAuthStore } from '../../store/authStore';
import { useRankings } from '../../hooks/useRankings';
import { TopAgentsList } from '../rankings/TopAgentsList';
import { AreaSelector } from '../rankings/AreaSelector';

export function AgentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const { topAgents, areaRankings, loading, error } = useRankings();
  
  const filteredAgents = selectedArea
    ? areaRankings.find(ranking => ranking.area === selectedArea)?.agents || []
    : topAgents;

  const searchResults = filteredAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by agent name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <AreaSelector
            areas={areaRankings.map(ranking => ranking.area)}
            selectedArea={selectedArea}
            onAreaChange={setSelectedArea}
          />
        </div>
      </div>

      <div className="space-y-8">
        <TopAgentsList
          agents={searchResults}
          title={selectedArea ? `Top Agents in ${selectedArea}` : 'Top Agents'}
        />
      </div>
    </div>
  );
}
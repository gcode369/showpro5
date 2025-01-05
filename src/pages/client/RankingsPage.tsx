import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { TopAgentsList } from '../../components/rankings/TopAgentsList';
import { RankingStats } from '../../components/rankings/RankingStats';
import { AreaSelector } from '../../components/common/AreaSelector';
import { useRankings } from '../../hooks/useRankings';
import { BC_CITIES } from '../../constants/locations';

export function RankingsPage() {
  const { topAgents, areaRankings, getAreaStats } = useRankings();
  const [selectedArea, setSelectedArea] = useState<string>('');

  const currentAreaRanking = areaRankings.find(ranking => ranking.area === selectedArea);
  const areaStats = selectedArea ? getAreaStats(selectedArea) : null;

  const stats = {
    totalAgents: areaStats ? areaStats.agentCount : topAgents.length,
    totalClients: areaStats ? areaStats.clientCount : topAgents.reduce((sum, agent) => sum + agent.followerCount, 0)
  };

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Rankings</h1>
              <p className="text-gray-600 mt-1">
                Discover the most followed agents in your area
              </p>
            </div>
          </div>
          <AreaSelector
            areas={BC_CITIES}
            selectedArea={selectedArea}
            onAreaChange={setSelectedArea}
            className="w-64"
          />
        </div>
      </header>

      <RankingStats {...stats} />

      <div className="space-y-8">
        {selectedArea ? (
          currentAreaRanking && (
            <TopAgentsList
              agents={currentAreaRanking.agents}
              title={`Top Agents in ${selectedArea}`}
            />
          )
        ) : (
          <TopAgentsList
            agents={topAgents.slice(0, 10)}
            title="Top 10 Most Followed Agents"
          />
        )}
      </div>
    </>
  );
}
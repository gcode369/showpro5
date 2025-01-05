import React from 'react';
import { Users, Building2 } from 'lucide-react';

type RankingStatsProps = {
  totalAgents: number;
  totalClients: number;
};

export function RankingStats({ totalAgents, totalClients }: RankingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Agents</p>
            <p className="text-2xl font-bold">{totalAgents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Clients</p>
            <p className="text-2xl font-bold">{totalClients}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
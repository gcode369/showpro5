import React, { useState } from 'react';
import { Search as SearchIcon, Building2, UserCircle } from 'lucide-react';
import { PropertySearch } from '../../components/search/PropertySearch';
import { AgentSearch } from '../../components/search/AgentSearch';
import { Button } from '../../components/common/Button';

type SearchType = 'properties' | 'agents';

export function SearchPage() {
  const [searchType, setSearchType] = useState<SearchType>('properties');

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Properties & Agents</h1>
        <p className="text-gray-600 mt-2">Search for properties or connect with real estate agents</p>
      </header>

      <div className="space-y-6">
        <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
          <Button
            variant={searchType === 'properties' ? 'primary' : 'secondary'}
            onClick={() => setSearchType('properties')}
            className="flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Properties
          </Button>
          <Button
            variant={searchType === 'agents' ? 'primary' : 'secondary'}
            onClick={() => setSearchType('agents')}
            className="flex items-center gap-2"
          >
            <UserCircle className="w-4 h-4" />
            Agents
          </Button>
        </div>

        {searchType === 'properties' ? <PropertySearch /> : <AgentSearch />}
      </div>
    </>
  );
}
import { useState } from 'react';
import { searchAgentsByUsername } from '../services/auth/usernameService';
import type { Agent } from '../types/agent';

export function useAgentSearch() {
  const [results, setResults] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAgents = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const agents = await searchAgentsByUsername(query);
      setResults(agents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search agents');
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    searchAgents
  };
}
import { useState } from 'react';

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    setError(err instanceof Error ? err.message : 'An unexpected error occurred');
  };

  const clearError = () => setError(null);

  return {
    error,
    setError: handleError,
    clearError
  };
}
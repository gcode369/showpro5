import { useState, useEffect } from 'react';
import { leadTrackingService } from '../services/leads';
import { useErrorHandler } from './useErrorHandler';
import type { LeadActivity, LeadScore } from '../types/lead';

export function useLeadTracking(agentId: string) {
  const [leadScores, setLeadScores] = useState<Record<string, LeadScore>>({});
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, setError, clearError } = useErrorHandler();

  useEffect(() => {
    if (agentId) {
      fetchLeadData();
    }
  }, [agentId]);

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      clearError();
      
      const [scoresData, recentActivities] = await Promise.all([
        leadTrackingService.getLeadScores(agentId),
        leadTrackingService.getRecentActivities(agentId)
      ]);

      const scoresRecord = scoresData.reduce<Record<string, LeadScore>>((acc, score) => {
        acc[score.client_id] = score;
        return acc;
      }, {});

      setLeadScores(scoresRecord);
      setActivities(recentActivities);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const trackActivity = async (clientId: string, activity: Omit<LeadActivity, 'id' | 'created_at'>) => {
    try {
      clearError();
      await leadTrackingService.trackActivity(clientId, activity);
      await fetchLeadData();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    leadScores,
    activities,
    loading,
    error,
    trackActivity,
    refreshLeadData: fetchLeadData
  };
}
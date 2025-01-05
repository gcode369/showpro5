import { type FC } from 'react';
import { LeadsList } from './LeadsList';
import { LeadScoreCard } from './LeadScoreCard';
import { LeadActivityList } from './LeadActivityList';
import { useLeadTracking } from '../../hooks/useLeadTracking';
import { useAuthStore } from '../../store/authStore';

export const LeadsOverview: FC = () => {
  const { user } = useAuthStore();
  const { leadScores, activities, loading, error } = useLeadTracking(user?.id || '');

  if (loading) {
    return <div>Loading leads...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Lead Scores</h2>
          <div className="space-y-4">
            {Object.entries(leadScores).map(([clientId, score]) => (
              <LeadScoreCard key={clientId} score={score} />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <LeadActivityList activities={activities} />
        </div>
      </div>
    </div>
  );
};
import { Star, Activity } from 'lucide-react';
import type { LeadScore } from '../../types/lead';

type LeadScoreCardProps = {
  score: LeadScore;
  onViewDetails?: () => void;
};

export function LeadScoreCard({ score, onViewDetails }: LeadScoreCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-xl font-bold">{score.total_score}</span>
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Engagement Score: {score.engagement_score}</span>
            </div>
            {score.prequalification_score > 0 && (
              <div>Prequalification: +{score.prequalification_score}</div>
            )}
            {score.property_match_score > 0 && (
              <div>Property Match: +{score.property_match_score}</div>
            )}
          </div>
        </div>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
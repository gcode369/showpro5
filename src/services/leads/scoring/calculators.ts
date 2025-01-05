import { ACTIVITY_SCORES, PREQUALIFICATION_SCORES } from './constants';
import type { LeadActivity } from '../../../types/lead';

export function calculateEngagementScore(activities: LeadActivity[]): number {
  return activities.reduce((total, activity) => {
    return total + (ACTIVITY_SCORES[activity.activity_type] || 0);
  }, 0);
}

export function calculatePrequalificationScore(profile: { 
  prequalified: boolean; 
  prequalification_details?: { verified: boolean } 
}): number {
  if (!profile?.prequalified) return 0;
  return profile.prequalification_details?.verified 
    ? PREQUALIFICATION_SCORES.verified 
    : PREQUALIFICATION_SCORES.basic;
}
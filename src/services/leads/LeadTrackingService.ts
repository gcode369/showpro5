import { trackActivity, getRecentActivities } from './activities';
import { getLeadScores, updateLeadScore } from './scores';
import { calculateLeadScore } from './scoring';
import type { LeadActivity, LeadScore } from '../../types/lead';

export class LeadTrackingService {
  async trackActivity(clientId: string, activity: Omit<LeadActivity, 'id' | 'created_at'>) {
    await trackActivity({
      ...activity,
      client_id: clientId
    });
    await this.updateScores(clientId, activity.agent_id);
  }

  async getRecentActivities(agentId: string): Promise<LeadActivity[]> {
    return getRecentActivities(agentId);
  }

  async getLeadScores(agentId: string): Promise<LeadScore[]> {
    return getLeadScores(agentId);
  }

  private async updateScores(clientId: string, agentId: string) {
    const score = await calculateLeadScore(clientId, agentId);
    await updateLeadScore(clientId, score);
  }
}

export const leadTrackingService = new LeadTrackingService();
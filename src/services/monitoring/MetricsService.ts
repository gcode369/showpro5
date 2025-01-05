import { supabase } from '../supabase';

export class MetricsService {
  private static instance: MetricsService;
  
  private metrics: {
    activeUsers: number;
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
    databaseConnections: number;
  } = {
    activeUsers: 0,
    requestsPerMinute: 0,
    averageResponseTime: 0,
    errorRate: 0,
    databaseConnections: 0
  };

  private constructor() {
    this.startMetricsCollection();
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  private startMetricsCollection() {
    setInterval(() => {
      this.collectMetrics();
    }, 60000); // Collect metrics every minute
  }

  private async collectMetrics() {
    try {
      // Collect active users
      const { count } = await supabase
        .from('active_sessions')
        .select('*', { count: 'exact', head: true });
      
      this.metrics.activeUsers = count || 0;

      // Other metrics collection...
    } catch (error) {
      console.error('Failed to collect metrics:', error);
    }
  }

  public getMetrics() {
    return this.metrics;
  }
}

export const metricsService = MetricsService.getInstance();
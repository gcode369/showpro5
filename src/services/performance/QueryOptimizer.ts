import { supabase } from '../supabase';
import { cacheService } from './CacheService';

export class QueryOptimizer {
  private readonly PAGE_SIZE = 20;

  async getPropertiesOptimized(filters: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    type?: string;
    page?: number;
  }) {
    const page = filters.page || 1;
    const cacheKey = `properties:${JSON.stringify(filters)}`;
    
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'available')
      .range((page - 1) * this.PAGE_SIZE, page * this.PAGE_SIZE - 1);

    if (filters.city) {
      query = query.eq('city', filters.city);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    const { data, error } = await query;
    if (error) throw error;

    cacheService.set(cacheKey, data);
    return data;
  }

  async getAgentPropertiesOptimized(agentId: string, page: number = 1) {
    const cacheKey = `agent:${agentId}:properties:${page}`;
    
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('agent_id', agentId)
      .range((page - 1) * this.PAGE_SIZE, page * this.PAGE_SIZE - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    cacheService.set(cacheKey, data);
    return data;
  }
}

export const queryOptimizer = new QueryOptimizer();
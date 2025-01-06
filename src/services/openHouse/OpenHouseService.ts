import { supabase } from '../supabase';
import type { OpenHouse } from '../../types/openHouse';

export class OpenHouseService {
  async getOpenHouses(filters?: { city?: string; date?: string }) {
    try {
      let query = supabase
        .from('open_houses')
        .select(`
          *,
          properties (title, images),
          agent_profiles!inner (name)
        `);

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.date) {
        query = query.eq('date', filters.date);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(oh => ({
        id: oh.id,
        propertyId: oh.property_id,
        date: oh.date,
        startTime: oh.start_time,
        endTime: oh.end_time,
        agentId: oh.agent_id,
        agentName: oh.agent_profiles?.name || '',
        address: oh.address,
        city: oh.city,
        province: oh.province,
        postalCode: oh.postal_code,
        maxAttendees: oh.max_attendees,
        currentAttendees: oh.current_attendees || 0,
        property: {
          title: oh.properties?.title,
          images: oh.properties?.images || []
        }
      }));
    } catch (err) {
      console.error('Get open houses error:', err);
      throw err;
    }
  }

  async createOpenHouse(data: Omit<OpenHouse, 'id' | 'currentAttendees'>) {
    try {
      const { data: openHouse, error } = await supabase
        .from('open_houses')
        .insert({
          property_id: data.propertyId,
          agent_id: data.agentId,
          date: data.date,
          start_time: data.startTime,
          end_time: data.endTime,
          max_attendees: data.maxAttendees || 20,
          current_attendees: 0,
          address: data.address,
          city: data.city,
          province: data.province,
          postal_code: data.postalCode
        })
        .select(`
          *,
          properties (title, images),
          agent_profiles (name)
        `)
        .single();

      if (error) throw error;
      return openHouse;
    } catch (err) {
      console.error('Create open house error:', err);
      throw err;
    }
  }
}

export const openHouseService = new OpenHouseService();
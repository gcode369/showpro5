import { supabase } from '../supabase';
import type { OpenHouse } from '../../types/openHouse';

export class OpenHouseService {
  async getOpenHouses(filters?: { city?: string; date?: string }) {
    try {
      let query = supabase
        .from('open_houses')
        .select(`
          *,
          properties:property_id (title, images)
        `);

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.date) {
        query = query.eq('date', filters.date);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Get open houses error:', err);
      throw err instanceof Error ? err : new Error('Failed to fetch open houses');
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
        .select()
        .single();

      if (error) throw error;
      return openHouse;
    } catch (err) {
      console.error('Create open house error:', err);
      throw err instanceof Error ? err : new Error('Failed to create open house');
    }
  }

  async registerAttendee(openHouseId: string, data: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
    interestedInSimilar: boolean;
    prequalified: boolean;
  }) {
    try {
      const { error } = await supabase
        .from('open_house_leads')
        .insert({
          open_house_id: openHouseId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
          interested_in_similar: data.interestedInSimilar,
          prequalified: data.prequalified,
          follow_up_status: 'pending'
        });

      if (error) throw error;
    } catch (err) {
      console.error('Register attendee error:', err);
      throw err instanceof Error ? err : new Error('Failed to register for open house');
    }
  }
}

export const openHouseService = new OpenHouseService();
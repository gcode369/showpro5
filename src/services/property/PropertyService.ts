import { supabase } from '../supabase';
import type { Property } from '../../types/property';

export class PropertyService {
  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .insert({
          title: data.title,
          address: data.address,
          city: data.city,
          price: data.price,
          description: data.description || '',
          images: data.images || [],
          agent_id: data.agent_id,
          status: data.status || 'available',
          category: data.category,
          type: data.type,
          features: data.features || [],
          bedrooms: data.bedrooms || null,
          bathrooms: data.bathrooms || null,
          square_feet: data.square_feet || null,
          listing_url: data.listing_url || null
        })
        .select()
        .single();

      if (error) {
        console.error('Create property error:', error);
        throw new Error(error.message);
      }

      return property;
    } catch (err) {
      console.error('Property service error:', err);
      throw err instanceof Error ? err : new Error('Failed to create property');
    }
  }
}

export const propertyService = new PropertyService();
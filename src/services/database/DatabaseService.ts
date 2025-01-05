import { supabase } from '../supabase';
import { validateData } from '../validation/ValidationService';
import type { Database } from '../../types/supabase';

export class DatabaseService {
  async createRecord<T extends keyof Database['public']['Tables']>(
    table: T,
    data: Database['public']['Tables'][T]['Insert']
  ) {
    const { data: record, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return record;
  }

  async updateRecord<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string,
    data: Partial<Database['public']['Tables'][T]['Update']>
  ) {
    const { data: record, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return record;
  }

  async deleteRecord<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string
  ) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getRecord<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string
  ) {
    const { data, error } = await supabase
      .from(table)
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}

export const databaseService = new DatabaseService();
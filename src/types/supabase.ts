export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          address: string
          city: string
          price: number
          description: string | null
          images: string[]
          agent_id: string
          status: 'available' | 'pending' | 'sold'
          category: 'residential' | 'commercial'
          type: string
          features: string[]
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          listing_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['properties']['Insert']>
      }
      property_showings: {
        Row: {
          id: string
          property_id: string
          notes: string | null
          showing_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['property_showings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['property_showings']['Insert']>
      }
      showing_time_slots: {
        Row: {
          id: string
          showing_id: string
          date: string
          start_time: string
          end_time: string
          is_booked: boolean
          max_attendees: number
          current_attendees: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['showing_time_slots']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['showing_time_slots']['Insert']>
      }
    }
  }
}
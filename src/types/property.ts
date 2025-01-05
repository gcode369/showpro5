export type PropertyCategory = 'residential' | 'commercial';

export type PropertyType = 'house' | 'condo' | 'townhouse' | 'apartment' | 'office' | 'retail' | 'industrial' | 'warehouse';

export type Property = {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  description?: string;
  images: string[];
  agent_id: string;
  status: 'available' | 'pending' | 'sold';
  category: PropertyCategory;
  type: PropertyType;
  features: string[];
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_feet?: number | null;
  listing_url?: string | null;
  created_at: string;
  updated_at: string;
};
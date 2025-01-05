import { useState } from 'react';
import { propertyService } from '../services/property/PropertyService';
import { useAuthStore } from '../store/authStore';
import type { Property } from '../types/property';

export function usePropertyForm() {
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'agent_id'>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Validate required fields
      const requiredFields = {
        title: 'Title',
        address: 'Address',
        city: 'City',
        price: 'Price',
        category: 'Category',
        type: 'Property Type'
      } as const;

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !formData[key as keyof typeof requiredFields])
        .map(([, label]) => label);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      }

      // Create property
      await propertyService.createProperty({
        ...formData,
        agent_id: user.id
      });
      
      return true;
    } catch (err) {
      console.error('Property form error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add property');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, error, loading };
}
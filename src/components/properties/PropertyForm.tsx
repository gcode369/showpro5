import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common';
import { 
  PropertyBasicInfo,
  PropertyLocation,
  PropertyDetails,
  PropertyFeatures,
  PropertyImages
} from './form';
import { usePropertyForm } from '../../hooks/usePropertyForm';
import { ErrorAlert } from '../common/ErrorAlert';
import type { Property } from '../../types/property';

type PropertyFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export function PropertyForm({ onClose, onSuccess }: PropertyFormProps) {
  const { handleSubmit, error } = usePropertyForm();
  const [formData, setFormData] = useState<Omit<Property, 'id' | 'created_at' | 'updated_at' | 'agent_id'>>({
    title: '',
    address: '',
    city: '',
    price: 0,
    description: '',
    images: [],
    status: 'available',
    category: 'residential',
    type: 'house',
    features: [],
    bedrooms: null,
    bathrooms: null,
    square_feet: null,
    listing_url: null
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields before submission
    if (!formData.address.trim()) {
      return;
    }
    if (!formData.city.trim()) {
      return;
    }

    const success = await handleSubmit(formData);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
          <h2 className="text-xl font-semibold">Add New Property</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleFormSubmit} className="space-y-8">
          <PropertyBasicInfo data={formData} onChange={handleChange} />
          <PropertyLocation data={formData} onChange={handleChange} />
          <PropertyDetails data={formData} onChange={handleChange} />
          <PropertyFeatures features={formData.features} onChange={(features) => handleChange('features', features)} />
          <PropertyImages images={formData.images} onChange={(images) => handleChange('images', images)} />

          <div className="sticky bottom-0 bg-white pt-4 flex justify-end gap-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Property</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
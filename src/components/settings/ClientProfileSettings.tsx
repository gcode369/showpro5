import React, { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../common/Button';
import { PrequalificationSection } from '../auth/PrequalificationSection';
import { useAuthStore } from '../../store/authStore';
import { useProfile } from '../../hooks/useProfile';
import { BC_CITIES } from '../../constants/locations';

export function ClientProfileSettings() {
  const { user } = useAuthStore();
  const { updateProfile, loading, error } = useProfile();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    preferredAreas: user?.preferredAreas || [],
    prequalified: user?.prequalified || false,
    prequalificationDetails: user?.prequalificationDetails || {
      amount: '',
      lender: '',
      expiryDate: ''
    }
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('prequalificationDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        prequalificationDetails: {
          ...prev.prequalificationDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    setSuccess(false);
  };

  const toggleArea = (city: string) => {
    setFormData(prev => ({
      ...prev,
      preferredAreas: prev.preferredAreas.includes(city)
        ? prev.preferredAreas.filter(a => a !== city)
        : [...prev.preferredAreas, city]
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      setSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
            Profile updated successfully!
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas of Interest
            </label>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Select the areas where you're looking for properties</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {BC_CITIES.map(city => (
                <div
                  key={city}
                  onClick={() => toggleArea(city)}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    formData.preferredAreas.includes(city)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'hover:border-gray-400'
                  }`}
                >
                  {city}
                </div>
              ))}
            </div>
          </div>

          <PrequalificationSection
            prequalified={formData.prequalified}
            details={formData.prequalificationDetails}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            className="flex items-center gap-2"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
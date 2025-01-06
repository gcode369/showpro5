import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Award } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuthStore } from '../../store/authStore';
import { useProfile } from '../../hooks/useProfile';
import { BC_CITIES } from '../../constants/locations';

const LANGUAGES = ['English', 'French', 'Mandarin', 'Cantonese', 'Punjabi', 'Spanish'];
const CERTIFICATIONS = ['Licensed Real Estate Agent', 'Certified Negotiation Expert', 'Luxury Home Specialist'];

export function AgentProfileSettings() {
  const { user } = useAuthStore();
  const { updateProfile, loading, error, syncProfile } = useProfile();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    areas: user?.areas || [],
    bio: user?.bio || '',
    languages: user?.languages || [],
    certifications: user?.certifications || []
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    syncProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const toggleItem = (field: 'areas' | 'languages' | 'certifications', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.areas.length === 0) {
      alert('Please select at least one area of service');
      return;
    }
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
              Areas of Service
            </label>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Select the areas where you provide service</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {BC_CITIES.map(city => (
                <div
                  key={city}
                  onClick={() => toggleItem('areas', city)}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    formData.areas.includes(city)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'hover:border-gray-400'
                  }`}
                >
                  {city}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages
            </label>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Select languages you speak</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {LANGUAGES.map(lang => (
                <div
                  key={lang}
                  onClick={() => toggleItem('languages', lang)}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    formData.languages.includes(lang)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'hover:border-gray-400'
                  }`}
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifications
            </label>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Select your certifications</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CERTIFICATIONS.map(cert => (
                <div
                  key={cert}
                  onClick={() => toggleItem('certifications', cert)}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    formData.certifications.includes(cert)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'hover:border-gray-400'
                  }`}
                >
                  {cert}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell clients about yourself, your experience, and your areas of expertise..."
            />
          </div>
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
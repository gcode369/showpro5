import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../common/Button';
import { FormField } from '../auth/FormField';
import { useAuthStore } from '../../store/authStore';
import { useProfile } from '../../hooks/useProfile';
import { checkUsernameAvailability } from '../../services/auth/usernameService';
import { ErrorAlert } from '../common/ErrorAlert';

export function ProfileSettings() {
  const { user } = useAuthStore();
  const { updateProfile, loading, error } = useProfile();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      // Check username availability if changed
      if (formData.username !== user?.username) {
        const isAvailable = await checkUsernameAvailability(formData.username);
        if (!isAvailable) {
          throw new Error('Username is already taken');
        }
      }

      const success = await updateProfile(formData);
      if (success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorAlert message={error} />}
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg">
          Profile updated successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <FormField
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Choose a unique username"
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />

          <FormField
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(XXX) XXX-XXXX"
          />

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
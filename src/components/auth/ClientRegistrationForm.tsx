import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { FormField } from './FormField';
import { PrequalificationSection } from './PrequalificationSection';
import { authService } from '../../services/auth/AuthService';
import { useAuthStore } from '../../store/authStore';
import { BC_CITIES } from '../../constants/locations';
import { ErrorAlert } from '../common/ErrorAlert';
import { LoadingSpinner } from '../common/LoadingSpinner';

type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  preferredAreas: string[];
  prequalified: boolean;
  prequalificationDetails: {
    amount: string;
    lender: string;
    expiryDate: string;
  };
  preferredContact: 'email' | 'phone' | 'both';
};

export function ClientRegistrationForm() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    preferredAreas: [],
    prequalified: false,
    prequalificationDetails: {
      amount: '',
      lender: '',
      expiryDate: ''
    },
    preferredContact: 'email'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { session, user } = await authService.register(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        role: 'client',
        preferredAreas: formData.preferredAreas,
        prequalified: formData.prequalified,
        prequalificationDetails: formData.prequalified ? formData.prequalificationDetails : undefined,
        preferredContact: formData.preferredContact
      });

      if (!session?.user) {
        throw new Error('Registration failed');
      }

      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: formData.name,
        role: 'client',
        phone: formData.phone
      });

      navigate('/client');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
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
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const toggleArea = (city: string) => {
    setFormData(prev => ({
      ...prev,
      preferredAreas: prev.preferredAreas.includes(city)
        ? prev.preferredAreas.filter(a => a !== city)
        : [...prev.preferredAreas, city]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorAlert message={error} />}

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
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(XXX) XXX-XXXX"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Method
          </label>
          <select
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="both">Both</option>
          </select>
        </div>

        <FormField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Interest
        </label>
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

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Creating Account...</span>
          </div>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
}
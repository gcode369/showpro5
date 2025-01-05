import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { FormField } from './FormField';
import { authService } from '../../services/auth/AuthService';
import { useAuthStore } from '../../store/authStore';
import { ErrorAlert } from '../common/ErrorAlert';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { UserRegistrationData } from '../../types/auth';

export function AgentRegistrationForm() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const registrationData: UserRegistrationData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        username: formData.username,
        phone: formData.phone,
        role: 'agent'
      };

      const result = await authService.register(formData.email, formData.password, registrationData);

      if (!result?.user) {
        throw new Error('Registration failed');
      }

      // Ensure we have required user data before setting the user
      if (!result.user.email) {
        throw new Error('Invalid user data received');
      }

      setUser({
        id: result.user.id,
        email: result.user.email, // Now TypeScript knows this is not undefined
        name: formData.name,
        role: 'agent',
        subscriptionStatus: 'trial',
        subscriptionTier: 'basic'
      });

      navigate('/subscription');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          label="Username"
          name="username"
          type="text"
          value={formData.username}
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
          required
        />

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
          'Continue to Subscription'
        )}
      </Button>
    </form>
  );
}
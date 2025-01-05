import React from 'react';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { ClientProfileSettings } from '../components/settings/ClientProfileSettings';
import { useAuthStore } from '../store/authStore';

export function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your profile information and preferences</p>
      </header>
      
      {user?.role === 'agent' ? <ProfileSettings /> : <ClientProfileSettings />}
    </>
  );
}
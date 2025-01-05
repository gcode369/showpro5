import React from 'react';
import { ClientRegistrationForm } from '../../components/auth/ClientRegistrationForm';

export function ClientRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your client account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Find and book property viewings with top agents
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ClientRegistrationForm />
        </div>
      </div>
    </div>
  );
}
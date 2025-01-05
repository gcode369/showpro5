import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

type LayoutProps = {
  userType: 'agent' | 'client';
};

export function Layout({ userType }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userType={userType} />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Home, 
  Users, 
  UserCircle,
  Building2,
  Eye,
  DoorOpen,
  Rss,
  Trophy,
  Search
} from 'lucide-react';

type SidebarProps = {
  userType: 'agent' | 'client';
};

export function Sidebar({ userType }: SidebarProps) {
  const agentNavItems = [
    { icon: Calendar, label: 'Calendar', path: '/agent' },
    { icon: Home, label: 'Properties', path: '/agent/properties' },
    { icon: DoorOpen, label: 'Open Houses', path: '/agent/open-houses' },
    { icon: Users, label: 'Clients', path: '/agent/clients' },
    { icon: UserCircle, label: 'Profile', path: '/agent/profile' },
  ];

  const clientNavItems = [
    { icon: Search, label: 'Search', path: '/client' },
    { icon: Rss, label: 'My Feed', path: '/client/feed' },
    { icon: Trophy, label: 'Rankings', path: '/client/rankings' },
    { icon: Eye, label: 'My Viewings', path: '/client/viewings' },
    { icon: DoorOpen, label: 'Open Houses', path: '/client/open-houses' },
    { icon: UserCircle, label: 'Profile', path: '/client/profile' },
  ];

  const navItems = userType === 'agent' ? agentNavItems : clientNavItems;

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <NavLink to="/" className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">ShowPro</span>
        </NavLink>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
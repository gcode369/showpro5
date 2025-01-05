import React from 'react';
import { 
  Calendar, 
  Home, 
  Users, 
  Settings, 
  LogOut,
  Building2
} from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">ShowPro</span>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {[
            { icon: Calendar, label: 'Calendar', active: true },
            { icon: Home, label: 'Properties' },
            { icon: Users, label: 'Clients' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                item.active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
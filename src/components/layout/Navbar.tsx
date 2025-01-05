import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button } from '../common/Button';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ShowPro</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login/client">
              <Button variant="outline">Client Portal</Button>
            </Link>
            <Link to="/login/agent">
              <Button>Agent Portal</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
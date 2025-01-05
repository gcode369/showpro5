import React, { useState } from 'react';
import { Building2, Calendar, Users } from 'lucide-react';
import { Button } from '../common/Button';
import { GetStartedModal } from '../auth/GetStartedModal';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Streamline Your Real Estate Showings
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              ShowPro helps real estate professionals and clients coordinate property viewings effortlessly. Schedule showings, manage properties, and grow your business all in one place.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <Button size="lg" onClick={() => setShowModal(true)}>
                Get Started
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/learn-more')}>
                Learn More
              </Button>
            </div>
          </div>
          {/* ... rest of the component */}
        </div>
      </div>

      {showModal && <GetStartedModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
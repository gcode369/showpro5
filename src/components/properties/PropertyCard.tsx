import React, { useState } from 'react';
import { MapPin, Home, DollarSign, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { BookingModal } from '../booking/BookingModal';
import { useCalendarState } from '../../hooks/useCalendarState';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { Property } from '../../types/property';

type PropertyCardProps = {
  property: Property;
  onViewDetails?: () => void;
  showBooking?: boolean;
};

export function PropertyCard({ property, onViewDetails, showBooking = true }: PropertyCardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { slotsByDate, loading } = useCalendarState(property.id);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate(`/properties/${property.id}`);
    }
  };

  const handleBookViewing = () => {
    if (!user) {
      navigate('/login/client', { 
        state: { returnTo: `/properties/${property.id}` }
      });
      return;
    }
    setShowBookingModal(true);
  };

  const hasAvailableShowings = Object.values(slotsByDate).some(slots => 
    slots.some(slot => !slot.is_booked)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={property.images[0]}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{property.title}</h3>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{property.address}</span>
          </div>
          {property.bedrooms && property.bathrooms && (
            <div className="flex items-center gap-2 text-gray-600">
              <Home className="w-4 h-4" />
              <span>
                {property.bedrooms} beds • {property.bathrooms} baths
                {property.square_feet && ` • ${property.square_feet} sqft`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <DollarSign className="w-4 h-4" />
            <span>${property.price.toLocaleString()}</span>
          </div>
          {!loading && (
            <div className="flex items-center gap-2 text-green-600">
              <Calendar className="w-4 h-4" />
              <span>
                {hasAvailableShowings 
                  ? 'Available for viewing'
                  : 'No available showings'}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          {property.listing_url && (
            <Button variant="outline" onClick={() => window.open(property.listing_url, '_blank')} className="flex-1">
              View Listing
            </Button>
          )}
          {showBooking && hasAvailableShowings && (
            <Button onClick={handleBookViewing} className="flex-1">
              Book Viewing
            </Button>
          )}
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          property={property}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            // Optionally navigate to viewings page
            navigate('/client/viewings');
          }}
        />
      )}
    </div>
  );
}
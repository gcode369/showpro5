import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ViewingCard } from '../../components/viewings/ViewingCard';
import { useBookings } from '../../hooks/useBookings';
import { useAuthStore } from '../../store/authStore';

export function ViewingsPage() {
  const { user } = useAuthStore();
  const { bookings, loading, error } = useBookings();

  const handleCancelViewing = async (id: string) => {
    // Implement booking cancellation
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Viewings</h1>
          <p className="text-gray-600 mt-2">Manage your scheduled property viewings</p>
        </header>

        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">You haven't booked any viewings yet.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Viewings</h1>
        <p className="text-gray-600 mt-2">Manage your scheduled property viewings</p>
      </header>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Viewings</h2>
          </div>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <ViewingCard
              key={booking.id}
              viewing={{
                id: booking.id,
                propertyId: booking.property_id,
                propertyTitle: booking.property.title,
                propertyAddress: booking.property.address,
                propertyImage: booking.property.images[0],
                date: new Date(booking.time_slot.date).toLocaleDateString(),
                time: `${booking.time_slot.start_time} - ${booking.time_slot.end_time}`,
                status: booking.status,
                agentName: booking.agent.name
              }}
              onCancel={handleCancelViewing}
            />
          ))}
        </div>
      </div>
    </>
  );
}
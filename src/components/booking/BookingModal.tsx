import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BookingCalendar } from './BookingCalendar';
import { BookingForm } from './BookingForm';
import { useCalendarState } from '../../hooks/useCalendarState';
import { useAuthStore } from '../../store/authStore';
import type { Property } from '../../types/property';

type BookingModalProps = {
  property: Property;
  onClose: () => void;
  onSuccess: () => void;
};

export function BookingModal({ property, onClose, onSuccess }: BookingModalProps) {
  const { user } = useAuthStore();
  const [step, setStep] = useState<'calendar' | 'form'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    slotsByDate,
    selectedSlot,
    loading,
    handleBookSlot
  } = useCalendarState(property.id);

  const handleSlotSelect = (date: string, slotId: string) => {
    setSelectedDate(date);
    setSelectedSlotId(slotId);
    setStep('form');
  };

  const handleBooking = async (data: { attendees: number; notes?: string }) => {
    try {
      if (!user || !selectedSlotId) {
        throw new Error('Missing required booking information');
      }

      const success = await handleBookSlot(data.attendees, data.notes);
      if (success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Book Property Showing</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {step === 'calendar' ? (
          <BookingCalendar
            property={property}
            onSlotSelect={handleSlotSelect}
          />
        ) : (
          selectedSlot && (
            <BookingForm
              timeSlot={selectedSlot}
              maxAttendees={selectedSlot.max_attendees || 1}
              onSubmit={handleBooking}
              onCancel={() => setStep('calendar')}
            />
          )
        )}
      </div>
    </div>
  );
}
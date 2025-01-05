import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { PropertyShowingCalendar } from '../components/calendar/PropertyShowingCalendar';
import { ShowingTimeSlotModal } from '../components/calendar/ShowingTimeSlotModal';
import { usePropertyShowings } from '../hooks/usePropertyShowings';
import { useProperties } from '../hooks/useProperties';
import { useAuthStore } from '../store/authStore';

export function CalendarPage() {
  const { user } = useAuthStore();
  const { properties } = useProperties(user?.id);
  const { showings, addPropertyShowing, updateShowingTimeSlots, removePropertyShowing } = usePropertyShowings(user?.id || '');
  
  const [selectedProperty, setSelectedProperty] = useState(properties[0]?.id || '');
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const currentShowing = showings.find(showing => showing.propertyId === selectedProperty);
  const selectedPropertyData = properties.find(p => p.id === selectedProperty);

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h2>
        <p className="text-gray-600">Add properties to start managing showings.</p>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Showings</h1>
            <p className="text-gray-600 mt-2">Manage showing schedules for your properties</p>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
            <Button
              onClick={() => setShowTimeSlotModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Time Slots
            </Button>
          </div>

          {selectedPropertyData && (
            <PropertyShowingCalendar
              property={selectedPropertyData}
              timeSlots={currentShowing?.timeSlots || []}
              onAddTimeSlots={(slots) => {
                if (currentShowing) {
                  updateShowingTimeSlots(currentShowing.id, [
                    ...currentShowing.timeSlots,
                    ...slots
                  ]);
                } else {
                  addPropertyShowing(selectedPropertyData, slots);
                }
              }}
              onRemoveTimeSlot={(slotId) => {
                if (currentShowing) {
                  updateShowingTimeSlots(
                    currentShowing.id,
                    currentShowing.timeSlots.filter(slot => slot.id !== slotId)
                  );
                }
              }}
            />
          )}
        </div>
      </div>

      {showTimeSlotModal && selectedProperty && (
        <ShowingTimeSlotModal
          propertyId={selectedProperty}
          date={selectedDate || new Date().toISOString().split('T')[0]}
          onClose={() => setShowTimeSlotModal(false)}
          onAdd={(slots) => {
            if (currentShowing) {
              updateShowingTimeSlots(currentShowing.id, [
                ...currentShowing.timeSlots,
                ...slots
              ]);
            } else {
              addPropertyShowing(
                selectedPropertyData!,
                slots
              );
            }
            setShowTimeSlotModal(false);
          }}
        />
      )}
    </>
  );
}
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { PropertySelector } from './PropertySelector';
import { TimeSlotModal } from './TimeSlotModal';
import { useProperties } from '../../hooks/useProperties';
import { usePropertyShowings } from '../../hooks/usePropertyShowings';
import { useAuthStore } from '../../store/authStore';
import type { Property } from '../../types/property';
import type { TimeSlotInput } from '../../types/calendar';

export function AgentCalendar() {
  const { user } = useAuthStore();
  const { properties } = useProperties(user?.id);
  const { showings, addPropertyShowing } = usePropertyShowings(user?.id || '');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] || null);
  const [showModal, setShowModal] = useState(false);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleAddTimeSlots = async (slots: TimeSlotInput[]) => {
    if (!selectedProperty || !user?.id) return;

    try {
      await addPropertyShowing(selectedProperty, slots);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to add time slots:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <PropertySelector
              properties={properties}
              selectedProperty={selectedProperty}
              onSelect={setSelectedProperty}
            />
            <Button
              onClick={() => setShowModal(true)}
              disabled={!selectedProperty}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Time Slots
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar grid will go here */}
      </div>

      {showModal && selectedProperty && user?.id && (
        <TimeSlotModal
          propertyId={selectedProperty.id}
          agentId={user.id}
          onClose={() => setShowModal(false)}
          onAdd={handleAddTimeSlots}
        />
      )}
    </div>
  );
}
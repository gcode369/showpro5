import React, { useState } from 'react';
import { Calendar, MapPin, Users, ExternalLink, Trash2, UserPlus } from 'lucide-react';
import { Button } from '../common/Button';
import { OpenHouse } from '../../types/openHouse';
import { LeadsList } from './LeadsList';
import { useLeads } from '../../hooks/useLeads';

type OpenHouseCardProps = {
  openHouse: OpenHouse;
  onDelete: (id: string) => void;
};

export function OpenHouseCard({ openHouse, onDelete }: OpenHouseCardProps) {
  const [showLeads, setShowLeads] = useState(false);
  const { leads, updateLeadStatus } = useLeads(openHouse.id);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {openHouse.address}
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{openHouse.city}, {openHouse.postalCode}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{openHouse.date} | {openHouse.startTime} - {openHouse.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{leads.length} Registered Leads</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowLeads(!showLeads)}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {showLeads ? 'Hide Leads' : 'View Leads'}
          </Button>
          {openHouse.listingUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(openHouse.listingUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Listing
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onDelete(openHouse.id)}
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showLeads && (
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">Registered Leads</h4>
          <LeadsList leads={leads} onUpdateStatus={updateLeadStatus} />
        </div>
      )}
    </div>
  );
}
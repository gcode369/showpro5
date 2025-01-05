import React from 'react';
import { Mail, Phone, Calendar, Star } from 'lucide-react';
import type { Lead } from '../../types/lead';

type LeadsListProps = {
  leads: Lead[];
  onUpdateStatus: (leadId: string, status: Lead['followUpStatus']) => void;
};

export function LeadsList({ leads, onUpdateStatus }: LeadsListProps) {
  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {lead.name}
                {lead.prequalified && (
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                )}
              </h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${lead.email}`} className="hover:text-blue-600">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                    {lead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Registered: {new Date(lead.registrationDate).toLocaleDateString()}</span>
                </div>
              </div>
              {lead.notes && (
                <p className="mt-2 text-gray-600 text-sm">{lead.notes}</p>
              )}
              {lead.interestedInSimilar && (
                <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Interested in similar properties
                </span>
              )}
            </div>
            <select
              value={lead.followUpStatus}
              onChange={(e) => onUpdateStatus(lead.id, e.target.value as Lead['followUpStatus'])}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="not-interested">Not Interested</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
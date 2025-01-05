import { type FC } from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';
import type { Lead } from '../../types/lead';

type LeadsListProps = {
  leads: Lead[];
  onUpdateStatus: (leadId: string, status: Lead['followUpStatus']) => void;
};

export const LeadsList: FC<LeadsListProps> = ({ leads, onUpdateStatus }) => {
  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{lead.name}</h3>
              <div className="mt-2 space-y-2">
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
                <p className="mt-2 text-sm text-gray-600">{lead.notes}</p>
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
};
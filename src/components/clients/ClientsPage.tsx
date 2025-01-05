import { type FC, useState } from 'react';
import { Tabs } from '../common/Tabs';
import { ClientList } from './ClientList';
import { LeadsOverview } from '../leads/LeadsOverview';
import { useClients } from '../../hooks/useClients';

type TabId = 'clients' | 'leads';

export const ClientsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('clients');
  const { clients, updateClient, deleteClient } = useClients();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabId);
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
        <p className="text-gray-600 mt-2">Manage your clients and leads</p>
      </header>

      <Tabs
        tabs={[
          { id: 'clients', label: 'Active Clients' },
          { id: 'leads', label: 'Leads' }
        ]}
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      <div className="mt-6">
        {activeTab === 'clients' ? (
          <ClientList
            clients={clients}
            onUpdate={updateClient}
            onDelete={deleteClient}
          />
        ) : (
          <LeadsOverview />
        )}
      </div>
    </div>
  );
};
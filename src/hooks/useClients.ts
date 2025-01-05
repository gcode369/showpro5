import { useState } from 'react';
import type { Client } from '../types/client';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id ? { ...client, ...updates } : client
      )
    );
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient
  };
}
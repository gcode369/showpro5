import { Viewing } from '../types/viewing';

export const mockViewings: Viewing[] = [
  {
    id: '1',
    propertyId: 'prop1',
    propertyTitle: 'Modern Downtown Condo',
    propertyAddress: '123 Main St, Suite 4B',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=500',
    date: '2024-03-25',
    time: '10:00 AM',
    status: 'upcoming',
    agentName: 'Sarah Johnson'
  },
  {
    id: '2',
    propertyId: 'prop2',
    propertyTitle: 'Suburban Family Home',
    propertyAddress: '456 Oak Avenue',
    propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=500',
    date: '2024-03-26',
    time: '2:30 PM',
    status: 'upcoming',
    agentName: 'Michael Brown'
  }
];
import { useState, useEffect } from 'react';
import type { Agent } from '../types/agent';

const mockAgentData: Record<string, Agent> = {
  '1': {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarahj_realtor',
    email: 'sarah.johnson@showpro.com',
    phone: '(604) 555-0123',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    areas: ['Vancouver', 'Burnaby'],
    rating: 4.8,
    reviews: 156,
    bio: 'Dedicated real estate professional with over 10 years of experience in the Greater Vancouver area. Specializing in residential properties and first-time homebuyers.',
    languages: ['English', 'French'],
    certifications: ['Licensed Real Estate Agent', 'Certified Negotiation Expert'],
    subscriptionStatus: 'active',
    subscriptionTier: 'premium'
  },
  '2': {
    id: '2',
    name: 'Michael Brown',
    username: 'mikebrown_homes',
    email: 'michael.brown@showpro.com',
    phone: '(604) 555-0124',
    photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
    areas: ['Surrey', 'Richmond'],
    rating: 4.9,
    reviews: 203,
    bio: 'Experienced realtor specializing in luxury properties and investment opportunities. Helping clients make informed decisions in the competitive BC market.',
    languages: ['English', 'Mandarin'],
    certifications: ['Licensed Real Estate Agent', 'Luxury Home Marketing Specialist'],
    subscriptionStatus: 'active',
    subscriptionTier: 'premium'
  }
};

export function useAgent(agentId: string | undefined) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setError('Agent ID is required');
      setLoading(false);
      return;
    }

    // Simulate API call
    const fetchAgent = () => {
      setTimeout(() => {
        const agent = mockAgentData[agentId];
        if (agent) {
          setAgent(agent);
          setError(null);
        } else {
          setError('Agent not found');
        }
        setLoading(false);
      }, 500);
    };

    fetchAgent();
  }, [agentId]);

  return { agent, loading, error };
}
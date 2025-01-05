export type Agent = {
  id: string;
  email: string;
  name: string;
  username: string;
  phone: string;
  areas: string[];
  rating?: number;
  reviews?: number;
  bio?: string;
  languages?: string[];
  certifications?: string[];
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  subscriptionTier: 'basic' | 'premium';
};
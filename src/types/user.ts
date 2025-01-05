export type UserRole = 'agent' | 'client';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionStatus?: 'trial' | 'active' | 'inactive';
  subscriptionTier?: 'basic' | 'premium';
};

export type UserProfile = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  subscriptionStatus?: 'trial' | 'active' | 'inactive';
  subscriptionTier?: 'basic' | 'premium';
};
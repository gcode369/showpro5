export type UserRole = 'agent' | 'client';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  areas?: string[];
  bio?: string;
  phone?: string;
  languages?: string[];
  certifications?: string[];
  subscriptionStatus?: 'trial' | 'active' | 'inactive';
  subscriptionTier?: 'basic' | 'premium';
};

export type AuthSession = {
  user: {
    id: string;
    email: string;
    user_metadata: {
      name: string;
      role: UserRole;
    };
  };
};

export type UserRegistrationData = {
  email: string;
  password: string;
  name: string;
  username?: string;
  phone?: string;
  role: UserRole;
  areas?: string[];
  bio?: string;
  languages?: string[];
  certifications?: string[];
  preferredAreas?: string[];
  preferredContact?: 'email' | 'phone' | 'both';
  prequalified?: boolean;
  prequalificationDetails?: {
    amount?: string;
    lender?: string;
    expiryDate?: string;
  };
};
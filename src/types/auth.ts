export type UserRole = 'agent' | 'client';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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

export type AuthResponse = {
  session: AuthSession | null;
  user: AuthUser;
};

export type UserRegistrationData = {
  email: string;
  password: string;
  name: string;
  username?: string;
  phone?: string;
  role: UserRole;
  preferredAreas?: string[];
  preferredContact?: 'email' | 'phone' | 'both';
  prequalified?: boolean;
  prequalificationDetails?: {
    amount?: string;
    lender?: string;
    expiryDate?: string;
  };
};
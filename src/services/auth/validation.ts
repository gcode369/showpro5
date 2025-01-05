import { z } from 'zod';

export const profileDataSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3).optional(),
  phone: z.string().optional()
});

export const agentProfileSchema = profileDataSchema.extend({
  subscription_tier: z.enum(['basic', 'premium']),
  subscription_status: z.enum(['trial', 'active', 'inactive'])
});

export const clientProfileSchema = profileDataSchema.extend({
  preferred_areas: z.array(z.string()).optional(),
  preferred_contact: z.enum(['email', 'phone', 'both']).optional(),
  prequalified: z.boolean().optional(),
  prequalification_details: z.object({
    amount: z.string().optional(),
    lender: z.string().optional(),
    expiry_date: z.string().optional()
  }).optional()
});
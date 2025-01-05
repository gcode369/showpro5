import { z } from 'zod';

// User schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['agent', 'client'])
});

// Profile schemas
export const agentProfileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format'),
  areas: z.array(z.string()).min(1, 'Select at least one area'),
  bio: z.string().optional(),
  languages: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional()
});

export const clientProfileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format'),
  preferredAreas: z.array(z.string()).min(1, 'Select at least one area'),
  preferredContact: z.enum(['email', 'phone', 'both']),
  prequalified: z.boolean(),
  prequalificationDetails: z.object({
    amount: z.string().optional(),
    lender: z.string().optional(),
    expiryDate: z.string().optional()
  }).optional()
});

// Booking schemas
export const bookingSchema = z.object({
  timeSlotId: z.string().uuid(),
  propertyId: z.string().uuid(),
  attendees: z.number().min(1),
  notes: z.string().optional()
});

export async function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const validData = await schema.parseAsync(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Validation failed' };
  }
}
```typescript
import { z } from 'zod';

export const bookingSchema = z.object({
  propertyId: z.string().uuid(),
  timeSlotId: z.string().uuid(),
  attendees: z.number().min(1),
  notes: z.string().optional()
});

export const propertySchema = z.object({
  title: z.string().min(3),
  address: z.string().min(5),
  city: z.string(),
  price: z.number().positive(),
  description: z.string(),
  images: z.array(z.string().url()),
  type: z.enum(['HOUSE', 'CONDO', 'TOWNHOUSE', 'LAND']),
  features: z.array(z.string()),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  squareFeet: z.number().optional(),
  listingUrl: z.string().url().optional()
});
```
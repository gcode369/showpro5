import { describe, test, expect } from 'vitest';
import { propertyService } from '../../services/property/PropertyService';

describe('Property Management', () => {
  test('Create Property', async () => {
    const property = await propertyService.createProperty({
      title: 'Test Property',
      address: '123 Test St',
      city: 'Vancouver',
      price: 500000,
      description: 'Test property',
      category: 'residential',
      type: 'house',
      status: 'available'
    });
    expect(property).toBeTruthy();
    expect(property.title).toBe('Test Property');
  });
});
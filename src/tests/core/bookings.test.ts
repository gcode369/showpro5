import { expect, test } from 'vitest';
import { useBookings } from '../../hooks/useBookings';
import { renderHook } from '@testing-library/react';

test('bookings hook manages booking state', async () => {
  const { result } = renderHook(() => useBookings());
  
  expect(result.current.bookings).toEqual([]);
  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(null);
});
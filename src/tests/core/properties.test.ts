import { expect, test } from 'vitest';
import { useProperties } from '../../hooks/useProperties';
import { renderHook } from '@testing-library/react';

test('properties hook manages property state', async () => {
  const { result } = renderHook(() => useProperties());
  
  expect(result.current.properties).toEqual([]);
  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(null);
});
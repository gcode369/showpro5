import { describe, test, expect } from 'vitest';
import { authService } from '../../services/auth/AuthService';

describe('Authentication', () => {
  test('Agent Registration', async () => {
    const result = await authService.register('test.agent@example.com', 'Test123!', {
      name: 'Test Agent',
      role: 'agent'
    });
    expect(result.user).toBeTruthy();
    expect(result.user?.email).toBe('test.agent@example.com');
  });
});
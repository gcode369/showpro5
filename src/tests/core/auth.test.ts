import { expect, test } from 'vitest';
import { authService } from '../../services/auth/AuthService';
import { useAuthStore } from '../../store/authStore';

test('auth store manages user state correctly', () => {
  const { user, setUser, logout } = useAuthStore.getState();
  
  // Initial state
  expect(user).toBe(null);
  
  // Set user
  const testUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'client' as const
  };
  setUser(testUser);
  expect(useAuthStore.getState().user).toEqual(testUser);
  
  // Logout
  logout();
  expect(useAuthStore.getState().user).toBe(null);
});
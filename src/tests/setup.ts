import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock Supabase client
vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'test-id', email: 'test@example.com' } }, 
        error: null 
      }),
      signIn: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
      update: vi.fn(),
      delete: vi.fn()
    }))
  }
}));

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeAll(() => {
  // Set up test environment variables
  process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = 'test-key';
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  vi.clearAllMocks();
});
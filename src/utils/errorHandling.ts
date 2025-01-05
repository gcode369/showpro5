export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export function handleAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) return error;
  
  const message = error instanceof Error ? error.message : 'Authentication failed';
  return new AuthError(message);
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
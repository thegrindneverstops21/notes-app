export type AuthErrorCode =
  | 'VALIDATION'
  | 'EMAIL_TAKEN'
  | 'USERNAME_TAKEN'
  | 'INVALID_LOGIN'
  | 'WRONG_PASSWORD'
  | 'USER_NOT_FOUND';

export const AUTH_MESSAGES = {
  EMAIL_TAKEN: 'That email is already registered. Try signing in.',
  USERNAME_TAKEN: 'That username is taken. Pick another one.',
  INVALID_LOGIN: 'Email, username or password is wrong.',
  WRONG_PASSWORD: 'Your current password is wrong.',
  USER_NOT_FOUND: 'We could not find your account. Sign in again.',
  NO_CHANGES: 'Change at least one field before saving.',
  PROFILE_SAVED: 'Saved.',
  GENERIC: 'Something went wrong. Please try again.',
} as const;

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

export function describeError(error: unknown): string {
  return error instanceof AuthError ? error.message : AUTH_MESSAGES.GENERIC;
}
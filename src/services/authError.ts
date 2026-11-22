import { PROBLEMS } from "../constants/messages";
import { StorageError } from "../lib/storage";
import { DataError } from "./dataError";

export type AuthErrorCode =
  | "VALIDATION"
  | "EMAIL_TAKEN"
  | "USERNAME_TAKEN"
  | "INVALID_LOGIN"
  | "WRONG_PASSWORD"
  | "USER_NOT_FOUND";

export const AUTH_MESSAGES = {
  EMAIL_TAKEN: "That email is already registered. Try signing in.",
  USERNAME_TAKEN: "That username is taken. Pick another one.",
  INVALID_LOGIN: "Email, username or password is wrong.",
  WRONG_PASSWORD: "Your current password is wrong.",
  USER_NOT_FOUND: "We could not find your account. Sign in again.",
  NO_CHANGES: "Change at least one field before saving.",
  GENERIC: "Something went wrong. Please try again.",
} as const;

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export function describeError(error: unknown): string {
  if (error instanceof AuthError || error instanceof DataError)
    return error.message;
  if (error instanceof StorageError) return PROBLEMS.STORAGE;
  return AUTH_MESSAGES.GENERIC;
}

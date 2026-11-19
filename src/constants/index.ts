import { ENV } from "../config/env";

const prefix = ENV.STORAGE_PREFIX;

// This constant object is used to define the keys used for storing data in AsyncStorage and SecureStore.
export const STORAGE_KEYS = {
  USERS: `${prefix}_users`,
  SESSION: `${prefix}_session`,
  categoriesFor: (userId: string) => `${prefix}_categories_${userId}`,
  notesFor: (userId: string) => `${prefix}_notes_${userId}`,
  onboardedFor: (userId: string) => `${prefix}_onboarded_${userId}`,
} as const;

// This constant object is used to define the rules for user authentication, usernames and passwords, as well as parameters for password hashing.
export const AUTH_RULES = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 8,
  SALT_BYTES: 16,
  PBKDF2_ITERATIONS: 10000,
  PBKDF2_KEY_BITS: 256,
} as const;

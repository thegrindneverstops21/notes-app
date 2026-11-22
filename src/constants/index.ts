import { ENV } from "../config/env";
import type { SortOrder } from "../types";

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
  SUGGESTION_LIMIT: 3,
} as const;

// This constant object is used to define the rules for data validation, such as the maximum length of category names.
export const DATA_RULES = {
  CATEGORY_NAME_MAX: 30,
} as const;

// This constant defines the default sort order for notes and categories.
export const DEFAULT_SORT: SortOrder = "desc";

// This constant defines the default category names that are created for a new user.
export const DEFAULT_CATEGORY_NAMES = ["Work", "Study", "Personal"] as const;

// This constant defines the duration for which toast notifications are displayed in the app, in milliseconds.
export const TOAST_DURATION_MS = 3000;

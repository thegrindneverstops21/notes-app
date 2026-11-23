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

// This constant object is used to define the dimensions and layout of the canvas in the app.
export const CANVAS = {
  CARD_WIDTH: 168,
  SLOT_GAP: 16,
  SLOT_ROW_HEIGHT: 170,
  SLOT_COLUMNS: 2,
  HOME_X: 24,
  HOME_Y: 96,
  MIN_SCALE: 0.4,
  MAX_SCALE: 2,
  FRACTION_SCALE: 0.7,
  LONG_PRESS_MS: 200,
  SWIPE_UP_DISTANCE: 48,
  SWIPE_UP_VELOCITY: 800,
} as const;

// This constant object is used to define the zoom animation when a card opens into its editor page.
export const ZOOM = {
  IN_MS: 280,
  OUT_MS: 200,
  DEFAULT_SCALE: 0.92,
  MIN_SCALE: 0.15,
  MAX_SCALE: 0.95,
  NEW_CARD_WIDTH: 160,
  NEW_CARD_BOTTOM: 72,
} as const;
import { ENV } from "../config/env";

const prefix = ENV.STORAGE_PREFIX;

export const STORAGE_KEYS = {
  USERS: `${prefix}_users`,
  SESSION: `${prefix}_session`,
  categoriesFor: (userId: string) => `${prefix}_categories_${userId}`,
  notesFor: (userId: string) => `${prefix}_notes_${userId}`,
  onboardedFor: (userId: string) => `${prefix}_onboarded_${userId}`,
} as const;

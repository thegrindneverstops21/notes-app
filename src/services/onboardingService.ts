import { STORAGE_KEYS } from "../constants";
import { readJson, removeKey, writeJson } from "../lib/storage";

export function isOnboarded(userId: string): Promise<boolean> {
  return readJson<boolean>(STORAGE_KEYS.onboardedFor(userId), false);
}

export function markOnboarded(userId: string): Promise<void> {
  return writeJson(STORAGE_KEYS.onboardedFor(userId), true);
}

export function resetOnboarding(userId: string): Promise<void> {
  return removeKey(STORAGE_KEYS.onboardedFor(userId));
}

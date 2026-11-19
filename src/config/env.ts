// This file is used to read environment variables from the .env file and validate them.
const STORAGE_PREFIX_PATTERN = /^[A-Za-z0-9_]+$/;

// Read the storage prefix from the environment variable and validate it
function readStoragePrefix(): string {
  const value = process.env.EXPO_PUBLIC_STORAGE_PREFIX;
  if (!value || !STORAGE_PREFIX_PATTERN.test(value)) {
    throw new Error(
      'EXPO_PUBLIC_STORAGE_PREFIX is missing or invalid. Use letters, numbers and underscores only, set it in .env, then restart with: npx expo start -c'
    );
  }
  return value;
}

// Export the environment variables as a constant object
export const ENV = {
  STORAGE_PREFIX: readStoragePrefix(),
} as const;
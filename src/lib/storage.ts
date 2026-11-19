import AsyncStorage from '@react-native-async-storage/async-storage';

// This class is used to represent errors that occur during storage operations. 
// It extends the built-in Error class and includes an optional original error for more context.
export class StorageError extends Error {
  readonly original?: unknown;

  constructor(message: string, original?: unknown) {
    super(message);
    this.name = 'StorageError';
    this.original = original;
  }
}

// This function is used to read a JSON value from the device's storage.
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch (error) {
    throw new StorageError(`Could not read "${key}"`, error);
  }
}

// This function is used to write a JSON value to the device's storage.
export async function writeJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new StorageError(`Could not save "${key}"`, error);
  }
}

// This function is used to remove a value from the device's storage.
export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw new StorageError(`Could not remove "${key}"`, error);
  }
}

// Runs read-change-write one at a time per key, so quick updates never overwrite each other.
// shortcut: queue lives in memory, so it only protects one running app instance.
const queues = new Map<string, Promise<unknown>>();

// This function is used to update a JSON value in the device's storage by reading the current value, applying an update function, and writing the updated value back to storage. 
// It ensures that updates for the same key are processed one at a time to prevent race conditions.
export function updateJson<T>(
  key: string,
  fallback: T,
  update: (current: T) => T
): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve();
  const next = previous.then(async () => {
    const current = await readJson(key, fallback);
    const updated = update(current);
    await writeJson(key, updated);
    return updated;
  });
  queues.set(key, next.catch(() => undefined));
  return next;
}
import * as SecureStore from 'expo-secure-store';
import { StorageError } from './storage';

//This function is used to retrieve a value securely in the device's secure storage. 
export async function getSecure(key: string): Promise<string | null> {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        throw new StorageError(`Could not read secure "${key}"`, error);
    }
}

//This function is used to store a value securely in the device's secure storage.
export async function setSecure(key: string, value: string): Promise<void> {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        throw new StorageError(`Could not save secure "${key}"`, error);
    }
}

//This function is used to delete a value securely from the device's secure storage.
export async function deleteSecure(key: string): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        throw new StorageError(`Could not remove secure "${key}"`, error);
    }
}
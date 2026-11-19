import * as Crypto from "expo-crypto";

// This function is used to generate a new unique identifier (UUID) using the Crypto API.
export function newId(): string {
    return Crypto.randomUUID();
}
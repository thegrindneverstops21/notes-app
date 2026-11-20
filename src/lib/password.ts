import CryptoJS from "crypto-js";
import * as Crypto from "expo-crypto";
import { AUTH_RULES } from "../constants";

// shortcut: iterations are capped by pure-JS speed on a phone.
const BITS_PER_WORD = 32;

// This function is used to convert a byte array to a hexadecimal string.
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

// This function is used to generate a random salt for password hashing.
export async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(AUTH_RULES.SALT_BYTES);
  return bytesToHex(bytes);
}

// This function is used to derive a hash from a password and salt using the PBKDF2 algorithm.
function derive(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: AUTH_RULES.PBKDF2_KEY_BITS / BITS_PER_WORD,
    iterations: AUTH_RULES.PBKDF2_ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  }).toString();
}

// Lets the screen draw its spinner before the heavy work blocks the JS thread.
function yieldToUi(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// This function is used to hash a password with a given salt. It yields to the UI thread before performing the heavy computation to avoid blocking the user interface.
export async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {
  await yieldToUi();
  return derive(password, salt);
}

// This function is used to compare two strings in a way that is resistant to timing attacks. It returns true if the strings are equal, and false otherwise.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// This function is used to verify if a given password, when hashed with a given salt, matches an expected hash. 
export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> {
  const actual = await hashPassword(password, salt);
  return safeEqual(actual, expectedHash);
}

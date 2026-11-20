import { AUTH_RULES } from "../constants";
import type { CredentialChanges, RegisterInput } from "../types";

// Validation functions for user input. These are used both in the frontend and backend to ensure consistent validation rules.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

// Password requirements
const PASSWORD_REQUIREMENTS = [
  { pattern: /[A-Z]/, label: "an uppercase letter" },
  { pattern: /[0-9]/, label: "a number" },
  { pattern: /[^A-Za-z0-9\s]/, label: "a symbol" },
] as const;

export const PASSWORD_HINT = `At least ${AUTH_RULES.PASSWORD_MIN} characters with an uppercase letter, a number and a symbol.`;

// Helper function to join a list of strings with commas and "and" for the last item.
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

// Validation functions for email. Each function returns null if the input is valid, or an error message string if invalid.
export function validateEmail(email: string): string | null {
  return EMAIL_PATTERN.test(email.trim())
    ? null
    : "Enter a valid email address.";
}

// Validation functions for username. Each function returns null if the input is valid, or an error message string if invalid.
export function validateUsername(username: string): string | null {
  const value = username.trim();
  const { USERNAME_MIN, USERNAME_MAX } = AUTH_RULES;
  if (value.length < USERNAME_MIN || value.length > USERNAME_MAX) {
    return `Username must be ${USERNAME_MIN} to ${USERNAME_MAX} characters.`;
  }
  if (!USERNAME_PATTERN.test(value)) {
    return "Username can only use letters, numbers and underscores.";
  }
  return null;
}


// Validation functions for password. Each function returns null if the input is valid, or an error message string if invalid.
export function validatePassword(password: string): string | null {
  if (password.length < AUTH_RULES.PASSWORD_MIN) {
    return `Password must be at least ${AUTH_RULES.PASSWORD_MIN} characters.`;
  }
  const missing = PASSWORD_REQUIREMENTS.filter(
    (rule) => !rule.pattern.test(password),
  ).map((rule) => rule.label);
  return missing.length === 0 ? null : `Password needs ${joinList(missing)}.`;
}

// Validation functions for user registration input. Each function returns null if the input is valid, or an error message string if invalid.
export function validateRegisterInput(input: RegisterInput): string | null {
  return (
    validateEmail(input.email) ??
    validateUsername(input.username) ??
    validatePassword(input.password)
  );
}

// Validation functions for user profile changes. Each function returns null if the input is valid, or an error message string if invalid.
export function validateChanges(changes: CredentialChanges): string | null {
  const checks = [
    changes.email === undefined ? null : validateEmail(changes.email),
    changes.username === undefined ? null : validateUsername(changes.username),
    changes.newPassword === undefined
      ? null
      : validatePassword(changes.newPassword),
  ];
  return checks.find((message) => message !== null) ?? null;
}

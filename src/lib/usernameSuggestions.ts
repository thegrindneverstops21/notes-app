import { AUTH_RULES } from "../constants";
import { validateUsername } from "./validation";

const SEPARATORS = /[^a-z0-9]+/;
const NUMBERED_CANDIDATES = 9;

function tokensOf(email: string): string[] {
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length < 2) return [];
  return (parts[0] ?? "").split(SEPARATORS).filter(Boolean);
}

function fitLength(value: string): string {
  return value.slice(0, AUTH_RULES.USERNAME_MAX);
}

function withNumber(base: string, number: number): string {
  const room = AUTH_RULES.USERNAME_MAX - String(number).length;
  return `${base.slice(0, room)}${number}`;
}

export function buildUsernameCandidates(email: string): string[] {
  const tokens = tokensOf(email);
  if (tokens.length === 0) return [];

  const joined = tokens.join("_");
  const named = [joined, tokens[0], tokens[tokens.length - 1]];
  const numbered = Array.from({ length: NUMBERED_CANDIDATES }, (_, index) =>
    withNumber(joined, index + 1),
  );
  const valid = [...named, ...numbered]
    .map((name) => fitLength(name ?? ""))
    .filter((name) => validateUsername(name) === null);
  return Array.from(new Set(valid));
}

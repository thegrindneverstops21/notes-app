import { AUTH_RULES, STORAGE_KEYS } from "../constants";
import { newId } from "../lib/id";
import { generateSalt, hashPassword, verifyPassword } from "../lib/password";
import { deleteSecure, getSecure, setSecure } from "../lib/secureStorage";
import { readJson, updateJson } from "../lib/storage";
import { validateChanges, validateRegisterInput } from "../lib/validation";
import type {
  CredentialChanges,
  PublicUser,
  RegisterInput,
  User,
} from "../types";
import { AUTH_MESSAGES, AuthError } from "./authError";
import { buildUsernameCandidates } from "../lib/usernameSuggestions";

type Identity = { email: string; username: string };

const normalizeEmail = (email: string): string => email.trim().toLowerCase();
const normalizeUsername = (username: string): string => username.trim();
const sameText = (a: string, b: string): boolean =>
  a.toLowerCase() === b.toLowerCase();

function toPublic(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  };
}

function loadUsers(): Promise<User[]> {
  return readJson<User[]>(STORAGE_KEYS.USERS, []);
}

function assertAvailable(
  users: User[],
  candidate: Identity,
  ignoreId?: string,
): void {
  const others = users.filter((user) => user.id !== ignoreId);
  if (others.some((user) => sameText(user.email, candidate.email))) {
    throw new AuthError("EMAIL_TAKEN", AUTH_MESSAGES.EMAIL_TAKEN);
  }
  if (others.some((user) => sameText(user.username, candidate.username))) {
    throw new AuthError("USERNAME_TAKEN", AUTH_MESSAGES.USERNAME_TAKEN);
  }
}

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const problem = validateRegisterInput(input);
  if (problem) throw new AuthError("VALIDATION", problem);

  const salt = await generateSalt();
  const user: User = {
    id: newId(),
    email: normalizeEmail(input.email),
    username: normalizeUsername(input.username),
    passwordHash: await hashPassword(input.password, salt),
    salt,
    createdAt: new Date().toISOString(),
  };
  await updateJson<User[]>(STORAGE_KEYS.USERS, [], (users) => {
    assertAvailable(users, user);
    return [...users, user];
  });
  await setSecure(STORAGE_KEYS.SESSION, user.id);
  return toPublic(user);
}

function findByIdentifier(users: User[], identifier: string): User | undefined {
  const value = identifier.trim();
  return users.find(
    (user) => sameText(user.email, value) || sameText(user.username, value),
  );
}

// shortcut: an unknown account answers faster than a wrong password, so timing can reveal which accounts exist. Acceptable for a local-only app.
export async function loginUser(
  identifier: string,
  password: string,
): Promise<PublicUser> {
  const user = findByIdentifier(await loadUsers(), identifier);
  if (!user) throw new AuthError("INVALID_LOGIN", AUTH_MESSAGES.INVALID_LOGIN);

  const valid = await verifyPassword(password, user.salt, user.passwordHash);
  if (!valid) throw new AuthError("INVALID_LOGIN", AUTH_MESSAGES.INVALID_LOGIN);

  await setSecure(STORAGE_KEYS.SESSION, user.id);
  return toPublic(user);
}

export async function restoreSession(): Promise<PublicUser | null> {
  const userId = await getSecure(STORAGE_KEYS.SESSION);
  if (!userId) return null;

  const user = (await loadUsers()).find((candidate) => candidate.id === userId);
  if (!user) {
    await deleteSecure(STORAGE_KEYS.SESSION);
    return null;
  }
  return toPublic(user);
}

export async function logoutUser(): Promise<void> {
  await deleteSecure(STORAGE_KEYS.SESSION);
}

async function buildUpdatedUser(
  current: User,
  changes: CredentialChanges,
): Promise<User> {
  const updated: User = {
    ...current,
    email:
      changes.email === undefined
        ? current.email
        : normalizeEmail(changes.email),
    username:
      changes.username === undefined
        ? current.username
        : normalizeUsername(changes.username),
  };
  if (!changes.newPassword) return updated;

  const salt = await generateSalt();
  return {
    ...updated,
    salt,
    passwordHash: await hashPassword(changes.newPassword, salt),
  };
}

function replaceUser(users: User[], next: User): User[] {
  assertAvailable(users, next, next.id);
  return users.map((user) => (user.id === next.id ? next : user));
}

export async function updateCredentials(
  userId: string,
  currentPassword: string,
  changes: CredentialChanges,
): Promise<PublicUser> {
  const problem = validateChanges(changes);
  if (problem) throw new AuthError("VALIDATION", problem);

  const current = (await loadUsers()).find((user) => user.id === userId);
  if (!current)
    throw new AuthError("USER_NOT_FOUND", AUTH_MESSAGES.USER_NOT_FOUND);

  const valid = await verifyPassword(
    currentPassword,
    current.salt,
    current.passwordHash,
  );
  if (!valid)
    throw new AuthError("WRONG_PASSWORD", AUTH_MESSAGES.WRONG_PASSWORD);

  const next = await buildUpdatedUser(current, changes);
  await updateJson<User[]>(STORAGE_KEYS.USERS, [], (users) =>
    replaceUser(users, next),
  );
  return toPublic(next);
}

export async function suggestUsernames(email: string): Promise<string[]> {
  const users = await loadUsers();
  return buildUsernameCandidates(email)
    .filter((name) => !users.some((user) => sameText(user.username, name)))
    .slice(0, AUTH_RULES.SUGGESTION_LIMIT);
}
    
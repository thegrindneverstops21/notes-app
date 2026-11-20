import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  restoreSession,
  updateCredentials,
} from "../services/authService";
import { AUTH_MESSAGES, AuthError } from "../services/authError";
import type { CredentialChanges, PublicUser, RegisterInput } from "../types";

type AuthStatus = "loading" | "signedIn" | "signedOut";
type ApplyUser = (user: PublicUser | null) => void;

type AuthContextValue = {
  status: AuthStatus;
  user: PublicUser | null;
  signUp: (input: RegisterInput) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (
    currentPassword: string,
    changes: CredentialChanges,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function createActions(user: PublicUser | null, applyUser: ApplyUser) {
  return {
    signUp: async (input: RegisterInput) =>
      applyUser(await registerUser(input)),
    signIn: async (identifier: string, password: string) =>
      applyUser(await loginUser(identifier, password)),
    signOut: async () => {
      await logoutUser();
      applyUser(null);
    },
    updateProfile: async (
      currentPassword: string,
      changes: CredentialChanges,
    ) => {
      if (!user)
        throw new AuthError("USER_NOT_FOUND", AUTH_MESSAGES.USER_NOT_FOUND);
      applyUser(await updateCredentials(user.id, currentPassword, changes));
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<PublicUser | null>(null);

  const applyUser = useCallback<ApplyUser>((next) => {
    setUser(next);
    setStatus(next ? "signedIn" : "signedOut");
  }, []);

  useEffect(() => {
    // A failed restore falls back to signed out. Sprint 4 adds a proper error state.
    restoreSession()
      .then(applyUser)
      .catch(() => applyUser(null));
  }, [applyUser]);

  const value = useMemo(
    () => ({ status, user, ...createActions(user, applyUser) }),
    [status, user, applyUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

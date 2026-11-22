import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  isOnboarded,
  markOnboarded,
  resetOnboarding,
} from "../services/onboardingService";

type OnboardingStatus = "loading" | "needed" | "done";

type OnboardingValue = {
  status: OnboardingStatus;
  complete: () => Promise<void>;
  restart: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingValue | null>(null);

export function OnboardingProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<OnboardingStatus>("loading");

  useEffect(() => {
    let cancelled = false;
    isOnboarded(userId)
      .then((done) => {
        if (!cancelled) setStatus(done ? "done" : "needed");
      })
      .catch(() => {
        // A storage failure must never trap someone in the tour.
        if (!cancelled) setStatus("done");
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const value = useMemo<OnboardingValue>(
    () => ({
      status,
      complete: async () => {
        await markOnboarded(userId);
        setStatus("done");
      },
      restart: async () => {
        await resetOnboarding(userId);
        setStatus("needed");
      },
    }),
    [status, userId],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingValue {
  const value = useContext(OnboardingContext);
  if (!value)
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  return value;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TOAST_DURATION_MS } from "../constants";
import { COLORS } from "../theme/colors";

type ToastKind = "success" | "error";
type Toast = { id: number; kind: ToastKind; message: string };
type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastBanner({ toast }: { toast: Toast }) {
  const insets = useSafeAreaInsets();
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        { bottom: insets.bottom + 24, opacity },
        toast.kind === "error" && styles.error,
      ]}
    >
      <Text style={styles.text}>{toast.message}</Text>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const showToast = useCallback(
    (message: string, kind: ToastKind = "success") => {
      if (timer.current) clearTimeout(timer.current);
      nextId.current += 1;
      setToast({ id: nextId.current, kind, message });
      timer.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? <ToastBanner key={toast.id} toast={toast} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 24,
    right: 24,
    backgroundColor: COLORS.ink,
    padding: 14,
    pointerEvents: "none",
  },
  error: { backgroundColor: COLORS.error },
  text: { color: COLORS.card },
});

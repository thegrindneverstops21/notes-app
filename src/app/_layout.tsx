import { useEffect } from "react";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Newsreader_600SemiBold } from "@expo-google-fonts/newsreader";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { ErrorState } from "@/components/ErrorState";
import { Screen } from "@/components/Screen";
import { PROBLEMS } from "@/constants/messages";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { FONTS, useTheme } from "@/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();

const FONT_FILES = {
  [FONTS.title]: Newsreader_600SemiBold,
  [FONTS.body]: PlusJakartaSans_400Regular,
  [FONTS.bodyMedium]: PlusJakartaSans_500Medium,
  [FONTS.bodyBold]: PlusJakartaSans_600SemiBold,
};

// Catches anything that throws while rendering, instead of a red crash screen.
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <Screen>
      <ErrorState message={PROBLEMS.CRASH} onRetry={retry} />
    </Screen>
  );
}

function RootNavigator() {
  const { status } = useAuth();
  const { colors } = useTheme();
  const [fontsLoaded, fontError] = useFonts(FONT_FILES);

  // A font failure falls back to the system font. It never blocks the app.
  const ready = status !== "loading" && (fontsLoaded || fontError !== null);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  const isSignedIn = status === "signedIn";
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.desk },
      }}
    >
      <Stack.Protected guard={!isSignedIn} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isSignedIn} redirectTo="/login">
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AuthProvider>
          <ToastProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </ToastProvider>
        </AuthProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

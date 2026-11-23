import { Stack } from "expo-router";
import { NotesSkeleton } from "@/components/NotesSkeleton";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { NotesProvider } from "@/context/NotesContext";
import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/theme";

// The editor draws its own zoom animation over the desk, so the stack adds none.
const ZOOM_PAGE = {
  headerShown: false,
  presentation: "transparentModal",
  animation: "none",
} as const;

function AppNavigator() {
  const { status } = useOnboarding();
  const { colors, fonts } = useTheme();

  if (status === "loading") {
    return (
      <Screen>
        <NotesSkeleton />
      </Screen>
    );
  }

  const needsOnboarding = status === "needed";
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.desk },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontFamily: fonts.title },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.desk },
      }}
    >
      <Stack.Protected guard={needsOnboarding} redirectTo="/">
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!needsOnboarding} redirectTo="/onboarding">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen name="category/[id]" options={{ title: "Category" }} />
        <Stack.Screen name="note/new" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="note/new" options={ZOOM_PAGE} />
        <Stack.Screen name="note/[id]" options={ZOOM_PAGE} />
      </Stack.Protected>
    </Stack>
  );
}

export default function AppLayout() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <NotesProvider key={user.id} userId={user.id}>
      <OnboardingProvider key={user.id} userId={user.id}>
        <AppNavigator />
      </OnboardingProvider>
    </NotesProvider>
  );
}

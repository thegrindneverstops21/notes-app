import { Stack } from "expo-router";
import { NotesSkeleton } from "@/components/NotesSkeleton";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { NotesProvider } from "@/context/NotesContext";
import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";

function AppNavigator() {
  const { status } = useOnboarding();

  if (status === "loading") {
    return (
      <Screen>
        <NotesSkeleton />
      </Screen>
    );
  }

  const needsOnboarding = status === "needed";
  return (
    <Stack>
      <Stack.Protected guard={needsOnboarding}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!needsOnboarding}>
        <Stack.Screen name="index" options={{ title: "Notes" }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen name="category/[id]" options={{ title: "Category" }} />
        <Stack.Screen name="note/new" options={{ title: "New note" }} />
        <Stack.Screen name="note/[id]" options={{ title: "Edit note" }} />
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

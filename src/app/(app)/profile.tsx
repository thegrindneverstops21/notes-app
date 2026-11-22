import { useState } from "react";
import { Pressable, Text } from "react-native";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { FEEDBACK, PROBLEMS } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useToast } from "@/context/ToastContext";
import { useSubmit } from "@/hooks/useSubmit";
import { PASSWORD_HINT } from "@/lib/validation";
import { AUTH_MESSAGES, AuthError } from "@/services/authError";
import { useTextStyles } from "@/theme/useTextStyles";
import type { CredentialChanges, PublicUser } from "@/types";

type ProfileForm = {
  email: string;
  username: string;
  newPassword: string;
  currentPassword: string;
};

function buildChanges(user: PublicUser, form: ProfileForm): CredentialChanges {
  const changes: CredentialChanges = {};
  if (form.email.trim().toLowerCase() !== user.email)
    changes.email = form.email;
  if (form.username.trim() !== user.username) changes.username = form.username;
  if (form.newPassword) changes.newPassword = form.newPassword;
  return changes;
}

export default function ProfileScreen() {
  const textStyles = useTextStyles();
  const { user, updateProfile } = useAuth();
  const { restart } = useOnboarding();
  const { showToast } = useToast();
  const { error, busy, submit } = useSubmit();
  const [form, setForm] = useState<ProfileForm>({
    email: user?.email ?? "",
    username: user?.username ?? "",
    newPassword: "",
    currentPassword: "",
  });

  const setField = (key: keyof ProfileForm) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function handleSave() {
    const changes = user ? buildChanges(user, form) : {};
    const ok = await submit(async () => {
      if (Object.keys(changes).length === 0) {
        throw new AuthError("VALIDATION", AUTH_MESSAGES.NO_CHANGES);
      }
      await updateProfile(form.currentPassword, changes);
    });
    if (!ok) return;
    showToast(FEEDBACK.PROFILE_UPDATED);
    setForm((current) => ({
      ...current,
      newPassword: "",
      currentPassword: "",
    }));
  }

  const replayTour = () => {
    restart().catch(() => showToast(PROBLEMS.STORAGE, "error"));
  };

  return (
    <Screen>
      <FormField
        label="Email"
        value={form.email}
        onChangeText={setField("email")}
      />
      <FormField
        label="Username"
        value={form.username}
        onChangeText={setField("username")}
      />
      <FormField
        label="New password (leave blank to keep)"
        hint={PASSWORD_HINT}
        value={form.newPassword}
        onChangeText={setField("newPassword")}
        secureTextEntry
      />
      <FormField
        label="Current password (required)"
        value={form.currentPassword}
        onChangeText={setField("currentPassword")}
        secureTextEntry
      />
      {error ? <Text style={textStyles.error}>{error}</Text> : null}
      <PrimaryButton label="Save changes" busy={busy} onPress={handleSave} />
      <Pressable onPress={replayTour} accessibilityRole="button">
        <Text style={textStyles.link}>Replay the tour</Text>
      </Pressable>
    </Screen>
  );
}

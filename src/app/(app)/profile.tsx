import { useState } from "react";
import { Text } from "react-native";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { useSubmit } from "@/hooks/useSubmit";
import { AUTH_MESSAGES, AuthError } from "@/services/authError";
import { textStyles } from "@/theme/textStyles";
import type { CredentialChanges, PublicUser } from "@/types";
import { PASSWORD_HINT } from "@/lib/validation";

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
  const { user, updateProfile } = useAuth();
  const { error, busy, submit } = useSubmit();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    email: user?.email ?? "",
    username: user?.username ?? "",
    newPassword: "",
    currentPassword: "",
  });

  const setField = (key: keyof ProfileForm) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function handleSave() {
    setSaved(false);
    const changes = user ? buildChanges(user, form) : {};
    const ok = await submit(async () => {
      if (Object.keys(changes).length === 0) {
        throw new AuthError("VALIDATION", AUTH_MESSAGES.NO_CHANGES);
      }
      await updateProfile(form.currentPassword, changes);
    });
    if (!ok) return;
    setSaved(true);
    setForm((current) => ({
      ...current,
      newPassword: "",
      currentPassword: "",
    }));
  }

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
      {saved ? (
        <Text style={textStyles.success}>{AUTH_MESSAGES.PROFILE_SAVED}</Text>
      ) : null}
      <PrimaryButton label="Save changes" busy={busy} onPress={handleSave} />
    </Screen>
  );
}

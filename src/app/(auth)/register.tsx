import { useState } from "react";
import { Text } from "react-native";
import { Link } from "expo-router";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SuggestionChips } from "@/components/SuggestionChips";
import { useAuth } from "@/context/AuthContext";
import { useSubmit } from "@/hooks/useSubmit";
import { useUsernameSuggestions } from "@/hooks/useUsernameSuggestions";
import { PASSWORD_HINT } from "@/lib/validation";
import { useTextStyles } from "@/theme/useTextStyles";

export default function RegisterScreen() {
  const textStyles = useTextStyles();
  const { signUp } = useAuth();
  const { error, busy, submit } = useSubmit();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const suggestions = useUsernameSuggestions(email).filter(
    (name) => name !== username,
  );

  return (
    <Screen>
      <Text style={textStyles.title}>Create account</Text>
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <FormField label="Username" value={username} onChangeText={setUsername} />
      <SuggestionChips suggestions={suggestions} onPick={setUsername} />
      <FormField
        label="Password"
        hint={PASSWORD_HINT}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={textStyles.error}>{error}</Text> : null}
      <PrimaryButton
        label="Create account"
        busy={busy}
        onPress={() => submit(() => signUp({ email, username, password }))}
      />
      <Link href="/login" style={textStyles.link}>
        I already have an account
      </Link>
    </Screen>
  );
}

import { useState } from "react";
import { Text } from "react-native";
import { Link } from "expo-router";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { useSubmit } from "@/hooks/useSubmit";
import { useTextStyles } from "@/theme/useTextStyles";

export default function LoginScreen() {
  const textStyles = useTextStyles();
  const { signIn } = useAuth();
  const { error, busy, submit } = useSubmit();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Screen>
      <Text style={textStyles.title}>Sign in</Text>
      <FormField
        label="Email or username"
        value={identifier}
        onChangeText={setIdentifier}
      />
      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={textStyles.error}>{error}</Text> : null}
      <PrimaryButton
        label="Sign in"
        busy={busy}
        onPress={() => submit(() => signIn(identifier, password))}
      />
      <Link href="/register" style={textStyles.link}>
        Create an account
      </Link>
    </Screen>
  );
}

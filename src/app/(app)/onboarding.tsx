import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ONBOARDING_STEPS } from "@/constants/onboarding";
import { useOnboarding } from "@/context/OnboardingContext";
import { useSubmit } from "@/hooks/useSubmit";
import { COLORS } from "@/theme/colors";
import { textStyles } from "@/theme/textStyles";

export default function OnboardingScreen() {
  const { complete } = useOnboarding();
  const { error, busy, submit } = useSubmit();
  const [index, setIndex] = useState(0);
  const step = ONBOARDING_STEPS[index];
  const isLast = index === ONBOARDING_STEPS.length - 1;

  if (!step) return null;

  const advance = () => (isLast ? submit(complete) : setIndex(index + 1));

  return (
    <Screen>
      <Text style={styles.progress}>
        {index + 1} of {ONBOARDING_STEPS.length}
      </Text>
      <Text style={textStyles.title}>{step.title}</Text>
      <Text style={styles.body}>{step.body}</Text>
      {error ? <Text style={textStyles.error}>{error}</Text> : null}
      <PrimaryButton
        label={isLast ? "Get started" : "Next"}
        busy={busy}
        onPress={advance}
      />
      {isLast ? null : (
        <Pressable onPress={() => submit(complete)} accessibilityRole="button">
          <Text style={textStyles.link}>Skip</Text>
        </Pressable>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { color: COLORS.meta, marginBottom: 8 },
  body: { color: COLORS.ink, fontSize: 16, lineHeight: 24, marginBottom: 24 },
});

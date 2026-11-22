import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ONBOARDING_STEPS } from "@/constants/onboarding";
import { useOnboarding } from "@/context/OnboardingContext";
import { useSubmit } from "@/hooks/useSubmit";
import { useThemedStyles, type Theme } from "@/theme";
import { useTextStyles } from "@/theme/useTextStyles";

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    progress: {
      color: t.colors.meta,
      fontFamily: t.fonts.body,
      marginBottom: 8,
    },
    body: {
      color: t.colors.ink,
      fontFamily: t.fonts.body,
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 24,
    },
  });

export default function OnboardingScreen() {
  const styles = useThemedStyles(makeStyles);
  const textStyles = useTextStyles();
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

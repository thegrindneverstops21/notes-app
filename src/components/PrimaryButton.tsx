import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useTheme, useThemedStyles, type Theme } from "@/theme";

type Props = { label: string; onPress: () => void; busy?: boolean };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    button: {
      backgroundColor: t.colors.ink,
      padding: 14,
      alignItems: "center",
    },
    busy: { opacity: 0.6 },
    label: { color: t.colors.card, fontFamily: t.fonts.bodyBold },
  });

export function PrimaryButton({ label, onPress, busy = false }: Props) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.button, busy && styles.busy]}
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
    >
      {busy ? (
        <ActivityIndicator color={colors.card} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

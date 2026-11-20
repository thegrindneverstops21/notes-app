import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "@/theme/colors";

type Props = { label: string; onPress: () => void; busy?: boolean };

export function PrimaryButton({ label, onPress, busy = false }: Props) {
  return (
    <Pressable
      style={[styles.button, busy && styles.busy]}
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
    >
      {busy ? (
        <ActivityIndicator color={COLORS.card} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: COLORS.ink, padding: 14, alignItems: "center" },
  busy: { opacity: 0.6 },
  label: { color: COLORS.card, fontWeight: "600" },
});

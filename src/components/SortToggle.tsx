import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "@/theme/colors";
import type { SortOrder } from "@/types";

type Props = { order: SortOrder; onToggle: () => void };

export function SortToggle({ order, onToggle }: Props) {
  const label = order === "desc" ? "Newest first" : "Oldest first";
  return (
    <Pressable
      onPress={onToggle}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={`Sort order: ${label}. Tap to change.`}
    >
      <Text style={styles.label}>{label} ↕</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: "flex-start", paddingVertical: 8, marginBottom: 8 },
  label: { color: COLORS.meta },
});

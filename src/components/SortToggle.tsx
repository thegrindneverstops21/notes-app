import { Pressable, StyleSheet, Text } from "react-native";
import { useThemedStyles, type Theme } from "@/theme";
import type { SortOrder } from "@/types";

type Props = { order: SortOrder; onToggle: () => void };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    button: { alignSelf: "flex-start", paddingVertical: 8, marginBottom: 8 },
    label: { color: t.colors.meta, fontFamily: t.fonts.bodyMedium },
  });

export function SortToggle({ order, onToggle }: Props) {
  const styles = useThemedStyles(makeStyles);
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

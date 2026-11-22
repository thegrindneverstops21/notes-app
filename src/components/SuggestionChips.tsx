import { Pressable, StyleSheet, Text, View } from "react-native";
import { useThemedStyles, type Theme } from "@/theme";

type Props = { suggestions: string[]; onPick: (name: string) => void };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
    chip: {
      borderColor: t.colors.border,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: t.colors.card,
    },
    label: { color: t.colors.ink, fontFamily: t.fonts.body },
  });

export function SuggestionChips({ suggestions, onPick }: Props) {
  const styles = useThemedStyles(makeStyles);
  if (suggestions.length === 0) return null;

  return (
    <View style={styles.row}>
      {suggestions.map((name) => (
        <Pressable
          key={name}
          style={styles.chip}
          onPress={() => onPick(name)}
          accessibilityRole="button"
          accessibilityLabel={`Use username ${name}`}
        >
          <Text style={styles.label}>{name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

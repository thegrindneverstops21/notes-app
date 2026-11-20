import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/theme/colors";

type Props = { suggestions: string[]; onPick: (name: string) => void };

export function SuggestionChips({ suggestions, onPick }: Props) {
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

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.card,
  },
  label: { color: COLORS.ink },
});

import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/theme/colors";
import type { Category } from "@/types";

type Props = {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function CategoryPicker({ categories, selectedId, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {categories.map((category) => {
        const selected = category.id === selectedId;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(category.id)}
            style={[styles.chip, selected && styles.selected]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={selected ? styles.selectedLabel : styles.label}>
              {category.name}
            </Text>
          </Pressable>
        );
      })}
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
  selected: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  label: { color: COLORS.ink },
  selectedLabel: { color: COLORS.card },
});

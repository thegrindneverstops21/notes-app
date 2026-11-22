import { Pressable, StyleSheet, Text, View } from "react-native";
import { useThemedStyles, type Theme } from "@/theme";
import type { Category } from "@/types";

type Props = {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
};

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
    selected: { backgroundColor: t.colors.ink, borderColor: t.colors.ink },
    label: { color: t.colors.ink, fontFamily: t.fonts.body },
    selectedLabel: { color: t.colors.card, fontFamily: t.fonts.bodyMedium },
  });

export function CategoryPicker({ categories, selectedId, onSelect }: Props) {
  const styles = useThemedStyles(makeStyles);

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

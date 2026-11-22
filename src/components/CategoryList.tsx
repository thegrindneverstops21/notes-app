import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "@/theme/colors";
import type { Category, Note } from "@/types";

type Props = { categories: Category[]; notes: Note[] };

export function CategoryList({ categories, notes }: Props) {
  const router = useRouter();

  return (
    <View style={styles.list}>
      {categories.map((category) => {
        const count = notes.filter(
          (note) => note.categoryId === category.id,
        ).length;
        return (
          <Pressable
            key={category.id}
            style={styles.row}
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: "/category/[id]",
                params: { id: category.id },
              })
            }
          >
            <Text style={styles.name}>{category.name}</Text>
            <Text style={styles.count}>{count}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { marginVertical: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  name: { color: COLORS.ink, fontWeight: "600" },
  count: { color: COLORS.meta },
});

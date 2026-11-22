import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useThemedStyles, type Theme } from "@/theme";
import type { Category, Note } from "@/types";

type Props = { categories: Category[]; notes: Note[] };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    list: { marginVertical: 16 },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: t.colors.card,
      borderColor: t.colors.border,
      borderWidth: 1,
      padding: 14,
      marginBottom: 8,
      ...t.shadows.rest,
    },
    name: { color: t.colors.ink, fontFamily: t.fonts.bodyBold },
    count: { color: t.colors.meta, fontFamily: t.fonts.body },
  });

export function CategoryList({ categories, notes }: Props) {
  const router = useRouter();
  const styles = useThemedStyles(makeStyles);

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

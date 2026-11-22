import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { formatDate } from "@/lib/format";
import { COLORS } from "@/theme/colors";
import type { Note } from "@/types";

type Props = { note: Note; categoryName?: string };

function metaLine(note: Note, categoryName?: string): string {
  const parts = [
    categoryName,
    `Added ${formatDate(note.createdAt)}`,
    note.updatedAt ? `Edited ${formatDate(note.updatedAt)}` : null,
  ];
  return parts.filter(Boolean).join(" · ");
}

export function NoteCard({ note, categoryName }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      accessibilityRole="button"
      onPress={() =>
        router.push({ pathname: "/note/[id]", params: { id: note.id } })
      }
    >
      {note.title ? <Text style={styles.title}>{note.title}</Text> : null}
      <Text style={styles.body} numberOfLines={3}>
        {note.body}
      </Text>
      <Text style={styles.meta}>{metaLine(note, categoryName)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  title: {
    color: COLORS.ink,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  body: { color: COLORS.ink, marginBottom: 8 },
  meta: { color: COLORS.meta, fontSize: 12 },
});

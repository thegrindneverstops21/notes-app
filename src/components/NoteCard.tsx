import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { formatDate } from "@/lib/format";
import { useThemedStyles, type Theme } from "@/theme";
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

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.colors.card,
      borderColor: t.colors.border,
      borderWidth: 1,
      padding: 14,
      marginBottom: 12,
      ...t.shadows.rest,
    },
    title: {
      color: t.colors.ink,
      fontFamily: t.fonts.title,
      fontSize: 18,
      marginBottom: 4,
    },
    body: {
      color: t.colors.ink,
      fontFamily: t.fonts.body,
      marginBottom: 8,
    },
    meta: {
      color: t.colors.meta,
      fontFamily: t.fonts.body,
      fontSize: 12,
    },
  });

export function NoteCard({ note, categoryName }: Props) {
  const router = useRouter();
  const styles = useThemedStyles(makeStyles);

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
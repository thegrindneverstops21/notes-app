import { useState } from "react";
import { View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { NoteCard } from "@/components/NoteCard";
import { SortToggle } from "@/components/SortToggle";
import { DEFAULT_SORT } from "@/constants";
import { searchNotes, sortNotes } from "@/lib/search";
import type { Category, Note, SortOrder } from "@/types";

type Props = {
  notes: Note[];
  categories: Category[];
  emptyTitle: string;
  emptyMessage: string;
};

export function NotesView({
  notes,
  categories,
  emptyTitle,
  emptyMessage,
}: Props) {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<SortOrder>(DEFAULT_SORT);

  if (notes.length === 0)
    return <EmptyState title={emptyTitle} message={emptyMessage} />;

  const visible = sortNotes(searchNotes(notes, query), order);
  const nameOf = (id: string) =>
    categories.find((category) => category.id === id)?.name;

  return (
    <View>
      <FormField
        label="Search notes"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />
      <SortToggle
        order={order}
        onToggle={() => setOrder(order === "desc" ? "asc" : "desc")}
      />
      {visible.length === 0 ? (
        <EmptyState
          title="No matches"
          message={`Nothing matches "${query.trim()}".`}
        />
      ) : null}
      {visible.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          categoryName={nameOf(note.categoryId)}
        />
      ))}
    </View>
  );
}

import { useLocalSearchParams, useRouter } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { NoteEditor, type EditorValues } from "@/components/NoteEditor";
import { NotesGate } from "@/components/NotesGate";
import { Screen } from "@/components/Screen";
import { FEEDBACK } from "@/constants/messages";
import { useNotes } from "@/context/NotesContext";
import { useToast } from "@/context/ToastContext";

function NewNoteContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const { categories, addNote } = useNotes();

  if (categories.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="No categories"
          message="Add a category from the library first, then come back."
        />
      </Screen>
    );
  }

  const startCategory =
    categories.find((category) => category.id === categoryId)?.id ??
    categories[0]?.id ??
    "";

  async function handleSave(values: EditorValues) {
    await addNote(values);
    showToast(FEEDBACK.NOTE_SAVED);
    router.back();
  }

  return (
    <NoteEditor
      initial={{ categoryId: startCategory, title: "", body: "" }}
      categories={categories}
      onSave={handleSave}
      onClose={() => router.back()}
    />
  );
}

export default function NewNoteScreen() {
  return (
    <NotesGate>
      <NewNoteContent />
    </NotesGate>
  );
}

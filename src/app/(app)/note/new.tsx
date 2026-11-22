import { Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { NoteForm, type NoteFormValues } from "@/components/NoteForm";
import { NotesGate } from "@/components/NotesGate";
import { Screen } from "@/components/Screen";
import { FEEDBACK } from "@/constants/messages";
import { useNotes } from "@/context/NotesContext";
import { useToast } from "@/context/ToastContext";
import { useTextStyles } from "@/theme/useTextStyles";

function NewNoteContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const { categories, addNote } = useNotes();
  const textStyles = useTextStyles();
  if (categories.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="No categories"
          message="Add a category on the home screen first, then come back."
        />
      </Screen>
    );
  }

  const startCategory =
    categories.find((category) => category.id === categoryId)?.id ??
    categories[0]?.id ??
    "";

  async function handleCreate(values: NoteFormValues) {
    await addNote(values);
    showToast(FEEDBACK.NOTE_SAVED);
    router.back();
  }

  return (
    <Screen>
      <Text style={textStyles.title}>New note</Text>
      <NoteForm
        initial={{ categoryId: startCategory, title: "", body: "" }}
        categories={categories}
        submitLabel="Save note"
        onSubmit={handleCreate}
      />
    </Screen>
  );
}

export default function NewNoteScreen() {
  return (
    <NotesGate>
      <NewNoteContent />
    </NotesGate>
  );
}

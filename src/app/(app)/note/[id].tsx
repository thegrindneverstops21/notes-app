import { useLocalSearchParams, useRouter } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { NoteForm, type NoteFormValues } from "@/components/NoteForm";
import { NotesGate } from "@/components/NotesGate";
import { Screen } from "@/components/Screen";
import { FEEDBACK } from "@/constants/messages";
import { useNotes } from "@/context/NotesContext";
import { useToast } from "@/context/ToastContext";
import { confirmDestructive } from "@/lib/confirm";
import { DATA_MESSAGES, DataError } from "@/services/dataError";
import type { Note, NoteChanges } from "@/types";

function diffNote(note: Note, values: NoteFormValues): NoteChanges {
  const changes: NoteChanges = {};
  if (values.categoryId !== note.categoryId)
    changes.categoryId = values.categoryId;
  if (values.title.trim() !== (note.title ?? "")) changes.title = values.title;
  if (values.body.trim() !== note.body) changes.body = values.body;
  return changes;
}

function EditNoteContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, categories, editNote, removeNote } = useNotes();
  const note = notes.find((candidate) => candidate.id === id);

  if (!note) {
    return (
      <Screen>
        <EmptyState
          title="Note not found"
          message={DATA_MESSAGES.NOTE_NOT_FOUND}
        />
      </Screen>
    );
  }

  const handleSave = async (values: NoteFormValues) => {
    const changes = diffNote(note, values);
    if (Object.keys(changes).length === 0) {
      throw new DataError("VALIDATION", DATA_MESSAGES.NOTHING_CHANGED);
    }
    await editNote(note.id, changes);
    showToast(FEEDBACK.NOTE_UPDATED);
    router.back();
  };

  const handleDelete = () =>
    confirmDestructive(
      "Delete this note?",
      "This cannot be undone.",
      async () => {
        await removeNote(note.id);
        showToast(FEEDBACK.NOTE_DELETED);
        router.back();
      },
    );

  return (
    <Screen>
      <NoteForm
        initial={{
          categoryId: note.categoryId,
          title: note.title ?? "",
          body: note.body,
        }}
        categories={categories}
        submitLabel="Save changes"
        onSubmit={handleSave}
        onDelete={handleDelete}
      />
    </Screen>
  );
}

export default function EditNoteScreen() {
  return (
    <NotesGate>
      <EditNoteContent />
    </NotesGate>
  );
}

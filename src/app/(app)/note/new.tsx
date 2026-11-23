import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { NoteEditor, type EditorValues } from "@/components/NoteEditor";
import { NotesGate } from "@/components/NotesGate";
import { Screen } from "@/components/Screen";
import { FEEDBACK } from "@/constants/messages";
import { useNotes } from "@/context/NotesContext";
import { useToast } from "@/context/ToastContext";
import { useZoomPage } from "@/hooks/useZoomPage";

function NewNoteContent() {
  const router = useRouter();
  const zoom = useZoomPage();
  const { showToast } = useToast();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const { categories, addNote } = useNotes();
  const goBack = () => zoom.close(() => router.back());

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
    goBack();
  }

  return (
    <Animated.View style={[styles.fill, zoom.style]}>
      <NoteEditor
        initial={{ categoryId: startCategory, title: "", body: "" }}
        categories={categories}
        onSave={handleSave}
        onClose={goBack}
      />
    </Animated.View>
  );
}

export default function NewNoteScreen() {
  return (
    <NotesGate>
      <NewNoteContent />
    </NotesGate>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });

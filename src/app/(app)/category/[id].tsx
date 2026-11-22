import { Pressable, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { NotesGate } from "@/components/NotesGate";
import { NotesView } from "@/components/NotesView";
import { PrimaryButton } from "@/components/PrimaryButton";
import { RenameCategory } from "@/components/RenameCategory";
import { Screen } from "@/components/Screen";
import { FEEDBACK } from "@/constants/messages";
import { useNotes } from "@/context/NotesContext";
import { useToast } from "@/context/ToastContext";
import { confirmDestructive } from "@/lib/confirm";
import { DATA_MESSAGES } from "@/services/dataError";
import { useTextStyles } from "@/theme/useTextStyles";

function deleteMessage(count: number): string {
  if (count === 0) return "This category is empty. This cannot be undone.";
  const noun = count === 1 ? "note" : "notes";
  return `This also deletes its ${count} ${noun}. This cannot be undone.`;
}

function CategoryContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { categories, notes, renameCategory, removeCategory } = useNotes();
  const category = categories.find((candidate) => candidate.id === id);
  const textStyles = useTextStyles();
  if (!category) {
    return (
      <Screen>
        <EmptyState
          title="Category not found"
          message={DATA_MESSAGES.CATEGORY_NOT_FOUND}
        />
      </Screen>
    );
  }

  const inCategory = notes.filter((note) => note.categoryId === category.id);

  const handleRename = async (name: string) => {
    await renameCategory(category.id, name);
    showToast(FEEDBACK.CATEGORY_RENAMED);
  };

  const handleDelete = () =>
    confirmDestructive(
      `Delete "${category.name}"?`,
      deleteMessage(inCategory.length),
      async () => {
        await removeCategory(category.id);
        showToast(FEEDBACK.CATEGORY_DELETED);
        router.back();
      },
    );

  return (
    <Screen>
      <Text style={textStyles.title}>{category.name}</Text>
      <RenameCategory category={category} onRename={handleRename} />
      <PrimaryButton
        label="New note in this category"
        onPress={() =>
          router.push({
            pathname: "/note/new",
            params: { categoryId: category.id },
          })
        }
      />
      <NotesView
        notes={inCategory}
        categories={categories}
        emptyTitle="No notes here yet"
        emptyMessage="Tap New note in this category to add one."
      />
      <Pressable onPress={handleDelete} accessibilityRole="button">
        <Text style={textStyles.link}>Delete category</Text>
      </Pressable>
    </Screen>
  );
}

export default function CategoryScreen() {
  return (
    <NotesGate>
      <CategoryContent />
    </NotesGate>
  );
}

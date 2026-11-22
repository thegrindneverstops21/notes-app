import { Text } from "react-native";
import { Link, useRouter } from "expo-router";
import { CategoryCreator } from "@/components/CategoryCreator";
import { CategoryList } from "@/components/CategoryList";
import { EmptyState } from "@/components/EmptyState";
import { NotesGate } from "@/components/NotesGate";
import { NotesView } from "@/components/NotesView";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { useNotes } from "@/context/NotesContext";
import { textStyles } from "@/theme/textStyles";

function HomeContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { categories, notes } = useNotes();

  return (
    <Screen>
      <Text style={textStyles.title}>Hello, {user?.username}</Text>
      <CategoryCreator />
      {categories.length === 0 ? (
        <EmptyState
          title="No categories"
          message="Add a category above to start taking notes."
        />
      ) : (
        <>
          <CategoryList categories={categories} notes={notes} />
          <PrimaryButton
            label="New note"
            onPress={() => router.push("/note/new")}
          />
        </>
      )}
      <NotesView
        notes={notes}
        categories={categories}
        emptyTitle="No notes yet"
        emptyMessage="Your notes will show up here."
      />
      <Link href="/profile" style={textStyles.link}>
        Edit profile
      </Link>
      <PrimaryButton label="Sign out" onPress={signOut} />
    </Screen>
  );
}

export default function HomeScreen() {
  return (
    <NotesGate>
      <HomeContent />
    </NotesGate>
  );
}

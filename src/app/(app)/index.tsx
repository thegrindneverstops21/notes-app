import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";
import { CanvasCard } from "@/components/CanvasCard";
import { CornerMenu } from "@/components/CornerMenu";
import { EmptyState } from "@/components/EmptyState";
import { LibrarySheet } from "@/components/LibrarySheet";
import { NotesGate } from "@/components/NotesGate";
import { ThumbPill } from "@/components/ThumbPill";
import { PROBLEMS } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
import { useNotes } from "@/context/NotesContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useToast } from "@/context/ToastContext";
import { useCanvasCamera } from "@/hooks/useCanvasCamera";
import { useThemedStyles, type Theme } from "@/theme";
import { cardOrigin, newCardOrigin } from "@/lib/canvas";

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: t.colors.desk },
    world: StyleSheet.absoluteFill,
    empty: {
      ...StyleSheet.absoluteFill,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      pointerEvents: "none",
    },
  });

function HomeContent() {
  const router = useRouter();
  const styles = useThemedStyles(makeStyles);
  const { width, height } = useWindowDimensions();
  const { signOut } = useAuth();
  const { notes, categories, moveNote } = useNotes();
  const { restart } = useOnboarding();
  const { showToast } = useToast();
  const camera = useCanvasCamera();
  const [libraryOpen, setLibraryOpen] = useState(false);

  const nameOf = (id: string) =>
    categories.find((category) => category.id === id)?.name;

  const handleMove = (id: string, x: number, y: number) => {
    moveNote(id, { x, y }).catch(() => showToast(PROBLEMS.STORAGE, "error"));
  };

  // The page zooms out of the tapped card, so it needs to know where that card is on screen.
  const handleOpen = (id: string) => {
    const note = notes.find((candidate) => candidate.id === id);
    const position = {
      x: camera.x.get(),
      y: camera.y.get(),
      scale: camera.scale.get(),
    };
    const origin = note ? cardOrigin(note, position, { width, height }) : {};
    router.push({ pathname: "/note/[id]", params: { id, ...origin } });
  };

  const handleNewCard = () =>
    router.push({
      pathname: "/note/new",
      params: newCardOrigin({ width, height }),
    });

  const handleReplay = () => {
    restart().catch(() => showToast(PROBLEMS.STORAGE, "error"));
  };

  return (
    <View style={styles.root}>
      <GestureDetector gesture={camera.gesture}>
        <View style={{ width, height }}>
          <Animated.View style={[styles.world, camera.style]}>
            {notes.map((note) => (
              <CanvasCard
                key={note.id}
                note={note}
                categoryName={nameOf(note.categoryId)}
                scale={camera.scale}
                onMove={handleMove}
                onOpen={handleOpen}
              />
            ))}
          </Animated.View>
        </View>
      </GestureDetector>

      {notes.length === 0 ? (
        <View style={styles.empty}>
          <EmptyState
            title="Your desk is empty"
            message="Tap NEW CARD to add your first note."
          />
        </View>
      ) : null}

      <CornerMenu
        onProfile={() => router.push("/profile")}
        onReplay={handleReplay}
        onSignOut={signOut}
      />
      <ThumbPill
        onSearch={() => setLibraryOpen(true)}
        onNewCard={handleNewCard}
        onRecenter={camera.recenter}
        onSwipeUp={() => setLibraryOpen(true)}
      />
      {libraryOpen ? (
        <LibrarySheet onClose={() => setLibraryOpen(false)} />
      ) : null}
    </View>
  );
}

export default function HomeScreen() {
  return (
    <NotesGate>
      <HomeContent />
    </NotesGate>
  );
}

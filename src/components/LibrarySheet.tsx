import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryCreator } from "@/components/CategoryCreator";
import { CategoryList } from "@/components/CategoryList";
import { NotesView } from "@/components/NotesView";
import { useNotes } from "@/context/NotesContext";
import { useThemedStyles, type Theme } from "@/theme";

type Props = { onClose: () => void };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    sheet: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: t.colors.desk,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderColor: t.colors.border,
      borderWidth: 1,
      ...t.shadows.lifted,
    },
    handle: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: 2,
      marginTop: 10,
      backgroundColor: t.colors.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    title: { color: t.colors.ink, fontFamily: t.fonts.title, fontSize: 24 },
    close: { color: t.colors.meta, fontFamily: t.fonts.bodyMedium },
    content: { paddingHorizontal: 24, paddingBottom: 48 },
  });

export function LibrarySheet({ onClose }: Props) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const { categories, notes } = useNotes();

  return (
    <Animated.View
      entering={SlideInDown.duration(220)}
      exiting={SlideOutDown.duration(180)}
      style={[styles.sheet, { top: insets.top + 48 }]}
    >
      <View style={styles.handle} />
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close library"
        >
          <Text style={styles.close}>Close</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <CategoryList categories={categories} notes={notes} />
        <CategoryCreator />
        <NotesView
          notes={notes}
          categories={categories}
          emptyTitle="No notes yet"
          emptyMessage="Tap NEW CARD to add your first one."
        />
      </ScrollView>
    </Animated.View>
  );
}

import type { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useThemedStyles, type Theme } from "@/theme";

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    scroll: { backgroundColor: t.colors.desk },
    content: { padding: 24, paddingTop: 64 },
  });

export function Screen({ children }: { children: ReactNode }) {
  const styles = useThemedStyles(makeStyles);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
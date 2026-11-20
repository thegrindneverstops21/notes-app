import type { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { COLORS } from "@/theme/colors";

export function Screen({ children }: { children: ReactNode }) {
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

const styles = StyleSheet.create({
  scroll: { backgroundColor: COLORS.desk },
  content: { padding: 24, paddingTop: 64 },
});

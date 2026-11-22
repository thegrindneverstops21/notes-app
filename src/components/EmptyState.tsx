import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/theme/colors";

type Props = { title: string; message: string };

export function EmptyState({ title, message }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { paddingVertical: 32, alignItems: "center" },
  title: {
    color: COLORS.ink,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  message: { color: COLORS.meta, textAlign: "center" },
});

import { StyleSheet, Text, View } from "react-native";
import { useThemedStyles, type Theme } from "@/theme";

type Props = { title: string; message: string };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    box: { paddingVertical: 32, alignItems: "center" },
    title: {
      color: t.colors.ink,
      fontFamily: t.fonts.title,
      fontSize: 20,
      marginBottom: 6,
    },
    message: {
      color: t.colors.meta,
      fontFamily: t.fonts.body,
      textAlign: "center",
    },
  });

export function EmptyState({ title, message }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

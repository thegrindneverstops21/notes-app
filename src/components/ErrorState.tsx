import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useThemedStyles, type Theme } from "@/theme";

type Props = { message: string; onRetry: () => unknown };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    box: { paddingVertical: 32 },
    title: {
      color: t.colors.ink,
      fontFamily: t.fonts.title,
      fontSize: 20,
      marginBottom: 6,
    },
    message: {
      color: t.colors.meta,
      fontFamily: t.fonts.body,
      marginBottom: 16,
    },
  });

export function ErrorState({ message, onRetry }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.box} accessibilityRole="alert">
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton
        label="Try again"
        onPress={() => {
          onRetry();
        }}
      />
    </View>
  );
}

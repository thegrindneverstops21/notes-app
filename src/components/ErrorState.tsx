import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { COLORS } from "@/theme/colors";

type Props = { message: string; onRetry: () => unknown };

export function ErrorState({ message, onRetry }: Props) {
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

const styles = StyleSheet.create({
  box: { paddingVertical: 32 },
  title: {
    color: COLORS.ink,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  message: { color: COLORS.meta, marginBottom: 16 },
});

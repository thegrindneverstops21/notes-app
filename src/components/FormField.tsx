import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { COLORS } from "@/theme/colors";

type Props = TextInputProps & { label: string; hint?: string };

export function FormField({ label, hint, multiline, ...inputProps }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={COLORS.meta}
        accessibilityLabel={label}
        multiline={multiline}
        {...inputProps}
        style={[styles.input, multiline && styles.multiline]}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { color: COLORS.meta, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: 12,
    color: COLORS.ink,
  },
  multiline: { minHeight: 140, textAlignVertical: "top" },
  hint: { color: COLORS.meta, fontSize: 12, marginTop: 4 },
});

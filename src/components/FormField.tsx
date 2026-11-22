import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { useTheme, useThemedStyles, type Theme } from "@/theme";

type Props = TextInputProps & { label: string; hint?: string };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    wrapper: { marginBottom: 16 },
    label: {
      color: t.colors.meta,
      fontFamily: t.fonts.body,
      marginBottom: 6,
    },
    input: {
      backgroundColor: t.colors.card,
      borderColor: t.colors.border,
      borderWidth: 1,
      padding: 12,
      color: t.colors.ink,
      fontFamily: t.fonts.body,
    },
    multiline: { minHeight: 140, textAlignVertical: "top" },
    hint: {
      color: t.colors.meta,
      fontFamily: t.fonts.body,
      fontSize: 12,
      marginTop: 4,
    },
  });

export function FormField({ label, hint, multiline, ...inputProps }: Props) {
  const styles = useThemedStyles(makeStyles);
  const { colors, scheme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={colors.meta}
        keyboardAppearance={scheme}
        accessibilityLabel={label}
        multiline={multiline}
        {...inputProps}
        style={[styles.input, multiline && styles.multiline]}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}
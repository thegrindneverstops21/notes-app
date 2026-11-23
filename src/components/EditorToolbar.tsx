import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  KeyboardStickyView,
  useKeyboardState,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BlockKind } from "@/lib/blocks";
import { useThemedStyles, type Theme } from "@/theme";

type Props = {
  activeKind: BlockKind | null;
  busy: boolean;
  onCheckbox: () => void;
  onHeading: () => void;
  onBullet: () => void;
  onDone: () => void;
};

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
    },
    bar: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      paddingHorizontal: 8,
      borderRadius: 999,
      backgroundColor: t.colors.pill,
      borderColor: t.colors.border,
      borderWidth: 1,
      ...t.shadows.lifted,
    },
    button: { paddingHorizontal: 14, paddingVertical: 14 },
    label: {
      color: t.colors.meta,
      fontFamily: t.fonts.bodyBold,
      fontSize: 12,
      letterSpacing: 1,
    },
    active: { color: t.colors.ink },
    divider: { width: 1, height: 18, backgroundColor: t.colors.border },
  });

type ButtonProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
  disabled?: boolean;
};

function ToolButton({
  label,
  active = false,
  onPress,
  disabled = false,
}: ButtonProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.label, active && styles.active]}>{label}</Text>
    </Pressable>
  );
}

export function EditorToolbar({
  activeKind,
  busy,
  onCheckbox,
  onHeading,
  onBullet,
  onDone,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardState((state) => state.isVisible);

  return (
    <KeyboardStickyView
      style={styles.wrap}
      offset={{ closed: -insets.bottom, opened: 0 }}
    >
      {keyboardVisible ? (
        <View style={styles.bar}>
          <ToolButton
            label="CHECKBOX"
            active={activeKind === "check"}
            onPress={onCheckbox}
          />
          <View style={styles.divider} />
          <ToolButton
            label="HEADING"
            active={activeKind === "heading"}
            onPress={onHeading}
          />
          <View style={styles.divider} />
          <ToolButton
            label="BULLET"
            active={activeKind === "bullet"}
            onPress={onBullet}
          />
          <View style={styles.divider} />
          <ToolButton
            label={busy ? "SAVING" : "DONE"}
            onPress={onDone}
            disabled={busy}
          />
        </View>
      ) : null}
    </KeyboardStickyView>
  );
}

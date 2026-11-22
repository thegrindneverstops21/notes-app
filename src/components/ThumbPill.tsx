import { Pressable, StyleSheet, Text, View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CANVAS } from "@/constants";
import { useThemedStyles, type Theme } from "@/theme";

type Props = {
  onSearch: () => void;
  onNewCard: () => void;
  onRecenter: () => void;
  onSwipeUp: () => void;
};

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: {
      position: "absolute",
      left: 0,
      right: 0,
      alignItems: "center",
      pointerEvents: "box-none",
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: t.colors.pill,
      borderColor: t.colors.border,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      ...t.shadows.lifted,
    },
    button: { paddingHorizontal: 16, paddingVertical: 16 },
    label: {
      color: t.colors.ink,
      fontFamily: t.fonts.bodyBold,
      fontSize: 12,
      letterSpacing: 1,
    },
    divider: { width: 1, height: 18, backgroundColor: t.colors.border },
  });

type ButtonProps = { label: string; onPress: () => void };

function PillButton({ label, onPress }: ButtonProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export function ThumbPill({ onSearch, onNewCard, onRecenter, onSwipeUp }: Props) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();

  // Swiping up on the pill opens the library, same as tapping SEARCH.
  const swipe = usePanGesture({
    runOnJS: true,
    minDistance: 12,
    onDeactivate: (e) => {
      const farEnough = e.translationY < -CANVAS.SWIPE_UP_DISTANCE;
      const fastEnough = e.velocityY < -CANVAS.SWIPE_UP_VELOCITY;
      if (farEnough || fastEnough) onSwipeUp();
    },
  });

  return (
    <View style={[styles.wrap, { bottom: insets.bottom + 16 }]}>
      <GestureDetector gesture={swipe}>
        <View style={styles.pill}>
          <PillButton label="SEARCH" onPress={onSearch} />
          <View style={styles.divider} />
          <PillButton label="NEW CARD" onPress={onNewCard} />
          <View style={styles.divider} />
          <PillButton label="RECENTER" onPress={onRecenter} />
        </View>
      </GestureDetector>
    </View>
  );
}
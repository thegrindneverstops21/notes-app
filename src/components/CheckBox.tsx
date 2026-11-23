import { Pressable, StyleSheet, Text } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useThemedStyles, type Theme } from "@/theme";

type Props = { checked: boolean; onToggle: () => void };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    box: {
      width: 22,
      height: 22,
      borderWidth: 1.5,
      borderColor: t.colors.ink,
      alignItems: "center",
      justifyContent: "center",
    },
    boxChecked: { backgroundColor: t.colors.ink },
    tick: { color: t.colors.card, fontSize: 14, fontWeight: "700" },
  });

export function CheckBox({ checked, onToggle }: Props) {
  const styles = useThemedStyles(makeStyles);
  const press = useSharedValue<number>(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: press.get() }],
  }));

  const handlePress = () => {
    press.set(withSequence(withTiming(0.82, { duration: 70 }), withSpring(1)));
    Haptics.selectionAsync().catch(() => undefined);
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <Animated.View
        style={[styles.box, checked && styles.boxChecked, animated]}
      >
        {checked ? <Text style={styles.tick}>✓</Text> : null}
      </Animated.View>
    </Pressable>
  );
}

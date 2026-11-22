import { useEffect, useState } from "react";
import { Animated, StyleSheet, type DimensionValue } from "react-native";
import { COLORS } from "@/theme/colors";

const MIN_OPACITY = 0.4;
const PULSE_MS = 700;

type Props = { height: number; width?: DimensionValue };

export function Skeleton({ height, width = "100%" }: Props) {
  const [opacity] = useState(() => new Animated.Value(MIN_OPACITY));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: PULSE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: MIN_OPACITY,
          duration: PULSE_MS,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.block, { height, width, opacity }]} />;
}

const styles = StyleSheet.create({
  block: { backgroundColor: COLORS.border, marginBottom: 12 },
});

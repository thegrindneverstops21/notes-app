import { useEffect, useState } from "react";
import { Animated, StyleSheet, type DimensionValue } from "react-native";
import { useThemedStyles, type Theme } from "@/theme";

const MIN_OPACITY = 0.4;
const PULSE_MS = 700;

type Props = { height: number; width?: DimensionValue };

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    block: { backgroundColor: t.colors.border, marginBottom: 12 },
  });

export function Skeleton({ height, width = "100%" }: Props) {
  const styles = useThemedStyles(makeStyles);
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

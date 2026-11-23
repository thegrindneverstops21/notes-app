import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { ZOOM } from "@/constants";
import { parseOrigin } from "@/lib/canvas";

// The editor page grows out of the card that was tapped, and shrinks back into it on close.
export function useZoomPage() {
  const params = useLocalSearchParams<{
    ox?: string;
    oy?: string;
    ow?: string;
  }>();
  const { width, height } = useWindowDimensions();
  const start = parseOrigin(params, { width, height });
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    progress.set(
      withTiming(1, { duration: ZOOM.IN_MS, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: interpolate(p, [0, 0.25, 1], [0, 1, 1]),
      transform: [
        { translateX: (1 - p) * start.dx },
        { translateY: (1 - p) * start.dy },
        { scale: interpolate(p, [0, 1], [start.scale, 1]) },
      ],
    };
  });

  // Plays the shrink, then runs `done` (usually going back).
  const close = (done: () => void) => {
    progress.set(
      withTiming(
        0,
        { duration: ZOOM.OUT_MS, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) scheduleOnRN(done);
        },
      ),
    );
  };

  return { style, close };
}

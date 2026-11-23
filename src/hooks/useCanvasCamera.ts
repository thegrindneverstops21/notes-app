import {
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
} from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { CANVAS } from "../constants";

const { HOME_X, HOME_Y, MIN_SCALE, MAX_SCALE } = CANVAS;

// The canvas is one big layer that we pan and zoom. Cards live inside it.
export function useCanvasCamera() {
  const x = useSharedValue<number>(HOME_X);
  const y = useSharedValue<number>(HOME_Y);
  const scale = useSharedValue<number>(1);
  const startX = useSharedValue<number>(HOME_X);
  const startY = useSharedValue<number>(HOME_Y);
  const startScale = useSharedValue<number>(1);

  // Start values are read on activation, so a recenter animation never leaves them stale.
  const pan = usePanGesture({
    averageTouches: true,
    onActivate: () => {
      startX.set(x.get());
      startY.set(y.get());
    },
    onUpdate: (e) => {
      x.set(startX.get() + e.translationX);
      y.set(startY.get() + e.translationY);
    },
  });

  const pinch = usePinchGesture({
    onActivate: () => {
      startScale.set(scale.get());
    },
    onUpdate: (e) => {
      const next = startScale.get() * e.scale;
      scale.set(Math.min(MAX_SCALE, Math.max(MIN_SCALE, next)));
    },
  });

  const gesture = useSimultaneousGestures(pan, pinch);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() },
      { translateY: y.get() },
      { scale: scale.get() },
    ],
  }));

  const recenter = () => {
    x.set(withSpring(HOME_X));
    y.set(withSpring(HOME_Y));
    scale.set(withSpring(1));
  };

  return { gesture, style, scale, x, y, recenter };
}

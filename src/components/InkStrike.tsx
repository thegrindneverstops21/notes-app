import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useThemedStyles, type Theme } from "@/theme";

export type StrikeLine = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const DRAW_MS = 260;
const STAGGER_MS = 90;
const LINE_HEIGHT = 1.5;
const LINE_POSITION = 0.55;

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    line: {
      position: "absolute",
      height: LINE_HEIGHT,
      backgroundColor: t.colors.ink,
    },
  });

type LineProps = { line: StrikeLine; index: number; animate: boolean };

function Stroke({ line, index, animate }: LineProps) {
  const styles = useThemedStyles(makeStyles);
  const width = useSharedValue<number>(animate ? 0 : line.width);

  useEffect(() => {
    width.set(
      animate
        ? withDelay(
            index * STAGGER_MS,
            withTiming(line.width, { duration: DRAW_MS }),
          )
        : line.width,
    );
  }, [animate, index, line.width, width]);

  const animated = useAnimatedStyle(() => ({ width: width.get() }));

  return (
    <Animated.View
      style={[
        styles.line,
        { left: line.x, top: line.y + line.height * LINE_POSITION },
        animated,
      ]}
    />
  );
}

type Props = { lines: StrikeLine[]; animate: boolean };

// One ink line per wrapped text line, drawn left to right.
export function InkStrike({ lines, animate }: Props) {
  return (
    <>
      {lines.map((line, index) => (
        <Stroke key={index} line={line} index={index} animate={animate} />
      ))}
    </>
  );
}

import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { CANVAS } from "@/constants";
import { formatDate } from "@/lib/format";
import { useTheme, useThemedStyles, type Theme } from "@/theme";
import type { Note } from "@/types";

type Props = {
  note: Note;
  categoryName?: string;
  scale: SharedValue<number>;
  onMove: (id: string, x: number, y: number) => void;
  onOpen: (id: string) => void;
};

const LIFT_SCALE = 0.03;

function metaLine(note: Note, categoryName?: string): string {
  const parts = [
    categoryName,
    `Added ${formatDate(note.createdAt)}`,
    note.updatedAt ? `Edited ${formatDate(note.updatedAt)}` : null,
  ];
  return parts.filter(Boolean).join(" · ");
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      position: "absolute",
      left: 0,
      top: 0,
      width: CANVAS.CARD_WIDTH,
      backgroundColor: t.colors.card,
      borderColor: t.colors.border,
      borderWidth: 1,
      ...t.shadows.rest,
    },
    inner: { padding: 12 },
    title: {
      color: t.colors.ink,
      fontFamily: t.fonts.title,
      fontSize: 17,
      marginBottom: 4,
    },
    body: {
      color: t.colors.ink,
      fontFamily: t.fonts.body,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 8,
    },
    meta: {
      color: t.colors.meta,
      fontFamily: t.fonts.body,
      fontSize: 11,
    },
  });

export function CanvasCard({
  note,
  categoryName,
  scale,
  onMove,
  onOpen,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const { shadows } = useTheme();

  // Shadow numbers pulled out as plain values so the animated style can use them.
  const restOpacity = shadows.rest.shadowOpacity ?? 0;
  const restRadius = shadows.rest.shadowRadius ?? 0;
  const restOffset = shadows.rest.shadowOffset?.height ?? 0;
  const restElevation = shadows.rest.elevation ?? 0;
  const liftOpacity = shadows.lifted.shadowOpacity ?? 0;
  const liftRadius = shadows.lifted.shadowRadius ?? 0;
  const liftOffset = shadows.lifted.shadowOffset?.height ?? 0;
  const liftElevation = shadows.lifted.elevation ?? 0;

  const px = useSharedValue<number>(note.x);
  const py = useSharedValue<number>(note.y);
  const startX = useSharedValue<number>(note.x);
  const startY = useSharedValue<number>(note.y);
  const lift = useSharedValue<number>(0);

  // Keeps the card in sync when storage changes its position (for example a re-read).
  useEffect(() => {
    px.set(note.x);
    py.set(note.y);
  }, [note.x, note.y, px, py]);

  // Long press picks the card up, then it follows the finger. Dividing by the zoom keeps it under the finger.
  const drag = usePanGesture({
    activateAfterLongPress: CANVAS.LONG_PRESS_MS,
    onActivate: () => {
      startX.set(px.get());
      startY.set(py.get());
      lift.set(withTiming(1, { duration: 120 }));
    },
    onUpdate: (e) => {
      const zoom = scale.get();
      px.set(startX.get() + e.translationX / zoom);
      py.set(startY.get() + e.translationY / zoom);
    },
    onDeactivate: () => {
      lift.set(withTiming(0, { duration: 160 }));
      scheduleOnRN(onMove, note.id, Math.round(px.get()), Math.round(py.get()));
    },
  });

  const tap = useTapGesture({
    runOnJS: true,
    onActivate: () => {
      onOpen(note.id);
    },
  });

  const gesture = useCompetingGestures(drag, tap);

  const animated = useAnimatedStyle(() => {
    const l = lift.get();
    return {
      transform: [
        { translateX: px.get() },
        { translateY: py.get() },
        { scale: 1 + LIFT_SCALE * l },
      ],
      zIndex: l > 0 ? 10 : 0,
      shadowOpacity: interpolate(l, [0, 1], [restOpacity, liftOpacity]),
      shadowRadius: interpolate(l, [0, 1], [restRadius, liftRadius]),
      shadowOffset: {
        width: 0,
        height: interpolate(l, [0, 1], [restOffset, liftOffset]),
      },
      elevation: interpolate(l, [0, 1], [restElevation, liftElevation]),
    };
  });

  return (
    <Animated.View style={[styles.card, animated]}>
      <GestureDetector gesture={gesture}>
        <View style={styles.inner}>
          {note.title ? <Text style={styles.title}>{note.title}</Text> : null}
          <Text style={styles.body} numberOfLines={4}>
            {note.body}
          </Text>
          <Text style={styles.meta}>{metaLine(note, categoryName)}</Text>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

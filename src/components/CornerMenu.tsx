import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemedStyles, type Theme } from "@/theme";

type Props = {
  onProfile: () => void;
  onReplay: () => void;
  onSignOut: () => void;
};

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    layer: { ...StyleSheet.absoluteFill, pointerEvents: "box-none" },
    scrim: StyleSheet.absoluteFill,
    button: {
      position: "absolute",
      right: 16,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.colors.pill,
      borderColor: t.colors.border,
      borderWidth: 1,
    },
    dots: { color: t.colors.ink, fontFamily: t.fonts.bodyBold },
    panel: {
      position: "absolute",
      right: 16,
      minWidth: 180,
      borderRadius: 16,
      paddingVertical: 6,
      backgroundColor: t.colors.card,
      borderColor: t.colors.border,
      borderWidth: 1,
      ...t.shadows.lifted,
    },
    item: { paddingHorizontal: 16, paddingVertical: 12 },
    itemLabel: { color: t.colors.ink, fontFamily: t.fonts.bodyMedium },
  });

export function CornerMenu({ onProfile, onReplay, onSignOut }: Props) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const items = [
    { label: "Profile", run: onProfile },
    { label: "Replay the tour", run: onReplay },
    { label: "Sign out", run: onSignOut },
  ];

  return (
    <View style={styles.layer}>
      {open ? (
        <Pressable
          style={styles.scrim}
          onPress={() => setOpen(false)}
          accessibilityLabel="Close menu"
        />
      ) : null}
      <Pressable
        style={[styles.button, { top: insets.top + 12 }]}
        onPress={() => setOpen(!open)}
        accessibilityRole="button"
        accessibilityLabel="Menu"
      >
        <Text style={styles.dots}>•••</Text>
      </Pressable>
      {open ? (
        <View style={[styles.panel, { top: insets.top + 64 }]}>
          {items.map((item) => (
            <Pressable
              key={item.label}
              style={styles.item}
              accessibilityRole="button"
              onPress={() => {
                setOpen(false);
                item.run();
              }}
            >
              <Text style={styles.itemLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

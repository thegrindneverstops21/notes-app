import { useState, type ComponentRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextLayoutEvent,
} from "react-native";
import { CheckBox } from "@/components/CheckBox";
import { InkStrike, type StrikeLine } from "@/components/InkStrike";
import type { Block } from "@/lib/blocks";
import { useThemedStyles, type Theme } from "@/theme";

export type TextInputInstance = ComponentRef<typeof TextInput>;

type Props = {
  block: Block;
  register: (id: string, input: TextInputInstance | null) => void;
  onChangeText: (id: string, text: string) => void;
  onFocus: (id: string) => void;
  onToggle: (id: string) => void;
  onBackspace: (id: string) => void;
};

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 6,
    },
    prefix: { width: 22, alignItems: "center", paddingTop: 3 },
    bullet: { color: t.colors.ink, fontSize: 18, lineHeight: 24 },
    field: { flex: 1, padding: 0 },
    text: {
      color: t.colors.ink,
      fontFamily: t.fonts.body,
      fontSize: 16,
      lineHeight: 24,
    },
    heading: {
      color: t.colors.ink,
      fontFamily: t.fonts.title,
      fontSize: 22,
      lineHeight: 30,
    },
    done: { color: t.colors.meta },
  });

export function BlockRow({
  block,
  register,
  onChangeText,
  onFocus,
  onToggle,
  onBackspace,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const [editing, setEditing] = useState(false);
  const [lines, setLines] = useState<StrikeLine[]>([]);
  // Checked at open time means no draw animation. Ticking it during this visit draws the line.
  const [startedChecked] = useState(block.checked);
  const textStyle = block.kind === "heading" ? styles.heading : styles.text;
  const showStruck = block.kind === "check" && block.checked && !editing;

  const handleLayout = (event: TextLayoutEvent) => {
    setLines(event.nativeEvent.lines);
  };

  return (
    <View style={styles.row}>
      {block.kind === "check" ? (
        <View style={styles.prefix}>
          <CheckBox
            checked={block.checked}
            onToggle={() => onToggle(block.id)}
          />
        </View>
      ) : null}
      {block.kind === "bullet" ? (
        <View style={styles.prefix}>
          <Text style={styles.bullet}>•</Text>
        </View>
      ) : null}
      {showStruck ? (
        <Pressable style={styles.field} onPress={() => setEditing(true)}>
          <Text style={[textStyle, styles.done]} onTextLayout={handleLayout}>
            {block.text}
          </Text>
          <InkStrike lines={lines} animate={!startedChecked} />
        </Pressable>
      ) : (
        <TextInput
          ref={(node) => register(block.id, node)}
          style={[styles.field, textStyle]}
          value={block.text}
          multiline
          scrollEnabled={false}
          autoFocus={editing}
          autoCapitalize="sentences"
          onChangeText={(text) => onChangeText(block.id, text)}
          onFocus={() => onFocus(block.id)}
          onBlur={() => setEditing(false)}
          onKeyPress={(event) => {
            if (event.nativeEvent.key === "Backspace") onBackspace(block.id);
          }}
        />
      )}
    </View>
  );
}

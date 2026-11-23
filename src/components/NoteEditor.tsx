import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlockRow, type TextInputInstance } from "@/components/BlockRow";
import { CategoryPicker } from "@/components/CategoryPicker";
import { EditorToolbar } from "@/components/EditorToolbar";
import {
  applyTextChange,
  backspaceEmpty,
  parseBody,
  serializeBlocks,
  setKind,
  toggleChecked,
  type Block,
  type BlockKind,
} from "@/lib/blocks";
import { confirmDiscard } from "@/lib/confirm";
import { newId } from "@/lib/id";
import { useSubmit } from "@/hooks/useSubmit";
import { useTheme, useThemedStyles, type Theme } from "@/theme";
import { useTextStyles } from "@/theme/useTextStyles";
import type { Category } from "@/types";

export type EditorValues = { categoryId: string; title: string; body: string };

type Props = {
  initial: EditorValues;
  categories: Category[];
  onSave: (values: EditorValues) => Promise<void>;
  onClose: () => void;
  onDelete?: () => void;
};

type FocusRequest = { id: string; nonce: number };

const PAGE_MAX_WIDTH = 640;
const TOOLBAR_CLEARANCE = 96;

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: t.colors.desk },
    topBar: { paddingHorizontal: 24, paddingBottom: 8 },
    close: { color: t.colors.meta, fontFamily: t.fonts.bodyMedium },
    page: {
      width: "100%",
      maxWidth: PAGE_MAX_WIDTH,
      alignSelf: "center",
      paddingHorizontal: 24,
      paddingBottom: 160,
    },
    title: {
      color: t.colors.ink,
      fontFamily: t.fonts.title,
      fontSize: 30,
      lineHeight: 38,
      marginBottom: 16,
      padding: 0,
    },
  });

export function NoteEditor({
  initial,
  categories,
  onSave,
  onClose,
  onDelete,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const textStyles = useTextStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { error, busy, submit } = useSubmit();
  const inputs = useRef<Map<string, TextInputInstance>>(new Map());
  const [title, setTitle] = useState(initial.title);
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [blocks, setBlocks] = useState<Block[]>(() =>
    parseBody(initial.body, newId),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);

  // Focus runs after the new row has mounted.
  useEffect(() => {
    if (!focusRequest) return;
    const frame = requestAnimationFrame(() =>
      inputs.current.get(focusRequest.id)?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [focusRequest]);

  const requestFocus = (id: string) =>
    setFocusRequest((current) => ({ id, nonce: (current?.nonce ?? 0) + 1 }));

  const register = (id: string, input: TextInputInstance | null) => {
    if (input) inputs.current.set(id, input);
    else inputs.current.delete(id);
  };

  const handleChangeText = (id: string, text: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    const result = applyTextChange(blocks, index, text, newId);
    setBlocks(result.blocks);
    if (result.focusId !== id) requestFocus(result.focusId);
  };

  const handleBackspace = (id: string) => {
    const result = backspaceEmpty(blocks, id);
    if (!result) return;
    setBlocks(result.blocks);
    requestFocus(result.focusId);
  };

  const applyKind = (kind: BlockKind) => {
    if (activeId) setBlocks((current) => setKind(current, activeId, kind));
  };

  const body = serializeBlocks(blocks);
  const dirty =
    title !== initial.title ||
    categoryId !== initial.categoryId ||
    body !== initial.body;
  const activeKind =
    blocks.find((block) => block.id === activeId)?.kind ?? null;

  const handleDone = () => {
    inputs.current.forEach((input) => input.blur());
    submit(() => onSave({ categoryId, title, body }));
  };

  const handleClose = () => (dirty ? confirmDiscard(onClose) : onClose());

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={handleClose}
          hitSlop={12}
          accessibilityRole="button"
        >
          <Text style={styles.close}>Close</Text>
        </Pressable>
      </View>
      <KeyboardAwareScrollView
        bottomOffset={TOOLBAR_CLEARANCE}
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
      >
        <CategoryPicker
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />
        <TextInput
          style={styles.title}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={colors.meta}
          returnKeyType="next"
          onFocus={() => setActiveId(null)}
          onSubmitEditing={() => blocks[0] && requestFocus(blocks[0].id)}
          accessibilityLabel="Title (optional)"
        />
        {blocks.map((block) => (
          <BlockRow
            key={block.id}
            block={block}
            register={register}
            onChangeText={handleChangeText}
            onFocus={setActiveId}
            onToggle={(id) =>
              setBlocks((current) => toggleChecked(current, id))
            }
            onBackspace={handleBackspace}
          />
        ))}
        {error ? <Text style={textStyles.error}>{error}</Text> : null}
        {onDelete ? (
          <Pressable onPress={onDelete} accessibilityRole="button">
            <Text style={textStyles.link}>Delete note</Text>
          </Pressable>
        ) : null}
      </KeyboardAwareScrollView>
      <EditorToolbar
        activeKind={activeKind}
        busy={busy}
        onCheckbox={() => applyKind("check")}
        onHeading={() => applyKind("heading")}
        onBullet={() => applyKind("bullet")}
        onDone={handleDone}
      />
    </View>
  );
}

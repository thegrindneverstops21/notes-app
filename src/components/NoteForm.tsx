import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { CategoryPicker } from "@/components/CategoryPicker";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useSubmit } from "@/hooks/useSubmit";
import { COLORS } from "@/theme/colors";
import { textStyles } from "@/theme/textStyles";
import type { Category } from "@/types";

export type NoteFormValues = {
  categoryId: string;
  title: string;
  body: string;
};

type Props = {
  initial: NoteFormValues;
  categories: Category[];
  submitLabel: string;
  onSubmit: (values: NoteFormValues) => Promise<void>;
  onDelete?: () => void;
};

export function NoteForm({
  initial,
  categories,
  submitLabel,
  onSubmit,
  onDelete,
}: Props) {
  const [values, setValues] = useState(initial);
  const { error, busy, submit } = useSubmit();
  const setField = (key: keyof NoteFormValues) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <>
      <FormField
        label="Title (optional)"
        value={values.title}
        onChangeText={setField("title")}
        autoCapitalize="sentences"
      />
      <FormField
        label="Note"
        value={values.body}
        onChangeText={setField("body")}
        autoCapitalize="sentences"
        multiline
      />
      <Text style={styles.label}>Category</Text>
      <CategoryPicker
        categories={categories}
        selectedId={values.categoryId}
        onSelect={setField("categoryId")}
      />
      {error ? <Text style={textStyles.error}>{error}</Text> : null}
      <PrimaryButton
        label={submitLabel}
        busy={busy}
        onPress={() => submit(() => onSubmit(values))}
      />
      {onDelete ? (
        <Pressable onPress={onDelete} accessibilityRole="button">
          <Text style={textStyles.link}>Delete note</Text>
        </Pressable>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  label: { color: COLORS.meta, marginBottom: 6 },
});

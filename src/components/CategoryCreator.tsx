import { useState } from "react";
import { Text } from "react-native";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { FEEDBACK } from "@/constants/messages";
import { useNotes } from "@/context/NotesContext";
import { useToast } from "@/context/ToastContext";
import { useSubmit } from "@/hooks/useSubmit";
import { useTextStyles } from "@/theme/useTextStyles";

export function CategoryCreator() {
  const textStyles = useTextStyles();
  const { addCategory } = useNotes();
  const { showToast } = useToast();
  const { error, busy, submit } = useSubmit();
  const [name, setName] = useState("");

  async function handleAdd() {
    const ok = await submit(async () => {
      await addCategory(name);
    });
    if (!ok) return;
    setName("");
    showToast(FEEDBACK.CATEGORY_ADDED);
  }

  return (
    <>
      <FormField
        label="New category"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      {error ? <Text style={textStyles.error}>{error}</Text> : null}
      <PrimaryButton label="Add category" busy={busy} onPress={handleAdd} />
    </>
  );
}

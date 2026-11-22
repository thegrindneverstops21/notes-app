import { useState } from "react";
import { Text } from "react-native";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useSubmit } from "@/hooks/useSubmit";
import { textStyles } from "@/theme/textStyles";
import type { Category } from "@/types";

type Props = {
  category: Category;
  onRename: (name: string) => Promise<unknown>;
};

export function RenameCategory({ category, onRename }: Props) {
  const [name, setName] = useState(category.name);
  const { error, busy, submit } = useSubmit();
  const unchanged = name.trim() === category.name;

  return (
    <>
      <FormField
        label="Rename category"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      {error ? <Text style={textStyles.error}>{error}</Text> : null}
      <PrimaryButton
        label="Save name"
        busy={busy}
        onPress={() =>
          submit(async () => {
            if (!unchanged) await onRename(name);
          })
        }
      />
    </>
  );
}

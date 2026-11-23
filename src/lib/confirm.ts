import { Alert } from "react-native";
import { describeError } from "../services/authError";

export function confirmDestructive(
  title: string,
  message: string,
  action: () => Promise<void>,
): void {
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: () => {
        action().catch((error) =>
          Alert.alert("Could not delete", describeError(error)),
        );
      },
    },
  ]);
}

export function confirmDiscard(onDiscard: () => void): void {
  Alert.alert("Discard changes?", "Your edits to this note will be lost.", [
    { text: "Keep editing", style: "cancel" },
    { text: "Discard", style: "destructive", onPress: onDiscard },
  ]);
}

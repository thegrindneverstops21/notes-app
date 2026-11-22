import { View } from "react-native";
import { Skeleton } from "@/components/Skeleton";

const PLACEHOLDER_CARDS = 3;

export function NotesSkeleton() {
  return (
    <View accessibilityLabel="Loading your notes">
      <Skeleton height={28} width="60%" />
      {Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => (
        <Skeleton key={index} height={96} />
      ))}
    </View>
  );
}

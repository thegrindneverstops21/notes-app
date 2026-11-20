import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const textStyles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.ink,
    marginBottom: 24,
  },
  error: { color: COLORS.error, marginBottom: 12 },
  success: { color: COLORS.ink, marginBottom: 12 },
  link: { color: COLORS.meta, marginTop: 16, textAlign: "center" },
});

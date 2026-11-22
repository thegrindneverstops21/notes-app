import { StyleSheet } from "react-native";
import { useThemedStyles, type Theme } from "./index";

const makeTextStyles = (t: Theme) =>
  StyleSheet.create({
    title: {
      color: t.colors.ink,
      fontFamily: t.fonts.title,
      fontSize: 28,
      marginBottom: 24,
    },
    body: {
      color: t.colors.ink,
      fontFamily: t.fonts.body,
      fontSize: 16,
      lineHeight: 24,
    },
    meta: { color: t.colors.meta, fontFamily: t.fonts.body, fontSize: 12 },
    error: {
      color: t.colors.error,
      fontFamily: t.fonts.body,
      marginBottom: 12,
    },
    link: {
      color: t.colors.meta,
      fontFamily: t.fonts.bodyMedium,
      marginTop: 16,
      textAlign: "center",
    },
  });

export const useTextStyles = () => useThemedStyles(makeTextStyles);

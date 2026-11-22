import { useMemo } from "react";
import { useColorScheme, type ViewStyle } from "react-native";
import { DARK, LIGHT, type Palette } from "./colors";

export const FONTS = {
  title: "Newsreader_600SemiBold",
  body: "PlusJakartaSans_400Regular",
  bodyMedium: "PlusJakartaSans_500Medium",
  bodyBold: "PlusJakartaSans_600SemiBold",
} as const;

type Shadows = { rest: ViewStyle; lifted: ViewStyle };

export type Theme = {
  scheme: "light" | "dark";
  colors: Palette;
  shadows: Shadows;
  fonts: typeof FONTS;
};

const LIGHT_SHADOWS: Shadows = {
  rest: {
    shadowColor: "#1c1b18",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  lifted: {
    shadowColor: "#1c1b18",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};

const DARK_SHADOWS: Shadows = {
  rest: {
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  lifted: {
    shadowColor: "#000000",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};

// Module-level objects, so the references stay stable between renders.
const THEMES: Record<Theme["scheme"], Theme> = {
  light: {
    scheme: "light",
    colors: LIGHT,
    shadows: LIGHT_SHADOWS,
    fonts: FONTS,
  },
  dark: { scheme: "dark", colors: DARK, shadows: DARK_SHADOWS, fonts: FONTS },
};

export function useTheme(): Theme {
  return THEMES[useColorScheme() === "dark" ? "dark" : "light"];
}

// `make` must be defined at module level so it stays stable.
export function useThemedStyles<T>(make: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => make(theme), [make, theme]);
}

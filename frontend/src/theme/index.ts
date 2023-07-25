import type { Direction, Theme } from "@mui/material";
import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { baseThemeOptions } from "./base-theme-options";
import { lightThemeOptions } from "./light-theme-options";
import { enUS } from "@mui/material/locale";
interface Neutral {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

declare module "@mui/material/styles" {
  interface Palette {
    neutral?: Neutral;
  }

  interface PaletteOptions {
    neutral?: Neutral;
  }
}

interface ThemeConfig {
  direction?: Direction;
  responsiveFontSizes?: boolean;
  mode: "light";
}

export const createTheme = (): Theme => {
  let theme = createMuiTheme(baseThemeOptions, lightThemeOptions, enUS, {
    direction: "ltr",
  });

  return theme;
};

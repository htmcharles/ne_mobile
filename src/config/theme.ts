import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const brandColors = {
  primary: "#0F766E",
  secondary: "#7C3AED",
  accent: "#EA580C",
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
  info: "#2563EB",
};

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandColors.primary,
    onPrimary: "#FFFFFF",
    primaryContainer: "#CCFBF1",
    onPrimaryContainer: "#134E4A",
    secondary: brandColors.secondary,
    onSecondary: "#FFFFFF",
    secondaryContainer: "#EDE9FE",
    onSecondaryContainer: "#4C1D95",
    tertiary: brandColors.accent,
    tertiaryContainer: "#FFEDD5",
    onTertiaryContainer: "#7C2D12",
    error: brandColors.danger,
    background: "#F7F9F8",
    surface: "#FFFFFF",
    surfaceVariant: "#E8F0ED",
    onBackground: "#10201D",
    onSurface: "#182724",
    onSurfaceVariant: "#586A65",
    outline: "#B8C9C3",
    outlineVariant: "#DCE8E4",
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: "#FFFFFF",
      level1: "#F2F7F5",
      level2: "#E8F0ED",
    },
  },
  custom: brandColors,
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brandColors.primary,
    onPrimary: "#FFFFFF",
    primaryContainer: "#115E59",
    onPrimaryContainer: "#D9FFFA",
    secondary: brandColors.secondary,
    onSecondary: "#FFFFFF",
    secondaryContainer: "#4C1D95",
    onSecondaryContainer: "#EDE9FE",
    tertiary: "#FB923C",
    tertiaryContainer: "#9A3412",
    onTertiaryContainer: "#FFF7ED",
    error: brandColors.danger,
    background: "#071512",
    surface: "#10201D",
    surfaceVariant: "#1C312D",
    onBackground: "#F4FBF8",
    onSurface: "#E5F0EC",
    onSurfaceVariant: "#B4C7C1",
    outline: "#526861",
    outlineVariant: "#263D38",
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: "#071512",
      level1: "#10201D",
      level2: "#1C312D",
    },
  },
  custom: brandColors,
};

export type AppTheme = typeof LightTheme;

export const Themes: Record<string, ThemeColors> = {
    light: {
        outlineColor: "#0c831f",
        borderColor: "#ccc",
    },
    dark: {
        outlineColor: "#ccc",
        borderColor: "#ccc",
    },
} as const;

export type ThemeName = keyof typeof Themes;
export interface ThemeColors {
    outlineColor: string;
    borderColor: string;
};

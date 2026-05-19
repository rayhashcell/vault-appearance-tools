export type SettingsLanguage = "en" | "zh-CN";

export interface VaultAppearanceSettings {
	settingsLanguage: SettingsLanguage;
	readableLineHeight: boolean;
	rainbowFileExplorer: boolean;
	rainbowFolderColors?: string[];
	rainbowFolderColorsLight: string[];
	rainbowFolderColorsDark: string[];
	fileExplorerIcons: boolean;
	markdownExtensionBadge: boolean;
}

export const DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT = [
	"#e02f3e",
	"#008f72",
	"#bd7800",
	"#2f78e6",
	"#438d1f",
	"#8750d6",
	"#dc5a1e",
	"#0095ad",
	"#c43fc4",
	"#788a12",
];

export const DEFAULT_RAINBOW_FOLDER_COLORS_DARK = [
	"#ff6b73",
	"#20c9a8",
	"#ffc247",
	"#73a7ff",
	"#8ada70",
	"#b88cff",
	"#ff9858",
	"#40d2e8",
	"#f084f0",
	"#cadb58",
];

export const DEFAULT_SETTINGS: VaultAppearanceSettings = {
	settingsLanguage: "zh-CN",
	readableLineHeight: true,
	rainbowFileExplorer: true,
	rainbowFolderColors: [...DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT],
	rainbowFolderColorsLight: [...DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT],
	rainbowFolderColorsDark: [...DEFAULT_RAINBOW_FOLDER_COLORS_DARK],
	fileExplorerIcons: true,
	markdownExtensionBadge: true,
};

export function normalizeSettingsLanguage(value: string | undefined): SettingsLanguage {
	if (value === "en" || value === "zh-CN") {
		return value;
	}
	return DEFAULT_SETTINGS.settingsLanguage;
}

export function normalizeSettings(
	loadedSettings: Partial<VaultAppearanceSettings> | null,
): VaultAppearanceSettings {
	const hasLegacyRainbowFolderColors = loadedSettings?.rainbowFolderColors != null;
	return {
		settingsLanguage: normalizeSettingsLanguage(loadedSettings?.settingsLanguage),
		readableLineHeight: loadedSettings?.readableLineHeight ?? DEFAULT_SETTINGS.readableLineHeight,
		rainbowFileExplorer: loadedSettings?.rainbowFileExplorer ?? DEFAULT_SETTINGS.rainbowFileExplorer,
		rainbowFolderColors: loadedSettings?.rainbowFolderColors ?? DEFAULT_SETTINGS.rainbowFolderColors,
		rainbowFolderColorsLight: loadedSettings?.rainbowFolderColorsLight ?? (
			hasLegacyRainbowFolderColors ? [] : DEFAULT_SETTINGS.rainbowFolderColorsLight
		),
		rainbowFolderColorsDark: loadedSettings?.rainbowFolderColorsDark ?? (
			hasLegacyRainbowFolderColors ? [] : DEFAULT_SETTINGS.rainbowFolderColorsDark
		),
		fileExplorerIcons: loadedSettings?.fileExplorerIcons ?? DEFAULT_SETTINGS.fileExplorerIcons,
		markdownExtensionBadge: loadedSettings?.markdownExtensionBadge ?? DEFAULT_SETTINGS.markdownExtensionBadge,
	};
}

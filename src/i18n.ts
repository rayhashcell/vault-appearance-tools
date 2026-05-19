import { SettingsLanguage } from "./settings.ts";

const enTranslations = {
	"settings.language.name": "Settings language",
	"settings.language.desc": "Choose the language used by Vault Appearance Tools settings.",
	"settings.language.option.en": "English",
	"settings.language.option.zhCn": "简体中文",
	"appearance.heading": "Appearance helpers",
	"appearance.readableLineHeight.name": "Use readable Markdown line height",
	"appearance.readableLineHeight.desc": "Sets Obsidian normal line height to 1.8 while this option is enabled.",
	"appearance.rainbowFileExplorer.name": "Use rainbow file explorer folders",
	"appearance.rainbowFileExplorer.desc": "Colors each top-level folder and its descendants in the file explorer.",
	"appearance.rainbowFolderColors.name": "Rainbow folder colors",
	"appearance.rainbowFolderColors.desc": "Choose separate ten-color cycles for light and dark themes.",
	"appearance.rainbowFolderColors.resetAll": "Reset all",
	"appearance.lightThemeFolderColors": "Light theme folder colors",
	"appearance.darkThemeFolderColors": "Dark theme folder colors",
	"appearance.lightFolderColorName": "Light folder color {number}",
	"appearance.darkFolderColorName": "Dark folder color {number}",
	"appearance.usedWhenLightTheme": "Used when Obsidian is in light theme.",
	"appearance.usedWhenDarkTheme": "Used when Obsidian is in dark theme.",
	"appearance.reset": "Reset",
	"appearance.fileExplorerIcons.name": "Show file explorer type icons",
	"appearance.fileExplorerIcons.desc": "Adds file-type icons in the file explorer, including a key icon for .cenc files.",
	"appearance.markdownExtensionBadge.name": "Show file extension badges",
	"appearance.markdownExtensionBadge.desc": "Shows file extension badges at the right edge of files in the file explorer.",
} satisfies Record<string, string>;

export type TranslationKey = keyof typeof enTranslations;

const zhCnTranslations = {
	"settings.language.name": "设置语言",
	"settings.language.desc": "选择 Vault Appearance Tools 设置页使用的语言。",
	"settings.language.option.en": "English",
	"settings.language.option.zhCn": "简体中文",
	"appearance.heading": "外观辅助",
	"appearance.readableLineHeight.name": "使用更易读的 Markdown 行高",
	"appearance.readableLineHeight.desc": "启用后将 Obsidian 正文行高设置为 1.8。",
	"appearance.rainbowFileExplorer.name": "使用彩虹文件浏览器文件夹",
	"appearance.rainbowFileExplorer.desc": "为文件浏览器中的每个顶层文件夹及其子项着色。",
	"appearance.rainbowFolderColors.name": "彩虹文件夹颜色",
	"appearance.rainbowFolderColors.desc": "为浅色和深色主题分别设置十色循环。",
	"appearance.rainbowFolderColors.resetAll": "全部重置",
	"appearance.lightThemeFolderColors": "浅色主题文件夹颜色",
	"appearance.darkThemeFolderColors": "深色主题文件夹颜色",
	"appearance.lightFolderColorName": "浅色文件夹颜色 {number}",
	"appearance.darkFolderColorName": "深色文件夹颜色 {number}",
	"appearance.usedWhenLightTheme": "Obsidian 使用浅色主题时生效。",
	"appearance.usedWhenDarkTheme": "Obsidian 使用深色主题时生效。",
	"appearance.reset": "重置",
	"appearance.fileExplorerIcons.name": "显示文件浏览器类型图标",
	"appearance.fileExplorerIcons.desc": "在文件浏览器中添加文件类型图标，包括用于 .cenc 文件的钥匙图标。",
	"appearance.markdownExtensionBadge.name": "显示文件扩展名徽标",
	"appearance.markdownExtensionBadge.desc": "在文件浏览器中文件右侧显示扩展名徽标。",
} satisfies Record<TranslationKey, string>;

export type Translator = (key: TranslationKey, params?: Record<string, string | number>) => string;

export function createTranslator(language: SettingsLanguage): Translator {
	const translations = language === "zh-CN" ? zhCnTranslations : enTranslations;
	return (key, params = {}) => {
		let text = translations[key] ?? enTranslations[key] ?? key;
		for (const [name, value] of Object.entries(params)) {
			text = text.split(`{${name}}`).join(String(value));
		}
		return text;
	};
}

import {
	ColorComponent,
	Plugin,
	PluginSettingTab,
	Setting,
	TFolder,
} from "obsidian";
import {
	DEFAULT_RAINBOW_FOLDER_COLORS_DARK,
	DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT,
	normalizeSettings,
	normalizeSettingsLanguage,
	VaultAppearanceSettings,
} from "./settings.ts";
import { createTranslator, Translator } from "./i18n.ts";

const READABLE_LINE_HEIGHT_CLASS = "vault-appearance-readable-line-height";
const RAINBOW_FILE_EXPLORER_CLASS = "vault-appearance-rainbow-file-explorer";
const RAINBOW_FILE_EXPLORER_ITEM_CLASS = "vault-appearance-rainbow-file-explorer-item";
const FILE_EXPLORER_ICONS_CLASS = "vault-appearance-file-explorer-icons";
const MARKDOWN_EXTENSION_BADGE_CLASS = "vault-appearance-markdown-extension-badge";
const RAINBOW_FOLDER_LEGACY_COLOR_PREFIX = "--vault-appearance-rainbow-folder-";
const RAINBOW_FOLDER_LIGHT_COLOR_PREFIX = "--vault-appearance-rainbow-folder-light-";
const RAINBOW_FOLDER_DARK_COLOR_PREFIX = "--vault-appearance-rainbow-folder-dark-";

type RainbowFolderTheme = "light" | "dark";

const OLD_DEFAULT_RAINBOW_FOLDER_COLORS = [
	"#e45649",
	"#da8548",
	"#b58900",
	"#50a14f",
	"#0184bc",
	"#4078f2",
	"#a626a4",
];

const PREVIOUS_DEFAULT_RAINBOW_FOLDER_COLORS = [
	"#d84c4c",
	"#008f7a",
	"#b98500",
	"#3f7de8",
	"#4f8f28",
	"#8b5bd6",
	"#d66a2c",
	"#0098b3",
	"#c65ac7",
	"#7c8d1f",
];

export default class VaultAppearanceTools extends Plugin {
	settings: VaultAppearanceSettings;
	private rainbowFolderIndexByRootPath = new Map<string, number>();
	private rainbowFolderMutationObserver: MutationObserver | null = null;
	private rainbowFolderUpdateFrame: number | null = null;

	override async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new VaultAppearanceSettingsTab(this));
		this.applyAppearanceSettings();
	}

	override onunload(): void {
		this.clearAppearanceSettings();
	}

	async loadSettings(): Promise<void> {
		this.settings = normalizeSettings(await this.loadData() as Partial<VaultAppearanceSettings> | null);
		this.settings.rainbowFolderColorsLight = this.getRainbowFolderColors("light");
		this.settings.rainbowFolderColorsDark = this.getRainbowFolderColors("dark");
		this.settings.rainbowFolderColors = this.settings.rainbowFolderColorsLight;
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	applyAppearanceSettings(): void {
		this.toggleBodyClass(READABLE_LINE_HEIGHT_CLASS, this.settings.readableLineHeight);
		this.toggleBodyClass(RAINBOW_FILE_EXPLORER_CLASS, this.settings.rainbowFileExplorer);
		this.toggleBodyClass(FILE_EXPLORER_ICONS_CLASS, this.settings.fileExplorerIcons);
		this.toggleBodyClass(MARKDOWN_EXTENSION_BADGE_CLASS, this.settings.markdownExtensionBadge);
		this.applyRainbowFolderColors();
		this.updateRainbowFolderDomColoring();
	}

	private clearAppearanceSettings(): void {
		for (const className of [
			READABLE_LINE_HEIGHT_CLASS,
			RAINBOW_FILE_EXPLORER_CLASS,
			FILE_EXPLORER_ICONS_CLASS,
			MARKDOWN_EXTENSION_BADGE_CLASS,
		]) {
			document.body.classList.remove(className);
		}
		this.stopRainbowFolderDomColoring();
		this.clearRainbowFolderColors();
	}

	private toggleBodyClass(className: string, enabled: boolean): void {
		document.body.classList.toggle(className, enabled);
	}

	private applyRainbowFolderColors(): void {
		this.getRainbowFolderColors("light").forEach((color, index) => {
			document.body.style.setProperty(`${RAINBOW_FOLDER_LIGHT_COLOR_PREFIX}${index + 1}`, color);
		});
		this.getRainbowFolderColors("dark").forEach((color, index) => {
			document.body.style.setProperty(`${RAINBOW_FOLDER_DARK_COLOR_PREFIX}${index + 1}`, color);
		});
	}

	private updateRainbowFolderDomColoring(): void {
		if (!this.settings.rainbowFileExplorer) {
			this.stopRainbowFolderDomColoring();
			return;
		}

		this.startRainbowFolderDomColoring();
		this.scheduleRainbowFolderDomColoring();
	}

	private startRainbowFolderDomColoring(): void {
		if (this.rainbowFolderMutationObserver != null) {
			return;
		}

		this.rainbowFolderMutationObserver = new MutationObserver(() => {
			this.scheduleRainbowFolderDomColoring();
		});
		this.rainbowFolderMutationObserver.observe(document.body, {
			attributes: true,
			attributeFilter: ["data-path"],
			childList: true,
			subtree: true,
		});
	}

	private stopRainbowFolderDomColoring(): void {
		this.rainbowFolderMutationObserver?.disconnect();
		this.rainbowFolderMutationObserver = null;
		if (this.rainbowFolderUpdateFrame != null) {
			window.cancelAnimationFrame(this.rainbowFolderUpdateFrame);
			this.rainbowFolderUpdateFrame = null;
		}
		this.clearRainbowFolderDomColors();
	}

	private scheduleRainbowFolderDomColoring(): void {
		if (this.rainbowFolderUpdateFrame != null) {
			return;
		}

		this.rainbowFolderUpdateFrame = window.requestAnimationFrame(() => {
			this.rainbowFolderUpdateFrame = null;
			this.applyRainbowFolderDomColors();
		});
	}

	private applyRainbowFolderDomColors(): void {
		this.rebuildRainbowFolderIndexByRootPath();

		const navItems = document.body.querySelectorAll<HTMLElement>(
			".nav-files-container .nav-folder, .nav-files-container .nav-file",
		);

		navItems.forEach(navItem => {
			const rootPath = this.getRootFolderPathForNavItem(navItem);
			if (rootPath == null) {
				this.clearRainbowFolderDomColor(navItem);
				return;
			}

			const colorIndex = this.getRainbowFolderColorIndex(rootPath);
			navItem.classList.add(RAINBOW_FILE_EXPLORER_ITEM_CLASS);
			navItem.style.setProperty(
				"--vault-appearance-rainbow-folder-current-color",
				`var(--vault-appearance-rainbow-folder-cycle-${colorIndex + 1})`,
			);
		});
	}

	private clearRainbowFolderDomColors(): void {
		document.body.querySelectorAll<HTMLElement>(`.${RAINBOW_FILE_EXPLORER_ITEM_CLASS}`).forEach(navItem => {
			this.clearRainbowFolderDomColor(navItem);
		});
	}

	private clearRainbowFolderDomColor(navItem: HTMLElement): void {
		navItem.classList.remove(RAINBOW_FILE_EXPLORER_ITEM_CLASS);
		navItem.style.removeProperty("--vault-appearance-rainbow-folder-current-color");
	}

	private rebuildRainbowFolderIndexByRootPath(): void {
		const topLevelFolderPaths = this.app.vault.getAllLoadedFiles()
			.filter((file): file is TFolder => file instanceof TFolder && file.parent?.isRoot() === true)
			.map(folder => folder.path)
			.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

		this.rainbowFolderIndexByRootPath = new Map(
			topLevelFolderPaths.map((path, index) => {
				return [path, index % DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT.length];
			}),
		);
	}

	private getRootFolderPathForNavItem(navItem: HTMLElement): string | null {
		const itemPath = this.getPathForNavItem(navItem);
		if (itemPath == null) {
			return null;
		}

		const normalizedPath = itemPath.replace(/^\/+/, "");
		if (normalizedPath.length === 0) {
			return null;
		}

		const rootPath = normalizedPath.split("/")[0];
		const isRootFile = !navItem.classList.contains("nav-folder") && !normalizedPath.includes("/");
		return isRootFile ? null : rootPath;
	}

	private getPathForNavItem(navItem: HTMLElement): string | null {
		const path = navItem.getAttribute("data-path")
			?? navItem.querySelector<HTMLElement>("[data-path]")?.getAttribute("data-path");
		return path?.trim() || null;
	}

	private getRainbowFolderColorIndex(rootPath: string): number {
		const existingIndex = this.rainbowFolderIndexByRootPath.get(rootPath);
		if (existingIndex != null) {
			return existingIndex;
		}

		const nextIndex = this.rainbowFolderIndexByRootPath.size % DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT.length;
		this.rainbowFolderIndexByRootPath.set(rootPath, nextIndex);
		return nextIndex;
	}

	private clearRainbowFolderColors(): void {
		DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT.forEach((_, index) => {
			document.body.style.removeProperty(`${RAINBOW_FOLDER_LEGACY_COLOR_PREFIX}${index + 1}`);
			document.body.style.removeProperty(`${RAINBOW_FOLDER_LIGHT_COLOR_PREFIX}${index + 1}`);
			document.body.style.removeProperty(`${RAINBOW_FOLDER_DARK_COLOR_PREFIX}${index + 1}`);
		});
	}

	setRainbowFolderColors(theme: RainbowFolderTheme, colors: string[]): void {
		if (theme === "light") {
			this.settings.rainbowFolderColorsLight = colors;
			this.settings.rainbowFolderColors = colors;
			return;
		}
		this.settings.rainbowFolderColorsDark = colors;
	}

	getRainbowFolderColors(theme: RainbowFolderTheme): string[] {
		const fallbackColors = this.getDefaultRainbowFolderColors(theme);
		const configuredColors = this.getConfiguredRainbowFolderColors(theme);
		return fallbackColors.map((fallbackColor, index) => {
			const color = configuredColors[index];
			return this.isHexColor(color) ? color : fallbackColor;
		});
	}

	getDefaultRainbowFolderColors(theme: RainbowFolderTheme): string[] {
		return theme === "light"
			? DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT
			: DEFAULT_RAINBOW_FOLDER_COLORS_DARK;
	}

	private getConfiguredRainbowFolderColors(theme: RainbowFolderTheme): string[] {
		const themeColors = theme === "light"
			? this.settings.rainbowFolderColorsLight
			: this.settings.rainbowFolderColorsDark;

		if (themeColors?.length > 0) {
			return this.isDefaultRainbowFolderPalette(themeColors) ? [] : themeColors;
		}

		const legacyColors = this.settings.rainbowFolderColors ?? [];
		return this.isDefaultRainbowFolderPalette(legacyColors) ? [] : legacyColors;
	}

	private isDefaultRainbowFolderPalette(colors: string[]): boolean {
		return [
			OLD_DEFAULT_RAINBOW_FOLDER_COLORS,
			PREVIOUS_DEFAULT_RAINBOW_FOLDER_COLORS,
			DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT,
			DEFAULT_RAINBOW_FOLDER_COLORS_DARK,
		].some(defaultColors => this.isMatchingRainbowFolderPalette(colors, defaultColors));
	}

	private isMatchingRainbowFolderPalette(colors: string[], defaultColors: string[]): boolean {
		return colors.length === defaultColors.length
			&& defaultColors.every((color, index) => {
				return colors[index]?.toLowerCase() === color;
			});
	}

	private isHexColor(color: string | undefined): color is string {
		return color != null && /^#[0-9a-fA-F]{6}$/.test(color);
	}
}

class VaultAppearanceSettingsTab extends PluginSettingTab {
	private plugin: VaultAppearanceTools;

	constructor(plugin: VaultAppearanceTools) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	override display(): void {
		const { containerEl } = this;
		const t = createTranslator(this.plugin.settings.settingsLanguage);

		containerEl.empty();

		new Setting(containerEl)
			.setName(t("settings.language.name"))
			.setDesc(t("settings.language.desc"))
			.addDropdown(dropdown => {
				dropdown
					.addOption("en", t("settings.language.option.en"))
					.addOption("zh-CN", t("settings.language.option.zhCn"))
					.setValue(this.plugin.settings.settingsLanguage)
					.onChange(async value => {
						this.plugin.settings.settingsLanguage = normalizeSettingsLanguage(value);
						await this.plugin.saveSettings();
						this.display();
					});
			});

		new Setting(containerEl)
			.setHeading()
			.setName(t("appearance.heading"));

		new Setting(containerEl)
			.setName(t("appearance.readableLineHeight.name"))
			.setDesc(t("appearance.readableLineHeight.desc"))
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.readableLineHeight)
					.onChange(async value => {
						this.plugin.settings.readableLineHeight = value;
						this.plugin.applyAppearanceSettings();
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(t("appearance.rainbowFileExplorer.name"))
			.setDesc(t("appearance.rainbowFileExplorer.desc"))
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.rainbowFileExplorer)
					.onChange(async value => {
						this.plugin.settings.rainbowFileExplorer = value;
						this.plugin.applyAppearanceSettings();
						await this.plugin.saveSettings();
					});
			});

		const lightColorPickers: ColorComponent[] = [];
		const darkColorPickers: ColorComponent[] = [];
		new Setting(containerEl)
			.setName(t("appearance.rainbowFolderColors.name"))
			.setDesc(t("appearance.rainbowFolderColors.desc"))
			.addButton(button => {
				button
					.setButtonText(t("appearance.rainbowFolderColors.resetAll"))
					.onClick(async () => {
						this.plugin.setRainbowFolderColors("light", [...DEFAULT_RAINBOW_FOLDER_COLORS_LIGHT]);
						this.plugin.setRainbowFolderColors("dark", [...DEFAULT_RAINBOW_FOLDER_COLORS_DARK]);
						this.plugin.applyAppearanceSettings();
						lightColorPickers.forEach((colorPicker, index) => {
							colorPicker.setValue(this.plugin.settings.rainbowFolderColorsLight[index]);
						});
						darkColorPickers.forEach((colorPicker, index) => {
							colorPicker.setValue(this.plugin.settings.rainbowFolderColorsDark[index]);
						});
						await this.plugin.saveSettings();
					});
			});

		this.buildRainbowFolderColorSettings(
			containerEl,
			t("appearance.lightThemeFolderColors"),
			index => t("appearance.lightFolderColorName", { number: index + 1 }),
			"light",
			lightColorPickers,
			t,
		);

		this.buildRainbowFolderColorSettings(
			containerEl,
			t("appearance.darkThemeFolderColors"),
			index => t("appearance.darkFolderColorName", { number: index + 1 }),
			"dark",
			darkColorPickers,
			t,
		);

		new Setting(containerEl)
			.setName(t("appearance.fileExplorerIcons.name"))
			.setDesc(t("appearance.fileExplorerIcons.desc"))
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.fileExplorerIcons)
					.onChange(async value => {
						this.plugin.settings.fileExplorerIcons = value;
						this.plugin.applyAppearanceSettings();
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(t("appearance.markdownExtensionBadge.name"))
			.setDesc(t("appearance.markdownExtensionBadge.desc"))
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.markdownExtensionBadge)
					.onChange(async value => {
						this.plugin.settings.markdownExtensionBadge = value;
						this.plugin.applyAppearanceSettings();
						await this.plugin.saveSettings();
					});
			});
	}

	private buildRainbowFolderColorSettings(
		containerEl: HTMLElement,
		sectionName: string,
		getColorName: (index: number) => string,
		theme: RainbowFolderTheme,
		colorPickers: ColorComponent[],
		t: Translator,
	): void {
		new Setting(containerEl)
			.setName(sectionName)
			.setDesc(theme === "light"
				? t("appearance.usedWhenLightTheme")
				: t("appearance.usedWhenDarkTheme"))
			.addButton(button => {
				button
					.setButtonText(t("appearance.reset"))
					.onClick(async () => {
						this.plugin.setRainbowFolderColors(theme, [...this.plugin.getDefaultRainbowFolderColors(theme)]);
						this.plugin.applyAppearanceSettings();
						colorPickers.forEach((colorPicker, index) => {
							colorPicker.setValue(this.plugin.getRainbowFolderColors(theme)[index]);
						});
						await this.plugin.saveSettings();
					});
			});

		this.plugin.getRainbowFolderColors(theme).forEach((color, index) => {
			new Setting(containerEl)
				.setName(getColorName(index))
				.addColorPicker(colorPicker => {
					colorPickers[index] = colorPicker;
					colorPicker
						.setValue(color)
						.onChange(async value => {
							const colors = this.plugin.getRainbowFolderColors(theme);
							colors[index] = value;
							this.plugin.setRainbowFolderColors(theme, colors);
							this.plugin.applyAppearanceSettings();
							await this.plugin.saveSettings();
						});
				});
		});
	}
}

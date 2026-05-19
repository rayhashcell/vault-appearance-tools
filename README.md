# Vault Appearance Tools

[简体中文](README.zh-CN.md)

Vault Appearance Tools is an Obsidian plugin for vault-level appearance helpers. It keeps common visual tweaks in one lightweight plugin.

This plugin only changes interface appearance. It does not handle note encryption, password caching, `.cenc` content parsing, or decrypted note content.

## Features

- Readable Markdown line height: sets Obsidian's normal Markdown line height to `1.8`.
- Rainbow file explorer folders: assigns colors by top-level folder and lets child folders and files inherit the same visual identity.
- Separate light and dark palettes: configure 10 colors for light theme and 10 colors for dark theme.
- File explorer type icons: shows type icons for common files such as Markdown, JSON, YAML, TOML, scripts, config files, certificates, and `.cenc` files.
- Markdown extension badges: shows file extension badges on the right side of file explorer rows, making `.md`, `.mdx`, and `.markdown` easier to distinguish.
- Bilingual settings UI: supports English and Simplified Chinese.

## Install With BRAT

This plugin can be installed and updated through the Obsidian BRAT plugin. This is useful before the plugin is available in the Obsidian community plugin store.

Repository URL:

```text
https://github.com/rayhashcell/vault-appearance-tools
```

### Step 1: Install BRAT

1. Open Obsidian settings.
2. Go to `Community plugins`.
3. If community plugins are not enabled yet, turn off restricted mode and allow community plugins.
4. Click `Browse`.
5. Search for `BRAT`.
6. Install `BRAT`, then enable it.

### Step 2: Add This Plugin Through BRAT

1. Open the command palette.
   - macOS: `Command + P`
   - Windows / Linux: `Ctrl + P`
2. Run `BRAT: Add a beta plugin for testing`.
3. Paste the repository URL:

   ```text
   https://github.com/rayhashcell/vault-appearance-tools
   ```

4. Confirm and wait for BRAT to download the plugin.
5. Return to `Community plugins` in Obsidian settings.
6. Find `Vault Appearance Tools` and enable it.

### Step 3: Update The Plugin

Future updates can also be handled through BRAT:

1. Open the command palette.
2. Run `BRAT: Check for updates to all beta plugins and UPDATE`.
3. If Obsidian asks you to reload the plugin, follow the prompt.

If you want to pin a specific version, use BRAT's release tag installation flow and choose a tag such as `v1.0.0`.

References:

- [BRAT Quick Guide](https://tfthacker.com/brat-quick-guide)
- [Obsidian Beta-testing plugins](https://docs.obsidian.md/Plugins/Releasing/Beta-testing%20plugins)

## Manual Installation

Download these three files from a GitHub Release:

- `main.js`
- `manifest.json`
- `styles.css`

Place them in your Obsidian vault:

```text
<your-vault>/.obsidian/plugins/vault-appearance-tools/
```

Restart Obsidian, or refresh the community plugin list, then enable `Vault Appearance Tools`.

## Local Development

Install dependencies and run:

```bash
pnpm run build
```

Production builds are written to:

```text
dist/vault-appearance-tools-<version>/vault-appearance-tools/
```

## Screenshots

### File Explorer, Dark Theme

<img src="docs/images/file-explorer-dark.png" alt="File explorer with rainbow folders, file type icons, and extension badges in dark theme" width="420">

### File Explorer, Light Theme

<img src="docs/images/file-explorer-light.png" alt="File explorer with rainbow folders, file type icons, and extension badges in light theme" width="420">

### Settings, Simplified Chinese

<img src="docs/images/settings-zh-cn.png" alt="Vault Appearance Tools settings page in Simplified Chinese" width="720">

### Settings, English

<img src="docs/images/settings-en.png" alt="Vault Appearance Tools settings page in English" width="720">

## Release

Stable releases are published by pushing a `v`-prefixed semver tag, such as `v1.0.0`.

The `Publish GitHub Release` workflow builds the plugin and uploads these files from the production build directory:

- `main.js`
- `manifest.json`
- `styles.css`

## Boundaries

Vault Appearance Tools is an appearance-only plugin. It does not include encryption logic, password caching, `.cenc` content parsing, or decrypted note handling.

# Vault Appearance Tools

Vault Appearance Tools is an Obsidian plugin for vault-level appearance helpers.

## Features

- readable Markdown line height
- rainbow file explorer folders with separate light and dark color cycles
- file explorer type icons, including `.cenc` key icons
- Markdown extension badges
- English and Simplified Chinese settings UI

## Development

```bash
pnpm run build
```

Production builds are written to:

```text
dist/vault-appearance-tools-<version>/vault-appearance-tools/
```

## Test Vault Deployment

After building, copy these files:

- `main.js`
- `manifest.json`
- `styles.css`

to:

```text
/Users/bisco/private/obvault/.obsidian/plugins/vault-appearance-tools/
```

## Boundaries

This plugin is appearance-only. It must not include encryption, password caching, `.cenc` parsing, or decrypted-content handling.

# CLAUDE.md

## Project Context

Vault Appearance Tools is an Obsidian appearance plugin. It owns visual helpers only:

- readable Markdown line height
- rainbow file explorer folders
- file explorer type icons
- Markdown extension badges

This plugin was split from Custom Encrypt. Keep it separate from encryption and password behavior.

## Implementation Rules

- Runtime code must remain mobile-compatible and avoid Node/Electron-only APIs.
- Use Obsidian plugin APIs and browser DOM APIs only.
- Do not add crypto, password cache, `.cenc` parsing, or decrypted-content features.
- Prefix runtime classes with `vault-appearance-*` and CSS variables with `--vault-appearance-*`.
- Clean up all body classes, inline style variables, requestAnimationFrame work, and MutationObservers on unload.
- Keep file explorer DOM code defensive; Obsidian markup can vary across versions and themes.

## Localization

- Maintain English and Simplified Chinese together in `src/i18n.ts`.
- Settings copy, button labels, descriptions, and validation messages must exist in both languages.
- Settings language is plugin-managed and should not follow Obsidian language automatically.

## Validation

Run before handing off:

- `pnpm run build`
- `git diff --check`
- `rg -n "^[[:space:]]*console\\." src`
- `rg -n "custom-encrypt|password|decrypt|crypto|localStorage|sessionStorage|navigator\\.clipboard" src`

For test-vault deployment, copy the built `main.js`, `manifest.json`, and `styles.css` into:

- `/Users/bisco/private/obvault/.obsidian/plugins/vault-appearance-tools/`

Verify copied files with SHA-256 equality.

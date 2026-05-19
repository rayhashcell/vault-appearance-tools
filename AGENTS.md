# AGENTS.md

## Project Context

This repository is the Vault Appearance Tools Obsidian plugin. It contains appearance-only helpers that were split out of Custom Encrypt:

- readable Markdown line height
- rainbow file explorer folders
- file explorer type icons
- Markdown extension badges

Keep this plugin independent from encryption code. Do not add password caching, `.cenc` parsing, crypto helpers, or decrypted-content handling here.

## Architecture Rules

- Runtime code must be mobile-compatible because `manifest.json` has `"isDesktopOnly": false`.
- Do not use Node, Electron, or filesystem APIs in Obsidian runtime code. Use Obsidian APIs and browser DOM APIs only.
- All appearance behavior must be controlled by plugin settings and removable on unload.
- Body classes and CSS variables must use the `vault-appearance-*` / `--vault-appearance-*` prefixes.
- Do not reuse `custom-encrypt-*` classes or variables; Custom Encrypt must not own appearance behavior anymore.
- If file explorer DOM behavior changes, keep the implementation resilient to Obsidian markup changes and clean up MutationObservers on unload.

## Settings and Localization

- Settings language is plugin-managed and limited to English (`en`) and Simplified Chinese (`zh-CN`).
- Any setting item change must update both languages in `src/i18n.ts`.
- Setting defaults live in `src/settings.ts`; keep defaults synchronized with the intended first-run appearance.
- Do not add a translation key for only one language, and do not let Simplified Chinese drift from the English meaning.

## CSS Rules

- Keep CSS defaults in `src/styles.css` and runtime overrides in CSS variables applied from TypeScript.
- Avoid global selectors unless gated by a `body.vault-appearance-*` class.
- Disabling a feature must remove its visual effect without requiring an Obsidian reload.
- `styles.css` is copied into the shipped plugin bundle by `esbuild.config.mjs`; do not edit generated files under `dist/`.

## Validation

Use these checks after changes:

- `pnpm run build`
- `git diff --check`
- `rg -n "^[[:space:]]*console\\." src`
- `rg -n "custom-encrypt|password|decrypt|crypto|localStorage|sessionStorage|navigator\\.clipboard" src`

When updating the installed test plugin, build first and copy generated files from:

- `dist/vault-appearance-tools-<version>/vault-appearance-tools/`

to:

- `<test-vault>/.obsidian/plugins/vault-appearance-tools/`

Then verify `main.js`, `manifest.json`, and `styles.css` by SHA-256 equality.

## Release Process

For normal GitHub releases:

1. Keep plugin metadata versions as plain semver without a `v` prefix:
   - `package.json`
   - `manifest.json`
   - `versions.json`
2. Bump the package version with `pnpm version patch --no-git-tag-version` unless a specific version is requested. This runs `version-bump.mjs`, which syncs `manifest.json` and appends `versions.json`.
3. Run `pnpm run build`, `git diff --check`, and the validation grep commands above.
4. Commit the release changes.
5. Create and push a Git tag with a `v` prefix, for example `v1.0.0`.

The `Publish GitHub Release` GitHub Actions workflow is triggered by `v*.*.*` tags or by manual dispatch. It builds the plugin with pnpm and publishes a GitHub Release named after the `v`-prefixed tag. The workflow uploads exactly these plugin files from `dist/vault-appearance-tools-<version>/vault-appearance-tools/`:

- `main.js`
- `manifest.json`
- `styles.css`

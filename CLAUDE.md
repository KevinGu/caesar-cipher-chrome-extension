# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm test` — run `node:test` unit tests for the cipher algorithm (`tests/*.test.mjs`).
- `npm test -- --test-name-pattern='<regex>'` — run a single test by name.
- `./scripts/build-zip.sh [chrome|edge|firefox]` — produce `dist/caesar-cipher-decoder-<target>-<version>.zip` for store submission (default: `chrome`). Stages only runtime assets — excludes tests, scripts, store-assets, docs, README, LICENSE, PRIVACY.md, `package.json`, `.git`. `chrome` and `edge` share the same Chromium artifact but are built as separate files so each store upload is traceable. `firefox` swaps in `manifest.firefox.json` (renamed to `manifest.json` inside the zip).
- `./scripts/build-icons.sh [path/to/logo.svg]` — regenerate `icons/icon-{16,48,128}.png` from the main-site SVG. Requires `rsvg-convert` (`brew install librsvg`). Default source path is `../caesar-cipher/public/logo.svg` (sibling repo).
- Manual UI iteration: load unpacked at `chrome://extensions` (Developer mode) pointing at the repo root, then hit the card's refresh icon after edits.

## Architecture

Manifest V3 extension, deliberately single-purpose. Three runtime pieces; no build step, no bundler, no framework.

1. **`background.js` (service worker)** — on install, creates the `"Decode as Caesar Cipher"` context menu (selection context only) and registers an uninstall URL. On click, trims the selection, truncates to `MAX_LEN = 2000`, URL-encodes it, and opens `result/result.html?text=…&truncated=0|1` in a new tab. The selection crosses the process boundary via URL params — not messaging, not storage — so the result page is self-contained and works from a fresh tab.

2. **`result/` (result page)** — static HTML + CSS + `result.js` (loaded as `<script type="module">`). Reads `text` and `truncated` from `location.search`, then renders 26 rows (shift 0–25). Row `n` displays `shiftString(text, -n)` — i.e., the plaintext you'd recover if the ciphertext had been encrypted with Caesar `+n`. Copy buttons use `navigator.clipboard.writeText` with the same `-n` shift. **The negative shift is load-bearing**: commit `d46ac3b` fixed a bug where "Shift N" rows showed `+n` encryption instead of `+n` decryption — preserve this semantic in any refactor.

3. **`lib/caesar.js` (shared pure core)** — `shiftChar` / `shiftString`. ESM, no DOM, no Chrome APIs, no I/O. Imported both by `result/result.js` (browser, via module script) and by `tests/caesar.test.mjs` (Node). Only ASCII A–Z / a–z are shifted; everything else (digits, punctuation, CJK, emoji, whitespace) passes through unchanged. This dual consumer is why the file is ESM and free of any runtime dependencies — keep it that way or tests and/or the extension will break.

## Browser targets

Single codebase ships to three stores. Runtime code (`background.js`, `lib/caesar.js`, `result/*`) is identical across all targets — only the manifest differs.

- **Chrome & Edge** — both use `manifest.json` (MV3 Chromium baseline). No fork needed; Edge accepts Chromium MV3 packages directly.
- **Firefox** — uses `manifest.firefox.json`. Differences from Chromium:
  - `background.service_worker` → `background.scripts: ["background.js"]` (Firefox MV3 runs event pages, not service workers). The existing `background.js` registers its listeners synchronously at top level, which is required for event-page wake-up — **don't move listener registration behind async boundaries** or the menu click will silently drop.
  - Adds `browser_specific_settings.gecko.id` (`contact@caesarcipher.org`) and `strict_min_version: "115.0"` for AMO signing.
  - Drops `minimum_chrome_version` (Chromium-specific).
  - No code changes: `chrome.*` APIs (`runtime.onInstalled`, `runtime.setUninstallURL`, `contextMenus`, `tabs.create`) all work in Firefox via its built-in compat layer.
- **Version bumps must edit BOTH manifests.** `manifest.json` and `manifest.firefox.json` versions drift silently if you only edit one — there's no single source of truth. Keep `package.json` version in sync too (it's user-facing in the repo but not used at build time).

## Constraints worth knowing

- **Permissions minimalism:** both manifests request only `contextMenus`. No `activeTab`, no `storage`, no `tabs`-permission (only `chrome.tabs.create`, which doesn't require the permission). Adding permissions is a review/trust cost — don't add one without a concrete user-facing reason.
- **Offline / zero-telemetry posture:** the extension makes no network calls and stores nothing. `PRIVACY.md` and the store listing both promise this. Any `fetch`, `storage`, or analytics addition is a breaking change to the privacy contract.
- **Scope discipline:** this extension intentionally only does Caesar. Vigenère/Atbash/etc. belong at [caesarcipher.org](https://caesarcipher.org) (the companion web app). Don't add other ciphers here.
- **Version bumps:** when changing runtime behavior, bump `version` in **both** `manifest.json` and `manifest.firefox.json` (and `package.json` to match). `build-zip.sh` reads the version from whichever manifest the selected target uses.

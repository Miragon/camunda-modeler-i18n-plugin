# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An npm-workspaces monorepo for Camunda Modeler / bpmn-js internationalization. Two workspaces:

- **`packages/translations/`** — the shared library **`@miragon/bpmn-modeler-i18n`** (TypeScript, published to npm). Holds all translation data and the runtime translator. Framework-agnostic; any bpmn-js / dmn-js host can consume it.
- **`apps/camunda-modeler-i18n-plugin/`** — the Camunda Modeler client plugin (JavaScript, webpack). Adds a language selector to the toolbar, consumes the library, and ships as a GitHub release zip. Tracks Camunda Modeler `5.50.1` (`supportedModeler` in `apps/camunda-modeler-i18n-plugin/package.json`).

Built by Miragon GmbH, licensed MIT. Supported languages (12): German, English, Spanish, French, Italian, Japanese, Korean, Portuguese (Brasil), Simplified Chinese, Traditional Chinese, Russian, Dutch — keyed by BCP-47 code (`de`, `en`, `es`, `fr`, `it`, `pt-br`, `zh-Hans`, `zh-Hant`, `ru`, `nl-nl`, `ja`, `ko`).

## Monorepo layout

```
package.json            # private workspace root: scripts, dev tooling, `overrides` (npm honors these only at root)
tsconfig.base.json, eslint.config.mjs, .prettierrc.json, knip.json, .dependency-cruiser.cjs
release-please-config.json, .release-please-manifest.json
packages/translations/  # @miragon/bpmn-modeler-i18n (tsc → dist, gitignored)
  src/{index.ts, TranslateModule.ts, languages/index.ts, languages/<locale>/*.ts}
  test/                 # locale invariants + translator behavior
apps/camunda-modeler-i18n-plugin/            # the Camunda Modeler plugin
  index.js, webpack.config.js, client/, dist/ (COMMITTED), test/, docs/, vitest*.config.mjs
```

## Commands

All commands run **from the repo root**; root scripts delegate to the workspaces and build the library before anything that consumes it.

```bash
npm install          # install all workspaces
npm run build        # build the library (tsc), then the plugin bundle (webpack → apps/camunda-modeler-i18n-plugin/dist/client.js)
npm run dev          # webpack watch mode for the plugin

npm test             # every workspace: locale invariants, translator, plugin contract, drift — browserless
npm run lint         # ESLint across the monorepo
npm run typecheck    # tsc --noEmit for the library
npm run format       # Prettier --write   (format:check for CI)
npm run knip         # unused files / exports / dependencies
npm run depcruise    # dependency-graph architecture rules

npx playwright install chromium   # once, for the integration suite
npm run test:integration     # real bpmn-js/dmn-js in Chromium
npm run check:translations   # drift report against the Modeler's UI strings
npm run harvest              # record strings only visible while an editor runs
npm run sync:upstream-keys   # refresh the vendored bpmn-js key list
npm run sync:app-shell-keys  # refresh the vendored bpmnlint / @camunda/linting key list
npm run sync:modeler-deps    # pin our libs to what the tracked Modeler ships

npm run e2e:setup            # download the tracked Modeler release (~150 MB)
npm run test:e2e             # drive the real Modeler with the plugin installed
```

## Architecture

### The shared library (`packages/translations`)

- **`src/languages/<locale>/{bpmn-js,dmn-js,other,camunda-8-cloud,camunda-7-platform}.ts`** — the translation data, one flat `Record<string, string>` per file (English source string → localized value). Split into engine-agnostic core (`bpmn-js`, `dmn-js`, `other`) and per-engine property overlays (`camunda-8-cloud` = C8, `camunda-7-platform` = C7 — the Camunda version is visible in the file name). A per-locale `index.ts` barrel spreads all five into one dictionary. The C7 overlay is generated uniformly across locales; `test/platforms.spec.ts` guards each overlay (parity, placeholders, disjointness). C7 property labels the browser harness can't reach live in `known-runtime-keys.json`.
- **`src/languages/index.ts`** — the registry: the `SupportedLocale` union, `supportedLanguages` (label + locale + dictionary per language, in dropdown order), and the `dictionaries` map.
- **`src/TranslateModule.ts`** — `CustomTranslator` (lookup, English fallback, `{param}` interpolation, missing-key logging, `setLanguage`/`getLocale`/`onChange`), a shared **`i18n`** singleton, and the didi **`TranslateModule`** that binds it as the modeler's `translate` / `customTranslator` services.
- **`src/index.ts`** — public API: `TranslateModule`, `CustomTranslator`, `i18n`, `supportedLanguages`, `dictionaries`, and types `SupportedLocale` / `LanguageEntry`. Built with `tsc` (NodeNext, so relative imports carry explicit `.js` extensions) to `dist/` — gitignored; only the plugin's dist is committed.

### The plugin (`apps/camunda-modeler-i18n-plugin`)

The plugin entry point (`apps/camunda-modeler-i18n-plugin/index.js`) names the plugin and points at the compiled bundle (`dist/client.js`); webpack bundles `client/index.js` into it (inlining the library, so the shipped plugin is self-contained).

- **`client/config/I18nPlugin.js`** — React component. Renders the language dropdown, subscribes to `bpmn.modeler.configure` / `dmn.modeler.configure` to inject `TranslateModule` as middleware into each editor (DMN into `drd`/`decisionTable`/`literalExpression`), and persists the selection via `config.getForPlugin`/`setForPlugin` under key `"i18n"`. On config load and on change it calls **`i18n.setLanguage(...)`**.
- **`client/bpmnjs-i18n-extension/index.js`** — the plugin's translation seam. Re-exports the library's `TranslateModule` (default), `i18n` and `supportedLanguages`, and defines plugin-local `options` (dropdown, derived from `supportedLanguages`) and `canonicalLocale` (legacy locale mapping, below). Logs the "help us translate" greeting at load.
- **`client/config/ConfigModal.js`** — modal prompting a restart after a language change.

### Adding a new language

1. Add `packages/translations/src/languages/<locale>/` with `bpmn-js.ts`, `dmn-js.ts`, `other.ts`, `camunda-8-cloud.ts`, `camunda-7-platform.ts` and an `index.ts` barrel.
2. Register the locale in `packages/translations/src/languages/index.ts` (add to the `SupportedLocale` union, `supportedLanguages`, and `dictionaries`).

The plugin dropdown updates automatically. German is the authoritative base; the `/i18n-translate` skill helps fill a language.

## Testing

Library tests live in `packages/translations/test/`; plugin tests in `apps/camunda-modeler-i18n-plugin/test/` (shared helpers in `apps/camunda-modeler-i18n-plugin/test/lib/`):

- **`packages/translations/test/`** — `locales.spec.ts` (key parity vs the English reference, `{placeholder}` preservation, no empty values, zero cross-file duplicate keys) and `TranslateModule.spec.ts` (lookup, fallback, interpolation, language switching, `onChange`). These are the invariants that used to live in the plugin.
- **`apps/camunda-modeler-i18n-plugin/test/unit/`** — the plugin-side seam only: the dropdown `options` agree with the library and the legacy locale mapping is correct.
- **`apps/camunda-modeler-i18n-plugin/test/contract/`** — the contract with the Modeler (jsdom). Loads the built `dist/client.js` with `window.react` / `window.components` stubbed and asserts it registers itself; renders `I18nPlugin` to pin the `tab-actions` slot, both editor subscriptions, the middleware shape, and that the stored language reaches `i18n`.
- **`apps/camunda-modeler-i18n-plugin/test/integration/`** — real editors in Chromium via Playwright. jsdom implements no SVG layout, which is why bpmn-js tests itself in a browser too. Own config/script so `npm test` stays browserless.
- **`apps/camunda-modeler-i18n-plugin/test/e2e/`** — the real Camunda Modeler via Playwright's Electron runner. Downloads the release named by `supportedModeler`, installs the plugin into a throwaway `--user-data-dir`, and asserts the palette and properties panel are translated. A second spec packs the zip the release attaches and installs _that_, so a packaging mistake fails here. Excluded from `npm test`; skipped when the Modeler is not cached.
- **`apps/camunda-modeler-i18n-plugin/test/drift/`** — the translation drift check plus the `harvest` and `sync` tools.

The contract layer earns its keep because the whole plugin API surface is three globals, and plugin-helpers resolves them with `returnOrThrow(...)` at _module load time_ — so an upstream rename throws on import instead of in front of a user.

## Translation drift

The plugin depends on none of the libraries whose strings it translates, so a Modeler release that adds UI text produces no build error and no test failure. `apps/camunda-modeler-i18n-plugin/test/drift/` closes that hole by discovering what needs translating from four sources:

1. `bpmn-js/docs/translations.json` — the only published list, vendored under `apps/camunda-modeler-i18n-plugin/test/fixtures/upstream/` so CI stays hermetic.
2. Static extraction of literal `translate('…')` arguments from `camunda-bpmn-js` / `camunda-dmn-js`, the aggregate bundles the Modeler loads. Package resolution is hoist-aware: workspaces move these to the root `node_modules`.
3. **Runtime harvesting** (`npm run harvest`) — drives real editors in a browser and records every `translate()` call. About a third of our keys are palette and create-menu labels built at runtime, invisible to static analysis. Results land in `apps/camunda-modeler-i18n-plugin/test/fixtures/upstream/harvested.json`.
4. **Application-shell keys** (`npm run sync:app-shell-keys`, vendored as `test/fixtures/upstream/app-shell.keys.json`). Sources 1–3 only ever observe the _editor bundle_ (`camunda-bpmn-js` / `camunda-dmn-js`). The Modeler wires a linting layer _on top_ of that bundle — `bpmn-js-bpmnlint` (panel chrome like `No Issues`, `Toggle linting overlays`) and `@camunda/linting` (element-type labels like `Group`, `Collapsed Sub Process`) — whose strings no package scan and no editor-only harvest can see. That blind spot once let eight labels ship English; the sync scrapes `bpmn-js-bpmnlint`'s `translate()` literals live and merges the confirmed `@camunda/linting` type labels (widen via `getTypeString()` enumeration).

The check compares those against the library's `dictionaries` (`apps/camunda-modeler-i18n-plugin/test/lib/locales.mjs` adapts them — it no longer AST-scrapes source files, and the library must be built first, which `npm run check:translations` handles). Three buckets, three severities: `missing` fails the build, `untranslated` is a ratchet against `apps/camunda-modeler-i18n-plugin/test/fixtures/translation-baseline.json`, and `unknown` (keys no source reports, in `known-runtime-keys.json`) is informational. `apps/camunda-modeler-i18n-plugin/docs/COVERAGE.md` is a committed, diffable snapshot; regenerate with `npm run check:translations:coverage`.

`supportedModeler` in `apps/camunda-modeler-i18n-plugin/package.json` names the tracked release. `npm run sync:modeler-deps` rewrites the camunda-* dev-deps (in `apps/camunda-modeler-i18n-plugin/package.json`) and the `overrides` block (in the **root** `package.json`) to match the Modeler's `client/package.json`. The `overrides` are load-bearing and live at the root because npm only honors them there.

When the check fails outside a pull request, `.github/actions/drift-issue` opens — or overwrites — a single `i18n-drift` issue. `upstream-drift.yml` runs the same check weekly against the _newest_ Modeler release. Note `untranslated` counts `value === key`, so a word legitimately identical in another language trips the ratchet — confirm the cause before running `npm run check:translations:baseline`.

## Guardrail tooling

Configured at the root: **ESLint** (`eslint.config.mjs`, flat config — typescript-eslint for the library, browser+JSX for the plugin client, Node globals for tooling/tests), **Prettier** (`.prettierrc.json`, `tabWidth` 4 to match the existing style), **knip** (`knip.json`, workspace-aware unused-code detection), **dependency-cruiser** (`.dependency-cruiser.cjs` — the library must stay a leaf: no dependency on the plugin, and no cycles), and **TypeScript** typecheck. `eslint-plugin-react` is intentionally absent (no ESLint 10 support yet); classic-runtime JSX relies on a `no-unused-vars` pattern that ignores capitalized (component / `React`) identifiers.

## Gotchas

- **Language state is a shared singleton, not prototype mutation.** The old `Translator.prototype.currentLanguage` bridge is gone. `I18nPlugin` calls `i18n.setLanguage(canonicalLocale(stored))` on config load and on change; the didi `TranslateModule` binds that same `i18n` instance into every editor. A language change still needs a modeler restart (bpmn-js re-invokes `translate()` only on re-render), which is why `ConfigModal` prompts it.
- **Legacy locale codes.** Older plugin versions persisted JS-identifier keys (`pt_br`, `nl_nl`, `zh_Hans`, `zh_Hant`); the library uses BCP-47 (`pt-br`, …). `canonicalLocale` in `client/bpmnjs-i18n-extension/index.js` maps the legacy keys so a previously saved selection keeps working. `apps/camunda-modeler-i18n-plugin/test/unit/locales.spec.mjs` guards it.
- **No duplicate keys / key parity / placeholders** are enforced in the library by `packages/translations/test/locales.spec.ts`. A key repeated across a locale's four files is silently shadowed by the barrel spread; the test keeps duplicates at zero.
- **`apps/camunda-modeler-i18n-plugin/dist/` is committed.** After changing plugin _or_ library source, run `npm run build` and commit the updated `dist/client.js` (webpack inlines the library into it). CI's `build` job rebuilds and fails on a stale `apps/camunda-modeler-i18n-plugin/dist/`. Reproducibility rests on the lockfile (which is why the transitive `@emotion` versions react-select pulls in are pinned there).
- **Node 24 everywhere.** Active LTS, pinned by `.nvmrc` and used by every workflow. No version matrix on purpose: the shipped bundle is webpack output running inside Electron, so a user's Node version never enters into it.

## Build & Deploy for Local Testing

1. `npm run build` (from the root).
2. Copy `apps/camunda-modeler-i18n-plugin/dist/` and `apps/camunda-modeler-i18n-plugin/index.js` into the Camunda Modeler plugins directory:
    - Windows: `%APPDATA%/camunda-modeler/resources/plugins/`
    - macOS: `~/Library/Application Support/camunda-modeler/resources/plugins/`
    - Linux: `~/.config/camunda-modeler/resources/plugins/`
3. Restart the modeler.

The E2E suite does the same automatically: plugin discovery globs `plugins/<name>/index.js` under `<appPath>/resources` and `<userData>/resources`, so pointing `--user-data-dir` at a temp directory gives a per-run install. Note `config.getForPlugin(name, key)` reads `config.plugins[name][key]` from `<userData>/config.json` — a nested object, not a dotted key.

## Release

`release-please` (root config + `.github/workflows/release-please.yml`) manages both packages via the node-workspace plugin: the library publishes to npm through OIDC trusted publishing (`--provenance`, skip-if-already-published), and the plugin's zip (`index.js` + `dist/`) is attached to its GitHub release. The node-workspace plugin keeps the plugin's dependency on the library in sync so workspace linking holds. Provisioning needed once: an npm trusted publisher for `@miragon/bpmn-modeler-i18n`, and `RELEASE_PLEASE_APP_CLIENT_ID` / `RELEASE_PLEASE_APP_PRIVATE_KEY`.

## Webpack Notes (`apps/camunda-modeler-i18n-plugin/webpack.config.js`)

- React is aliased to `camunda-modeler-plugin-helpers/vendor/react` (the modeler provides React at runtime).
- Babel with `@babel/preset-react` handles JSX transformation.
- Output mode is `development` with `cheap-module-source-map` devtool. The imported library is bundled in, so `dist/client.js` is self-contained.

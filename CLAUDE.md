# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Internationalization (i18n) plugin for Camunda Modeler 5.0+. Adds a language selector to the modeler toolbar and replaces UI strings in BPMN/DMN editors with translations. Built by Miragon GmbH, licensed Apache 2.0.

Supported languages (12): German, English, Spanish, French, Italian, Japanese, Korean, Portuguese (Brasil), Simplified Chinese, Traditional Chinese, Russian, Dutch.

Tracks Camunda Modeler `5.50.1` (`supportedModeler` in `package.json`).

## Build Commands

```bash
npm install          # Install dependencies
npm run build        # Webpack build → dist/client.js
npm run dev          # Webpack watch mode for development

npm test             # Fast + browserless: locale invariants, contract, drift

npx playwright install chromium   # once, for the two suites below
npm run test:integration     # Real bpmn-js/dmn-js in Chromium
npm run check:translations   # Drift report against the Modeler's UI strings
npm run harvest              # Record strings only visible while an editor runs
npm run sync:upstream-keys   # Refresh the vendored bpmn-js key list
npm run sync:modeler-deps    # Pin our libs to what the tracked Modeler ships

npm run e2e:setup            # Download the tracked Modeler release (~150 MB)
npm run test:e2e             # Drive the real Modeler with the plugin installed
```

No linting or formatting is configured.

## Testing

Everything lives under `test/`, with shared helpers in `test/lib/`:

- **`test/unit/`** — locale invariants: key parity across the 12 locales,
  `{placeholder}` preservation, the registry match between `translate.js` and
  `I18nPlugin.js`, barrel completeness, and a shrink-only ratchet on duplicate keys.
- **`test/contract/`** — the contract with the Modeler (jsdom). Loads the built
  `dist/client.js` with `window.react` / `window.components` stubbed and asserts it
  registers itself; renders `I18nPlugin` to pin the `tab-actions` slot, both editor
  subscriptions and the middleware shape.
- **`test/integration/`** — real editors in Chromium via Playwright. jsdom implements
  no SVG layout, which is why bpmn-js tests itself in a browser too. Own config, own
  script: `npm test` must stay runnable without a browser, or the CI build job would
  need Chromium too.
- **`test/e2e/`** — the real Camunda Modeler, driven through Playwright's Electron
  runner. Downloads the release named by `supportedModeler`, installs the plugin into
  a throwaway `--user-data-dir`, and asserts the palette and properties panel are
  actually translated. A second spec packs the same zip `release.yml` ships and
  installs *that*, so a packaging mistake fails here. Excluded from `npm test`
  (own config, `vitest.e2e.config.mjs`) and skipped when the Modeler is not cached.
- **`test/drift/`** — the translation drift check, plus the `harvest` and `sync` tools.

The contract layer earns its keep because the whole plugin API surface is three
globals, and plugin-helpers resolves them with `returnOrThrow(...)` at *module load
time* — so an upstream rename throws on import instead of in front of a user.

## Translation drift

Nothing here depends on bpmn-js or dmn-js, so a Modeler release that adds UI strings
produces no build error and no test failure. `test/drift/` closes that hole by
discovering what needs translating from three sources:

1. `bpmn-js/docs/translations.json` — the only published list, vendored under
   `test/fixtures/upstream/` so CI stays hermetic.
2. Static extraction of literal `translate('…')` arguments from `camunda-bpmn-js` and
   `camunda-dmn-js`, the aggregate bundles the Modeler actually loads.
3. **Runtime harvesting** (`npm run harvest`) — drives real editors in a browser and
   records every `translate()` call, the same way bpmn-js generates its own list.
   About a third of our keys are palette and create-menu labels built at runtime, so
   no static analysis can see them. Results land in
   `test/fixtures/upstream/harvested.json`.

Three buckets, three severities: `missing` fails the build, `untranslated` is a
ratchet against `test/fixtures/translation-baseline.json`, and `unknown` (keys no
source reports, listed in `test/fixtures/known-runtime-keys.json`) is informational.
`docs/COVERAGE.md` is a committed, diffable snapshot of the per-language state;
regenerate it with `npm run check:translations:coverage`.

Extraction only means something if it runs against the versions users actually
have. `supportedModeler` in `package.json` names the tracked release, and
`npm run sync:modeler-deps` rewrites the dependencies and the `overrides` block to
match its `client/package.json`. The `overrides` are load-bearing: without them npm
resolves newer transitive bpmn-js/properties-panel versions than the Modeler ships.

When the check fails outside a pull request, `.github/actions/drift-issue` opens — or
overwrites the body of — a single `i18n-drift` issue. `upstream-drift.yml` runs the
same check weekly against the *newest* Modeler release.

Note the `untranslated` metric counts `value === key`, so a word that is legitimately
identical in another language (e.g. "Collaboration" in French and Dutch) trips the
ratchet. Confirm the cause before running `npm run check:translations:baseline`.

## Architecture

This is a **Camunda Modeler client plugin**. The plugin entry point (`index.js` at root) declares the plugin name and points to the compiled bundle (`dist/client.js`). Webpack bundles `client/index.js` into that output.

### Key Components

- **`client/config/I18nPlugin.js`** — Main React component. Renders a language dropdown in the modeler toolbar. Subscribes to `bpmn.modeler.configure` and `dmn.modeler.configure` events to inject the translation module as middleware into each editor instance. Persists language selection via the modeler's `config.getForPlugin`/`setForPlugin` API under the key `"i18n"`.

- **`client/bpmnjs-i18n-extension/translate.js`** — Translation function. Receives a template string and optional replacements, looks up the translation in the current language's dictionary, and performs `{param}` interpolation. Logs missing translations to console.

- **`client/bpmnjs-i18n-extension/index.js`** — Creates a [didi](https://github.com/nickklaw/didi) module that registers the translator, enabling dependency injection into the modeler.

- **`client/config/ConfigModal.js`** — Modal prompting the user to restart the modeler after a language change.

### Translation Files

Each language lives in `client/bpmnjs-i18n-extension/languages/<locale>/` with four files:
- `bpmn-js.js` — BPMN modeling UI strings
- `dmn-js.js` — DMN modeling UI strings
- `properties-panel.js` — Properties panel UI strings
- `other.js` — Miscellaneous UI strings

A barrel file at `client/bpmnjs-i18n-extension/languages/<locale>.js` merges all four into a single export.

### Adding a New Language

1. Create a new folder under `client/bpmnjs-i18n-extension/languages/` with the locale code.
2. Add the four translation files (`bpmn-js.js`, `dmn-js.js`, `properties-panel.js`, `other.js`).
3. Create a barrel file at `client/bpmnjs-i18n-extension/languages/<locale>.js` that spreads all four exports.
4. Import the new language in `client/bpmnjs-i18n-extension/translate.js` and add it to the language map.
5. Add the language option (value/label) to the `options` array in `client/config/I18nPlugin.js`.

## Gotchas

- **Prototype mutation for language state:** The translator uses `Translator.prototype.currentLanguage` to communicate the selected language at runtime. `I18nPlugin` overwrites this prototype method when config loads. This is the mechanism that bridges React state to the didi-injected translator — don't refactor it away without replacing this coupling.
- **Locale key matching:** The language key in `translate.js`'s `languages` map must exactly match the `value` field in `I18nPlugin.js`'s `options` array (e.g., `pt_br` not `pt-br`, `nl_nl` not `nl-NL`). A mismatch now falls back to the default language — it used to reach `languages[undefined]` and throw on the first translated string, blanking the editor. `test/unit/locales.spec.mjs` asserts the two lists agree, so a mismatch fails CI rather than shipping.
- **No duplicate keys.** A key repeated across the four files of a locale is silently shadowed by the barrel spread, so the earlier translation becomes dead code. All locales are now at zero and `test/unit/locales.spec.mjs` ratchets that; six keys had genuinely differing shadowed wordings before the cleanup, and the winning value was kept in each case.
- **`dist/` is checked into git.** After making source changes, you must run `npm run build` and commit the updated `dist/client.js` bundle. CI enforces this: the `build` job rebuilds and fails if the committed bundle differs. Reproducibility rests on the lockfile, which is why the transitive `@emotion` versions react-select pulls in are pinned there — they used to float and changed the bundle. Node version does not affect the output (22 and 24 emit a byte-identical bundle, verified), so the job is not run as a matrix.
- **Node 24 everywhere.** Active LTS, pinned by `.nvmrc`, used by every workflow and by `release.yml` for the published artefact. Node 20 went end-of-life on 2026-04-30. There is no version matrix on purpose: the shipped bundle is webpack output running inside Electron, so a user's Node version never enters into it, and nothing here uses an API newer than `import.meta.dirname` (Node 20.11).

## Build & Deploy for Local Testing

1. `npm run build`
2. Copy `dist/` folder and `index.js` to the Camunda Modeler plugins directory:
   - Windows: `%APPDATA%/camunda-modeler/resources/plugins/`
   - macOS: `~/Library/Application Support/camunda-modeler/resources/plugins/`
   - Linux: `~/.config/camunda-modeler/resources/plugins/`
3. Restart the modeler.

The E2E suite does the same thing automatically: plugin discovery globs
`plugins/<name>/index.js` under `<appPath>/resources` and `<userData>/resources`, so
pointing `--user-data-dir` at a temp directory gives a per-run install. Note that
`config.getForPlugin(name, key)` reads `config.plugins[name][key]` from
`<userData>/config.json` — a nested object, not a dotted key.

## Webpack Notes

- React is aliased to `camunda-modeler-plugin-helpers/react` (the modeler provides React at runtime).
- Babel with `@babel/preset-react` handles JSX transformation.
- Output mode is `development` with `cheap-module-source-map` devtool.

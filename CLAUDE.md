# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Internationalization (i18n) plugin for Camunda Modeler 5.0+. Adds a language selector to the modeler toolbar and replaces UI strings in BPMN/DMN editors with translations. Built by Miragon GmbH, licensed Apache 2.0.

Supported languages: German, English, French, Portuguese (Brasil), Simplified Chinese, Traditional Chinese, Russian, Dutch.

## Build Commands

```bash
npm install          # Install dependencies
npm run build        # Webpack build → dist/client.js
npm run dev          # Webpack watch mode for development
```

There are no tests, linting, or formatting configured.

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
- **Locale key matching:** The language key in `translate.js`'s `languages` map must exactly match the `value` field in `I18nPlugin.js`'s `options` array (e.g., `pt_br` not `pt-br`, `nl_nl` not `nl-NL`). Mismatches silently fall back to English.
- **`dist/` is checked into git.** After making source changes, you must run `npm run build` and commit the updated `dist/client.js` bundle.

## Build & Deploy for Local Testing

1. `npm run build`
2. Copy `dist/` folder and `index.js` to the Camunda Modeler plugins directory:
   - Windows: `%APPDATA%/camunda-modeler/resources/plugins/`
   - macOS: `~/Library/Application Support/camunda-modeler/resources/plugins/`
   - Linux: `~/.config/camunda-modeler/resources/plugins/`
3. Restart the modeler.

## Webpack Notes

- React is aliased to `camunda-modeler-plugin-helpers/react` (the modeler provides React at runtime).
- Babel with `@babel/preset-react` handles JSX transformation.
- Output mode is `development` with `cheap-module-source-map` devtool.

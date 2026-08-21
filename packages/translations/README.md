# @miragon/bpmn-modeler-i18n

[![npm version](https://img.shields.io/npm/v/@miragon/bpmn-modeler-i18n.svg)](https://www.npmjs.com/package/@miragon/bpmn-modeler-i18n)
[![CI](https://github.com/Miragon/camunda-modeler-i18n-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/Miragon/camunda-modeler-i18n-plugin/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

Shared translations for the bpmn-js / dmn-js modeler UI — palette, context pad,
properties panel, and general strings — as a didi translate module with runtime
language switching. Ships 12 languages.

Framework-agnostic and consumed by the [Camunda Modeler i18n plugin](../../apps/camunda-modeler-i18n-plugin)
and the Miragon BPMN Modeler, but usable in any bpmn-js / dmn-js host.

Part of the [camunda-modeler-i18n-plugin](https://github.com/Miragon/camunda-modeler-i18n-plugin)
monorepo. Built by Miragon GmbH. Licensed MIT.

![A bpmn-js modeler UI translated to German](https://raw.githubusercontent.com/Miragon/camunda-modeler-i18n-plugin/develop/apps/camunda-modeler-i18n-plugin/img/screenshot.png)

## Install

```bash
npm install @miragon/bpmn-modeler-i18n
```

## Usage

Add `TranslateModule` to your modeler's `additionalModules`. It registers a
shared translator under the `translate` and `customTranslator` services that
bpmn-js / dmn-js call for every UI string.

```js
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { TranslateModule, i18n } from '@miragon/bpmn-modeler-i18n';

const modeler = new BpmnModeler({
    additionalModules: [TranslateModule],
});
```

Switch language at runtime with `i18n.setLanguage`. The next `translate()` call
uses the new dictionary immediately; refresh the diagram to re-render labels on
already-rendered elements.

```js
i18n.setLanguage('de');
```

Build a language picker from `supportedLanguages`:

```js
import { supportedLanguages, i18n } from '@miragon/bpmn-modeler-i18n';

for (const { locale, label } of supportedLanguages) {
    // render an <option value={locale}>{label}</option>, and on change:
    // i18n.setLanguage(locale)
}
```

UI that lives outside the modeler's DI container can subscribe to language
changes:

```js
const unsubscribe = i18n.onChange(() => {
    // re-render labels — i18n.getLocale() is the active locale
});
```

## Extend it with your own keys

A host can add keys this library deliberately does not ship — product-specific UI, engine-specific labels, internal diagnostics — or override a shared translation locally, without any of it living here. Call `i18n.extend` once at startup; consumer entries win on conflict, persist across `setLanguage`, and merge cumulatively.

```js
import { i18n } from '@miragon/bpmn-modeler-i18n';

i18n.extend({
    en: { 'failed to import {element}': 'failed to import {element}' },
    de: { 'failed to import {element}': 'Import von {element} fehlgeschlagen' },
});
```

## API

Everything is exported from the package root:

| Export               | Kind        | Description                                                                                                                                       |
| -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TranslateModule`    | didi module | Binds the shared `i18n` instance as the modeler's `customTranslator` / `translate` services. Add to `additionalModules`.                          |
| `CustomTranslator`   | class       | The translator implementation: `translate(template, replacements?)`, `setLanguage(locale)`, `getLocale()`, `onChange(listener)`, `extend(extra)`. |
| `i18n`               | instance    | Shared `CustomTranslator` singleton used by `TranslateModule`. Call `setLanguage` on it to switch language.                                       |
| `supportedLanguages` | array       | `readonly LanguageEntry[]` in dropdown order — `{ label, locale, dictionary }`.                                                                   |
| `dictionaries`       | object      | `Record<SupportedLocale, Record<string, string>>` — locale code → merged dictionary.                                                              |
| `SupportedLocale`    | type        | Union of the supported BCP-47 locale codes.                                                                                                       |
| `LanguageEntry`      | type        | `{ label, locale, dictionary }` metadata for one language.                                                                                        |

## Supported locales

| Locale    | Label                    |
| --------- | ------------------------ |
| `de`      | Deutsch                  |
| `en`      | English                  |
| `es`      | Español                  |
| `fr`      | Français                 |
| `it`      | Italiano                 |
| `pt-br`   | Português (Brasil)       |
| `zh-Hans` | 简体中文                 |
| `zh-Hant` | 繁体中文                 |
| `ru`      | Русский                  |
| `nl-nl`   | Nederlands (Netherlands) |
| `ja`      | 日本語                   |
| `ko`      | 한국어                   |

## How translations work

Each dictionary maps the **English source string** (the key bpmn-js / dmn-js
passes to `translate()`) to its localized value. `{placeholder}` tokens in the
source must be preserved in the translation — they are substituted at runtime
from the `replacements` argument, and any unresolved placeholder is left as
`{key}`. When a key is missing in the active language, the translator falls back
to the English source string, so an incomplete translation degrades gracefully
rather than blanking the UI.

Translations are machine-assisted and use the German (`de`) translation as the
authoritative base. Native-speaker corrections are very welcome — open a PR or an
issue against the monorepo.

## License

MIT — Copyright (c) 2026 Miragon GmbH.

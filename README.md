# Camunda Modeler i18n

[![npm version](https://img.shields.io/npm/v/@miragon/bpmn-modeler-i18n.svg)](https://www.npmjs.com/package/@miragon/bpmn-modeler-i18n)
[![CI](https://github.com/Miragon/camunda-modeler-i18n-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/Miragon/camunda-modeler-i18n-plugin/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-12-informational.svg)](packages/translations/README.md#supported-locales)

**Speak your language in the Camunda Modeler.** A plugin that adds a language selector to the toolbar and translates the bpmn-js / dmn-js editor UI — palette, context pad, properties panel, and general strings — into 12 languages, switchable on the fly. It's built on a shared, npm-published translations library, and both live in this monorepo.

![The Camunda Modeler with the i18n plugin, its UI translated to German](apps/camunda-modeler-i18n-plugin/img/screenshot.png)

## Install the plugin

Grab the latest [release zip](https://github.com/Miragon/camunda-modeler-i18n-plugin/releases/latest), unzip it into your Camunda Modeler's `resources/plugins/` folder, and restart — a language dropdown appears in the toolbar. Per-OS steps are in the [plugin README](apps/camunda-modeler-i18n-plugin/README.md).

> **Modeling outside the Camunda Modeler?** Miragon also builds the **[Miragon BPMN Modeler](https://miragon.github.io/bpmn-modeler/)** — a BPMN/DMN modeler for VS Code and the browser (Camunda 7 & 8, Operaton, CIB seven), and a second home for these translations. A capable, open alternative when you'd rather model where your code already lives.

## Why

The bpmn-js / dmn-js UI is English out of the box, and every product that embeds it ends up re-translating the same palette and properties-panel strings. Maintaining that per product is wasted effort and a slow drift into inconsistent BPMN/DMN wording — and because an editor depends on none of the libraries whose strings it shows, a Modeler release that adds UI text produces no error anywhere until a user hits an untranslated label.

This repo fixes both:

- **One source of truth** — 12 languages, maintained once in `@miragon/bpmn-modeler-i18n` and consumed by the Camunda Modeler plugin, the Miragon BPMN Modeler, and any bpmn-js / dmn-js host. No more copy-pasted dictionaries drifting apart.
- **Drift-proof** — the build discovers what the Modeler asks to translate (published lists + static extraction + runtime harvesting) and fails when a string has no translation, so new UI text can't ship untranslated.
- **Consistent** — the same term for the same BPMN/DMN concept everywhere, guarded by key-parity and placeholder checks across all 12 locales.
- **Easy to extend** — a new language is a folder of files plus one registry entry; the German base and the `/i18n-translate` skill generate a first pass for native speakers to refine.

## Packages

| Package                                               | Path                                                                    | Description                                                                                                                           |
| ----------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [`@miragon/bpmn-modeler-i18n`](packages/translations) | `packages/translations/`                                                | Shared bpmn-js / dmn-js UI translations plus a didi translate module. TypeScript, published to npm.                                   |
| Camunda Modeler i18n plugin                           | [`apps/camunda-modeler-i18n-plugin/`](apps/camunda-modeler-i18n-plugin) | The Camunda Modeler client plugin. Adds a language selector to the toolbar and consumes the library. Shipped as a GitHub release zip. |

The plugin depends on the library; the library stands alone and can be consumed
by any bpmn-js / dmn-js host (see [Consuming the library](#consuming-the-library)).

## Consuming the library

Any bpmn-js / dmn-js host can use `@miragon/bpmn-modeler-i18n` directly:

```bash
npm install @miragon/bpmn-modeler-i18n
```

```js
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { TranslateModule, i18n, supportedLanguages } from '@miragon/bpmn-modeler-i18n';

const modeler = new BpmnModeler({
    additionalModules: [TranslateModule],
});

// Switch language at runtime (refresh the diagram to re-render existing labels).
i18n.setLanguage('de');

// Build a language picker from the registry.
supportedLanguages.forEach(({ locale, label }) => {
    // …render an option for each { locale, label }
});
```

## Contributing

Contributions are very welcome — especially **new languages and native-speaker corrections**, the most valuable thing you can send. Adding a language, the setup and quality gate, the monorepo layout, and the release flow all live in [CONTRIBUTING.md](CONTRIBUTING.md). In short: `npm ci && npm run build && npm test`, Node >= 24, and Conventional-Commit PR titles.

## License

MIT — Copyright (c) 2026 Miragon GmbH. See [LICENSE](LICENSE).

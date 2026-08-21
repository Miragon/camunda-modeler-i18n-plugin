# Camunda Modeler I18N-Plugin

[![Compatible with Camunda Modeler version 5.0](https://img.shields.io/badge/Camunda%20Modeler-5.0+-blue.svg)](https://github.com/camunda/camunda-modeler)
[![CI](https://github.com/Miragon/camunda-modeler-i18n-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/Miragon/camunda-modeler-i18n-plugin/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

This plugin allows you to translate the UI of the Camunda Modeler. It ships 12 languages - German, English, Spanish, French, Italian, Japanese, Korean, Portuguese (Brasil), Russian, Chinese (Simplified and Traditional) and Dutch - and can be easily extended or customized.

For more information see our blog post (in German): [Internationalization Plugin für den Camunda Modeler](https://www.miragon.io/blog/internationalization-plugin-fur-den-camunda-modeler/)

See it in action:

![Screenshot of Camunda Modeler in German](img/screenshot.png)

## Installation

To use this plugin in your installation, follow these simple steps:

1. Click on releases
2. Download the latest release artifact
3. Extract and move it to the following folder depending on your OS:
    1. Windows: %APPDATA%/camunda-modeler/resources/plugins
    2. Linux: ~/.config/camunda-modeler/resources/plugins
    3. macOS: ~/Library/Application Support/camunda-modeler/resources/plugins
4. Restart the modeler
5. Click on the language dropdown in the toolbar and select the language of your choice, then restart the modeler for the changes to take effect

> Hint: If it does not work for you, make sure you have the correct folder structure:
>
> ```
> camunda-modeler
> └─ resources
>    └─ plugins
>       └─ i18n (or whatever the folder is called)
>          ├─ index.js
>          └─ dist
> ```
>
> The `resources` folder is required — the modeler only searches for
> `plugins/*/index.js` underneath it.

## Development

If you want to extend the plugin or provide custom translations or languages, you'll need a working installation of Node.js and a package manager like NPM or yarn. We use NPM in all our examples. Follow these steps:

### Setup

Check the repository out and install all dependencies by using the command `npm install`. You can use any IDE of your choice such as IntelliJ or Visual Studio Code. Every file contains comments that should help you get started.

### Tests

```bash
npm test                     # locale invariants + plugin contract, no modeler needed
npm run check:translations   # report UI strings the Modeler asks for but we do not translate
```

```bash
npx playwright install chromium   # once, for the two suites below
npm run test:integration     # real bpmn-js/dmn-js in a browser
npm run harvest              # re-record the strings the editors ask for

npm run e2e:setup            # download the Camunda Modeler release (~150 MB)
npm run test:e2e             # install the plugin into a real Modeler and check the UI
```

`npm test` covers three things: that all 12 locales stay in sync (same keys, same
`{placeholder}` interpolation), that the built bundle still satisfies the Modeler's plugin
contract, and that we translate every string the Modeler asks for. The contract tests are
what catch a breaking change in `camunda-modeler-plugin-helpers` before a release does.

`npm run check:translations` compares our dictionaries against three sources: the key list
bpmn-js publishes, literal `translate()` calls extracted from the bundles the Modeler loads,
and the strings recorded by `npm run harvest` while driving real editors. The last one matters
because roughly a third of the labels — palette entries, create menus — are built at runtime
and no static analysis can find them.

A weekly workflow reruns all of this against the newest Modeler release and opens (or updates)
a single issue when new strings appear.

### Manual testing in the modeler

To test it, build the plugin by using the command `npm run build`. Copy the following files into the "plugins/i18n" directory (for more see section Installation above):

- `index.js`
- `dist/`

Then restart the modeler to see all changes in effect. If you just changed the translations, opening the devtools via `F12` and pressing `Ctrl-R` or `Cmd+R` is usually enough to reload the plugin. If you changed the menu, you have to restart the modeler, though.

## Add a new language

Translations now live in the shared library, [`@miragon/bpmn-modeler-i18n`](../../packages/translations). Add a locale folder under `packages/translations/src/languages/` and register it once in the library's registry — this plugin builds its dropdown from the library, so it picks the language up automatically with no plugin changes. The step-by-step is in the monorepo [contributing guide](../../CONTRIBUTING.md#adding-or-fixing-a-language); contributions that add a language or improve an existing translation are very welcome.

## Engage with the Miragon team

If you have any questions or need support, feel free to reach out to us via email ([info@miragon.io](mailto:info@miragon.io)).
We are here to help you, especially if you are considering introducing camunda-modeler-i18n-plugin in your organization.

For inquiries and professional support, please contact us at: [info@miragon.io](mailto:info@miragon.io)

## License

MIT — Copyright (c) 2026 Miragon GmbH.

See the [LICENSE](LICENSE) file for the full license text.

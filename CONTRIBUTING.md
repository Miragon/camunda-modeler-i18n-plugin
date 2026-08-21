# Contributing

Thanks for your interest in this project! Contributions of all kinds are welcome — bug reports, new languages, translation fixes, docs and code. A new language or a native-speaker correction is one of the most valuable things you can send.

## Getting started

```bash
git clone https://github.com/Miragon/camunda-modeler-i18n-plugin.git
cd camunda-modeler-i18n-plugin
npm ci
npm run build
npm test
```

This is an npm-workspaces monorepo (Node >= 24, pinned by `.nvmrc`). All commands run from the repo root; the root scripts delegate to the workspaces and build the library before anything that consumes it. Two workspaces:

- `packages/translations/` — the shared library `@miragon/bpmn-modeler-i18n` (TypeScript, published to npm). Holds the translation data and the runtime translator.
- `apps/camunda-modeler-i18n-plugin/` — the Camunda Modeler plugin (JavaScript, webpack). Consumes the library and ships as a GitHub release zip.

## Scripts (the quality gate)

```bash
npm run build              # build the library, then the plugin bundle → apps/camunda-modeler-i18n-plugin/dist/client.js
npm run dev                # webpack watch mode for the plugin
npm test                   # locale invariants, translator, plugin contract, drift — no browser needed
npm run lint               # ESLint across the monorepo
npm run typecheck          # tsc --noEmit for the library
npm run format:check       # Prettier, check only (npm run format to write)
npm run knip               # unused files, exports and dependencies
npm run depcruise          # dependency-graph architecture rules
npm run check:translations # report Modeler UI strings we do not yet translate
```

The browser-backed suites need one-time setup and are excluded from `npm test`:

```bash
npx playwright install chromium   # once, for the integration suite
npm run test:integration          # real bpmn-js / dmn-js in Chromium
npm run e2e:setup                 # download the tracked Modeler release (~150 MB)
npm run test:e2e                  # install the plugin into a real Modeler and check the UI
```

Drift-maintenance tooling (run when a Modeler release changes):

```bash
npm run harvest             # record strings only visible while an editor runs
npm run sync:upstream-keys  # refresh the vendored bpmn-js key list
npm run sync:modeler-deps   # pin our libs to what the tracked Modeler ships
```

## How the monorepo is laid out

```
package.json            # private workspace root: scripts, dev tooling, `overrides` (npm honors these only at root)
tsconfig.base.json, eslint.config.mjs, .prettierrc.json, knip.json, .dependency-cruiser.cjs
release-please-config.json, .release-please-manifest.json
packages/translations/  # @miragon/bpmn-modeler-i18n (tsc → dist, gitignored)
  src/index.ts                       public API
  src/TranslateModule.ts             CustomTranslator + i18n singleton + didi TranslateModule
  src/languages/index.ts             registry: SupportedLocale, supportedLanguages, dictionaries
  src/languages/<locale>/*.ts        the translation data (4 files + an index.ts barrel per locale)
  test/                              locale invariants + translator behavior
apps/camunda-modeler-i18n-plugin/    # the Camunda Modeler plugin
  index.js, webpack.config.js, dist/ (COMMITTED)
  client/                            React UI + the bpmnjs-i18n-extension seam onto the library
  test/{unit,contract,integration,e2e,drift,lib}
```

One boundary is enforced by `npm run depcruise` and matters more than it looks: the **translations library must stay a leaf** — the plugin depends on it, never the reverse — and there must be no dependency cycles. `npm run knip` covers what dependency-cruiser structurally cannot: it works per **export**, so it catches a helper exported but imported nowhere, plus unused dependencies in `package.json`.

## Adding or fixing a language

Languages live in the library. The German (`de`) translation is the authoritative base, and the `/i18n-translate` skill can generate a full first pass from it for a native speaker to refine.

1. **Data files.** Add `packages/translations/src/languages/<locale>/` (BCP-47 code, e.g. `pt-br`) with `bpmn-js.ts`, `dmn-js.ts`, `properties-panel.ts`, `other.ts`, and an `index.ts` barrel that spreads the four.
2. **Register it.** Add the locale to `packages/translations/src/languages/index.ts`: the `SupportedLocale` union, the `supportedLanguages` array (with its native label), and the `dictionaries` map. The plugin's dropdown picks it up automatically.
3. **Keep it consistent.** Every locale must cover the same keys as the English reference, preserve `{placeholder}` tokens, and have no duplicate keys — `packages/translations/test/locales.spec.ts` enforces all three. Run `npm test`.

Fixing an existing translation is just editing the value in the relevant `<locale>/*.ts` file. The key is the English source string; don't change it.

## Ground rules

- **Conventional Commits.** Commit messages and PR titles follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). Releases and changelogs are generated from them via [release-please](https://github.com/googleapis/release-please), and a CI check validates PR titles.
- **Exact dependency versions.** No `^`, no `~`. `.npmrc` sets `save-exact=true` and CI verifies it — a floating transitive bump must never be able to change the strings the drift check extracts.
- **Commit the plugin bundle.** After changing plugin _or_ library source, run `npm run build` and commit the updated `apps/camunda-modeler-i18n-plugin/dist/`. CI fails on a stale bundle, because that `dist/` is what a user copies into their plugins folder.

## Before opening a PR

```bash
npm run lint
npm run typecheck
npm run format:check
npm run knip
npm run depcruise
npm test
npm run build   # then commit dist/ if it changed
```

## The release flow

Releases are automated with release-please, managing both packages:

1. Merge PRs with Conventional-Commit titles into `develop`.
2. release-please opens (and keeps updating) a release PR that bumps versions and the changelogs from the accumulated commits.
3. Merging it tags the releases and triggers publishing: the library goes to npm via OIDC trusted publishing (tokenless, with provenance), and the plugin's zip is attached to its GitHub release. No manual `npm publish`, no `NPM_TOKEN`.

## Reporting bugs

Use the GitHub issue templates (feat / fix / refactor). For a wrong or missing translation, include the **locale** and the exact **English source string** — that's the fastest path to a fix. To report a string the Modeler shows untranslated, `npm run check:translations` names it.

/**
 * Discovers which UI strings the Camunda Modeler asks us to translate.
 *
 * Four sources, descending authority: the list bpmn-js publishes (vendored as a
 * fixture), literal `translate()` arguments extracted from the bundles the
 * Modeler loads, keys harvested at runtime by `test/drift/harvest.mjs`, and the
 * Modeler's application-shell strings (`bpmn-js-bpmnlint` panel chrome and
 * `@camunda/linting` element-type labels), vendored by `test/drift/sync-app-shell.mjs`.
 *
 * The app-shell source exists because the first three only ever observe the
 * editor bundle (`camunda-bpmn-js` / `camunda-dmn-js`). The Modeler wires a
 * linting layer *on top* of that bundle, so its strings are invisible to package
 * scanning and to a harvest that drives the editor alone — that blind spot let
 * eight labels ship untranslated. Vendoring keeps the check offline.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import {
    APP_SHELL_FIXTURE,
    HARVESTED_FIXTURE,
    PLUGIN_ROOT,
    PUBLISHED_FIXTURE,
    WORKSPACE_ROOT,
} from './paths.mjs';
import { listJsFiles } from './utils/listJsFiles.mjs';
import { readJson } from './utils/readJson.mjs';
import { unquoteJsLiteral } from './utils/unquoteJsLiteral.mjs';

const require = createRequire(import.meta.url);

// npm workspaces hoist most dependencies to the repo-root node_modules, but a
// version conflict can leave one nested under apps/camunda-modeler-i18n-plugin. Resolve via Node's
// algorithm (which walks both) and fall back to the two candidate roots.
const NODE_MODULES_ROOTS = [PLUGIN_ROOT, WORKSPACE_ROOT];

// The two camunda-* aggregates re-bundle bpmn-js, dmn-js, both properties panels
// and the element templates, so they subsume the rest of this list.
const SCAN_PACKAGES = [
    'camunda-bpmn-js',
    'camunda-dmn-js',
    'bpmn-js',
    'dmn-js',
    'bpmn-js-properties-panel',
    'dmn-js-properties-panel',
    '@bpmn-io/properties-panel',
    'bpmn-js-element-templates',
];

// The lookbehind rejects `transform: 'translate(' + x` from SVG plumbing and
// method calls like `canvas.translate(...)`.
const TRANSLATE_LITERAL = /(?<!['"`.])\btranslate\(\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g;
const TRANSLATE_DYNAMIC = /(?<!['"`.])\btranslate\(\s*(?:`|[A-Za-z_$][\w$]*\s*[,)])/g;

// JSDoc documents the translate stub with a worked example that would otherwise
// be extracted as a real UI string.
const JSDOC_BLOCK = /\/\*\*[\s\S]*?\*\//g;

export default class UpstreamKeyCollector {
    /**
     * The union of everything discoverable, mapped to the source that first
     * reported it.
     *
     * @return {{ keys: Map<String, String>, skipped: String[], dynamic: Number }}
     */
    collect() {
        const keys = new Map();

        const add = (source, list) => {
            for (const key of list) {
                if (!keys.has(key)) {
                    keys.set(key, source);
                }
            }
        };

        add('bpmn-js (published)', readJson(PUBLISHED_FIXTURE, []));
        add('runtime harvest', readJson(HARVESTED_FIXTURE, null)?.keys ?? []);
        add('app shell (vendored)', readJson(APP_SHELL_FIXTURE, []));

        const { bySource, skipped, dynamic } = this.#extractInstalledKeys();

        for (const [pkg, list] of Object.entries(bySource)) {
            add(pkg, list);
        }

        return { keys, skipped, dynamic };
    }

    /** Scans installed packages for literal `translate()` arguments. */
    #extractInstalledKeys() {
        const bySource = {};
        const skipped = [];
        let dynamic = 0;

        for (const pkg of SCAN_PACKAGES) {
            const dir = this.#packageDir(pkg);

            if (!dir) {
                skipped.push(pkg);
                continue;
            }

            const keys = new Set();

            for (const file of listJsFiles(dir)) {
                const src = fs.readFileSync(file, 'utf8').replace(JSDOC_BLOCK, '');

                for (const match of src.matchAll(TRANSLATE_LITERAL)) {
                    const key = unquoteJsLiteral(match[1]);

                    if (key === null) {
                        continue;
                    }

                    // A literal that is only the prefix of a key computed at runtime,
                    // e.g. `translate('Align elements ' + alignment)`.
                    if (/^\s*\+/.test(src.slice(match.index + match[0].length))) {
                        dynamic++;
                        continue;
                    }

                    keys.add(key);
                }

                dynamic += [...src.matchAll(TRANSLATE_DYNAMIC)].length;
            }

            bySource[pkg] = [...keys].sort();
        }

        return { bySource, skipped, dynamic };
    }

    #packageDir(pkg) {
        try {
            return path.dirname(require.resolve(`${pkg}/package.json`));
        } catch {
            for (const root of NODE_MODULES_ROOTS) {
                const dir = path.join(root, 'node_modules', pkg);
                if (fs.existsSync(dir)) {
                    return dir;
                }
            }
            return null;
        }
    }
}

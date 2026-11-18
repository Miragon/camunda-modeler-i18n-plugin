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
import { scanTranslateCalls } from './utils/scanTranslateCalls.mjs';

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
                const found = scanTranslateCalls(fs.readFileSync(file, 'utf8'));

                found.keys.forEach((key) => keys.add(key));
                dynamic += found.dynamic;
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

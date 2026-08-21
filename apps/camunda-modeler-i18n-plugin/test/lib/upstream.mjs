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

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const FIXTURES = path.join(ROOT, 'test', 'fixtures');

const require = createRequire(import.meta.url);

// npm workspaces hoist most dependencies to the repo-root node_modules, but a
// version conflict can leave one nested under apps/camunda-modeler-i18n-plugin. Resolve via Node's
// algorithm (which walks both) and fall back to the two candidate roots.
const NODE_MODULES_ROOTS = [ROOT, path.resolve(ROOT, '..', '..')];

function packageDir(pkg) {
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

export const PUBLISHED_FIXTURE = path.join(FIXTURES, 'upstream', 'bpmn-js.translations.json');
export const HARVESTED_FIXTURE = path.join(FIXTURES, 'upstream', 'harvested.json');
export const APP_SHELL_FIXTURE = path.join(FIXTURES, 'upstream', 'app-shell.keys.json');

// The two camunda-* aggregates re-bundle bpmn-js, dmn-js, both properties panels
// and the element templates, so they subsume the rest of this list.
export const SCAN_PACKAGES = [
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

function unquote(literal) {
    try {
        if (literal.startsWith('"')) {
            return JSON.parse(literal);
        }
        return JSON.parse(
            '"' + literal.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"') + '"',
        );
    } catch {
        return null;
    }
}

function walkJs(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules') {
                walkJs(full, out);
            }
        } else if (entry.name.endsWith('.js') && !entry.name.endsWith('.min.js')) {
            out.push(full);
        }
    }
    return out;
}

const readJsonArray = (file) =>
    fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];

export const publishedKeys = () => readJsonArray(PUBLISHED_FIXTURE);

/** Keys recorded while a real editor was running; see `npm run harvest`. */
export const harvestedKeys = () => {
    const data = fs.existsSync(HARVESTED_FIXTURE)
        ? JSON.parse(fs.readFileSync(HARVESTED_FIXTURE, 'utf8'))
        : null;

    return data?.keys ?? [];
};

/** Modeler application-shell strings; see `npm run sync:app-shell-keys`. */
export const appShellKeys = () => readJsonArray(APP_SHELL_FIXTURE);

/** Scans installed packages for literal `translate()` arguments. */
export function extractedKeys(packages = SCAN_PACKAGES) {
    const bySource = {};
    const skipped = [];
    let dynamic = 0;

    for (const pkg of packages) {
        const dir = packageDir(pkg);

        if (!dir) {
            skipped.push(pkg);
            continue;
        }

        const keys = new Set();

        for (const file of walkJs(dir)) {
            const src = fs.readFileSync(file, 'utf8').replace(JSDOC_BLOCK, '');

            for (const match of src.matchAll(TRANSLATE_LITERAL)) {
                const key = unquote(match[1]);

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

/**
 * The union of everything discoverable, mapped to the source that first
 * reported it.
 *
 * @return {{ keys: Map<String, String>, skipped: String[], dynamic: Number }}
 */
export function collectUpstreamKeys({ packages } = {}) {
    const keys = new Map();

    const add = (source, list) => {
        for (const key of list) {
            if (!keys.has(key)) {
                keys.set(key, source);
            }
        }
    };

    add('bpmn-js (published)', publishedKeys());
    add('runtime harvest', harvestedKeys());
    add('app shell (vendored)', appShellKeys());

    const { bySource, skipped, dynamic } = extractedKeys(packages);

    for (const [pkg, list] of Object.entries(bySource)) {
        add(pkg, list);
    }

    return { keys, skipped, dynamic };
}

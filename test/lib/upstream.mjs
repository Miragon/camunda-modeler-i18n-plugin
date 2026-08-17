/**
 * Discovers which UI strings the Camunda Modeler asks us to translate.
 *
 * Three sources, descending authority: the list bpmn-js publishes (vendored as a
 * fixture), literal `translate()` arguments extracted from the bundles the
 * Modeler loads, and keys harvested at runtime by `test/drift/harvest.mjs`.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const FIXTURES = path.join(ROOT, 'test', 'fixtures');

export const PUBLISHED_FIXTURE = path.join(FIXTURES, 'upstream', 'bpmn-js.translations.json');
export const HARVESTED_FIXTURE = path.join(FIXTURES, 'upstream', 'harvested.json');

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
    'bpmn-js-element-templates'
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
        return JSON.parse('"' + literal.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"') + '"');
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

const readJsonArray = file =>
    fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];

export const publishedKeys = () => readJsonArray(PUBLISHED_FIXTURE);

/** Keys recorded while a real editor was running; see `npm run harvest`. */
export const harvestedKeys = () => {
    const data = fs.existsSync(HARVESTED_FIXTURE)
        ? JSON.parse(fs.readFileSync(HARVESTED_FIXTURE, 'utf8'))
        : null;

    return data?.keys ?? [];
};

/** Scans installed packages for literal `translate()` arguments. */
export function extractedKeys(packages = SCAN_PACKAGES) {
    const bySource = {};
    const skipped = [];
    let dynamic = 0;

    for (const pkg of packages) {
        const dir = path.join(ROOT, 'node_modules', pkg);

        if (!fs.existsSync(dir)) {
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

            dynamic += [ ...src.matchAll(TRANSLATE_DYNAMIC) ].length;
        }

        bySource[pkg] = [ ...keys ].sort();
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

    const { bySource, skipped, dynamic } = extractedKeys(packages);

    for (const [ pkg, list ] of Object.entries(bySource)) {
        add(pkg, list);
    }

    return { keys, skipped, dynamic };
}

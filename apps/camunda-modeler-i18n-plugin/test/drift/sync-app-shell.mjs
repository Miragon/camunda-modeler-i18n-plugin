#!/usr/bin/env node
/**
 * Refreshes the vendored Modeler application-shell key list.
 *
 * The drift check's other sources (bpmn-js's published list, static extraction
 * of `camunda-bpmn-js` / `camunda-dmn-js`, and the runtime harvest) all observe
 * only the *editor bundle*. The Camunda Modeler wires a linting layer on top of
 * that bundle, and its strings are invisible to every one of them — which is how
 * eight labels once shipped untranslated. This vendors that layer so the check
 * treats a new app-shell string the library lacks as `missing`, not silence.
 *
 * Two contributors:
 *   1. `bpmn-js-bpmnlint` — the linting panel chrome. Fetched from the pinned
 *      upstream and scraped for literal `translate()` arguments (fully automatic).
 *   2. `@camunda/linting` — element-type labels produced by `getTypeString()`
 *      (e.g. "Group", "Collapsed Sub Process"). Not `translate()`-wrapped in that
 *      package; the Modeler wraps them. The confirmed set is listed below; to
 *      widen it to the full enumeration, run `getTypeString()` over every
 *      `bpmn:*` type (add `@camunda/linting` as a dev-dep) and merge the result.
 *
 * Vendored, not fetched at check time, so pull-request runs stay offline.
 *
 *   --check   compare against the committed fixture, write nothing
 */

import fs from 'node:fs';
import path from 'node:path';

import { APP_SHELL_FIXTURE } from '../lib/upstream.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const checkOnly = process.argv.includes('--check');

// The linting panel's own strings. Scraped live so a new one can't slip in
// unnoticed the way "Toggle linting overlays" / "No Issues" once did. Read from
// source (raw GitHub) rather than the npm tarball, which ships only a bundle;
// `--ref` overrides the default branch to pin a release.
const BPMNLINT_REF = (() => {
    const i = process.argv.indexOf('--ref');
    return i === -1 ? 'main' : process.argv[i + 1];
})();
const BPMNLINT_SOURCES = [
    `https://raw.githubusercontent.com/bpmn-io/bpmn-js-bpmnlint/${BPMNLINT_REF}/lib/Linting.js`,
    `https://raw.githubusercontent.com/bpmn-io/bpmn-js-bpmnlint/${BPMNLINT_REF}/lib/Overlays.js`,
];

// `@camunda/linting` element-type labels the Modeler passes through translate().
// Confirmed rendered set; extend via getTypeString() enumeration (see header).
const CAMUNDA_LINTING_TYPE_LABELS = [
    'Collapsed Sub Process',
    'Group',
    'Intermediate Catch Event',
    'Process',
    'Text Annotation',
];

// `translate(` and `this._translate(`. bpmn-js-bpmnlint picks the label with a
// ternary — `_translate(cond ? 'A' : 'B', {…})` — so capture *every* string
// literal inside the call's argument list, not just the first.
const TRANSLATE_CALL = /_?translate\(/g;

function extractTranslateStrings(src) {
    const keys = new Set();
    for (const call of src.matchAll(TRANSLATE_CALL)) {
        let i = call.index + call[0].length;
        let depth = 1;
        while (i < src.length && depth > 0) {
            const c = src[i];
            if (c === '(') {
                depth++;
            } else if (c === ')') {
                depth--;
            } else if (c === "'" || c === '"') {
                let j = i + 1;
                let s = '';
                while (j < src.length && src[j] !== c) {
                    if (src[j] === '\\') {
                        s += src[j + 1];
                        j += 2;
                    } else {
                        s += src[j++];
                    }
                }
                if (s.trim()) keys.add(s);
                i = j;
            }
            i++;
        }
    }
    return [...keys];
}

async function get(url) {
    const response = await fetch(url, {
        headers: { 'user-agent': 'camunda-modeler-i18n-plugin' },
    });
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} for ${url}`);
    }
    return response.text();
}

async function bpmnlintKeys() {
    const keys = new Set();
    for (const url of BPMNLINT_SOURCES) {
        let src;
        try {
            src = await get(url);
        } catch (error) {
            // Overlays.js may not exist in every release; only Linting.js is required.
            if (url.endsWith('Linting.js')) throw error;
            console.warn(`  (skipped ${url}: ${error.message})`);
            continue;
        }
        for (const key of extractTranslateStrings(src)) {
            keys.add(key);
        }
    }
    return [...keys];
}

const scraped = await bpmnlintKeys();
console.log(`bpmn-js-bpmnlint: ${scraped.length} translate() strings scraped.`);

const keys = [...new Set([...scraped, ...CAMUNDA_LINTING_TYPE_LABELS])].sort((a, b) =>
    a.localeCompare(b),
);

const current = fs.existsSync(APP_SHELL_FIXTURE)
    ? JSON.parse(fs.readFileSync(APP_SHELL_FIXTURE, 'utf8'))
    : [];

const added = keys.filter((k) => !current.includes(k));
const removed = current.filter((k) => !keys.includes(k));

console.log(`\napp-shell keys: ${keys.length} (vendored: ${current.length})`);
if (added.length) {
    console.log(`\n  new (${added.length}):`);
    added.forEach((k) => console.log(`    ${JSON.stringify(k)}`));
}
if (removed.length) {
    console.log(`\n  no longer reported (${removed.length}):`);
    removed.forEach((k) => console.log(`    ${JSON.stringify(k)}`));
}
if (!added.length && !removed.length) {
    console.log('  up to date');
}

if (checkOnly) {
    process.exit(added.length || removed.length ? 1 : 0);
}

fs.writeFileSync(APP_SHELL_FIXTURE, JSON.stringify(keys, null, 4) + '\n');
console.log(`\nWrote ${path.relative(ROOT, APP_SHELL_FIXTURE)}`);

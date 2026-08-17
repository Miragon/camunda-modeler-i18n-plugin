#!/usr/bin/env node
/**
 * Records the strings real editors ask to translate and writes them to
 * `test/fixtures/upstream/harvested.json`, where the drift check picks them up.
 *
 * A real browser is required: bpmn-js needs SVG layout that jsdom does not
 * implement, which is why bpmn-js itself harvests through Karma.
 *
 *   --check   compare against the committed fixture, write nothing
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { runInBrowser } from '../lib/browser.mjs';
import { HARVESTED_FIXTURE } from '../lib/upstream.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const ENTRY = 'test/integration/harvest-entry.js';

const checkOnly = process.argv.includes('--check');

const result = await runInBrowser(ENTRY, 'window.__harvest()');

if (!result.ok) {
    console.error(`Harvest failed: ${result.error}\n${result.stack ?? ''}`);
    process.exit(1);
}

const keys = result.keys;

console.log(`Harvested ${keys.length} keys from a real editor.`);

if (result.failures.length) {
    console.log(`\n  ${result.failures.length} provider(s) could not be walked:`);
    result.failures.slice(0, 10).forEach(f => console.log(`    ${f}`));
    if (result.failures.length > 10) {
        console.log(`    ... +${result.failures.length - 10} more`);
    }
}

const previous = fs.existsSync(HARVESTED_FIXTURE)
    ? JSON.parse(fs.readFileSync(HARVESTED_FIXTURE, 'utf8')).keys ?? []
    : [];

const added = keys.filter(k => !previous.includes(k));
const removed = previous.filter(k => !keys.includes(k));

if (added.length) {
    console.log(`\n  new since last harvest (${added.length}):`);
    added.slice(0, 25).forEach(k => console.log(`    ${JSON.stringify(k)}`));
    if (added.length > 25) {
        console.log(`    ... +${added.length - 25} more`);
    }
}

if (removed.length) {
    console.log(`\n  no longer asked for (${removed.length}):`);
    removed.slice(0, 25).forEach(k => console.log(`    ${JSON.stringify(k)}`));
}

if (checkOnly) {
    process.exit(added.length || removed.length ? 1 : 0);
}

const payload = {
    harvestedFrom: JSON.parse(
        fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
    ).supportedModeler,
    node: process.version.replace(/\.\d+$/, ''),
    platform: os.type(),
    keys
};

fs.writeFileSync(HARVESTED_FIXTURE, JSON.stringify(payload, null, 2) + '\n');
console.log(`\nWrote ${path.relative(ROOT, HARVESTED_FIXTURE)}`);

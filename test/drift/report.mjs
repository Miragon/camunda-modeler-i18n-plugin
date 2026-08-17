#!/usr/bin/env node
/**
 * Prints the drift report. `drift.spec.mjs` asserts the same data.
 *
 *   --json               machine-readable
 *   --update-baseline    record current coverage as the ratchet floor
 *   --seed-runtime-keys  regenerate the runtime-key allowlist
 *   --write-coverage     refresh docs/COVERAGE.md
 */

import fs from 'node:fs';
import path from 'node:path';

import { analyse, format, coverageMarkdown, BASELINE_FILE, RUNTIME_KEYS_FILE } from '../lib/drift.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const args = process.argv.slice(2);

const has = flag => args.includes(flag);

if (has('--seed-runtime-keys')) {
    // Seeded from the raw analysis; feeding the reported `unknown` list back in
    // would be self-erasing, since it already has the allowlist subtracted.
    const { unknown } = analyse({ raw: true });

    fs.writeFileSync(RUNTIME_KEYS_FILE, JSON.stringify(unknown, null, 4) + '\n');
    console.log(`Wrote ${unknown.length} keys to ${path.relative(ROOT, RUNTIME_KEYS_FILE)}`);
}

const result = analyse();

if (has('--write-coverage')) {
    const file = path.join(ROOT, 'docs', 'COVERAGE.md');

    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, coverageMarkdown(result));
    console.log(`Coverage written to ${path.relative(ROOT, file)}`);
}

if (has('--update-baseline')) {
    fs.writeFileSync(BASELINE_FILE, JSON.stringify({ locales: result.locales }, null, 4) + '\n');
    console.log(`Baseline written to ${path.relative(ROOT, BASELINE_FILE)}`);
}

console.log(has('--json') ? JSON.stringify(result, null, 2) : format(result));

process.exit(result.blocking ? 1 : 0);

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

import DriftReport from '../lib/DriftReport.mjs';
import TranslationDrift from '../lib/TranslationDrift.mjs';
import { BASELINE_FILE, COVERAGE_FILE, PLUGIN_ROOT, RUNTIME_KEYS_FILE } from '../lib/paths.mjs';

const args = process.argv.slice(2);

const has = (flag) => args.includes(flag);

if (has('--seed-runtime-keys')) {
    // Seeded from the raw analysis; feeding the reported `unknown` list back in
    // would be self-erasing, since it already has the allowlist subtracted.
    const { unknown } = new TranslationDrift({ raw: true }).analyse();

    fs.writeFileSync(RUNTIME_KEYS_FILE, JSON.stringify(unknown, null, 4) + '\n');
    console.log(`Wrote ${unknown.length} keys to ${path.relative(PLUGIN_ROOT, RUNTIME_KEYS_FILE)}`);
}

let result = new TranslationDrift().analyse();

if (has('--write-coverage')) {
    fs.mkdirSync(path.dirname(COVERAGE_FILE), { recursive: true });
    fs.writeFileSync(COVERAGE_FILE, new DriftReport(result).toCoverageMarkdown());
    console.log(`Coverage written to ${path.relative(PLUGIN_ROOT, COVERAGE_FILE)}`);
}

if (has('--update-baseline')) {
    fs.writeFileSync(BASELINE_FILE, JSON.stringify({ locales: result.locales }, null, 4) + '\n');
    console.log(`Baseline written to ${path.relative(PLUGIN_ROOT, BASELINE_FILE)}`);

    // Recompute against the floor we just wrote: the whole point of this flag is
    // to accept the current numbers, so the ratchet must no longer report them as
    // regressions. Genuine problems (missing, parity, placeholders) still block.
    result = new TranslationDrift().analyse();
}

console.log(has('--json') ? JSON.stringify(result, null, 2) : new DriftReport(result).toText());

process.exit(result.blocking ? 1 : 0);

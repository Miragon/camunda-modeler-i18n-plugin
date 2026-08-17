/**
 * Compares our dictionaries against the Modeler's UI strings.
 *
 * Three buckets by severity: `missing` fails, `untranslated` is a ratchet
 * against a recorded baseline, `unknown` is informational.
 */

import fs from 'node:fs';
import path from 'node:path';

import { loadAllLocales, placeholders } from './locales.mjs';
import { collectUpstreamKeys } from './upstream.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const FIXTURES = path.join(ROOT, 'test', 'fixtures');

export const REFERENCE_LOCALE = 'en';

export const IGNORE_FILE = path.join(FIXTURES, 'upstream-ignore.json');
export const RUNTIME_KEYS_FILE = path.join(FIXTURES, 'known-runtime-keys.json');
export const BASELINE_FILE = path.join(FIXTURES, 'translation-baseline.json');

const readJson = (file, fallback) =>
    fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;

/**
 * @param {Object} [options]
 * @param {Boolean} [options.raw] ignore the runtime-key allowlist, so `unknown`
 *   holds every undiscovered key. Used to regenerate that allowlist.
 */
export function analyse({ raw = false } = {}) {
    const ignored = new Set(Object.keys(readJson(IGNORE_FILE, {})));
    const allowlisted = new Set(raw ? [] : readJson(RUNTIME_KEYS_FILE, []));
    const baseline = readJson(BASELINE_FILE, null);

    const locales = loadAllLocales();
    const reference = locales.get(REFERENCE_LOCALE);

    if (!reference) {
        throw new Error(`Reference locale "${REFERENCE_LOCALE}" not found`);
    }

    const { keys: upstream, skipped, dynamic } = collectUpstreamKeys();
    const ourKeys = new Set(reference.dictionary.keys());

    const missing = [ ...upstream ]
        .filter(([ key ]) => !ourKeys.has(key) && !ignored.has(key))
        .map(([ key, source ]) => ({ key, source }))
        .sort((a, b) => a.source.localeCompare(b.source) || a.key.localeCompare(b.key));

    const unknown = [ ...ourKeys ]
        .filter(key => !upstream.has(key) && !allowlisted.has(key))
        .sort();

    const report = {};
    const parityErrors = [];
    const placeholderErrors = [];

    for (const [ name, locale ] of locales) {
        const keys = new Set(locale.dictionary.keys());
        const isReference = name === REFERENCE_LOCALE;

        if (!isReference) {
            for (const key of ourKeys) {
                if (!keys.has(key)) {
                    parityErrors.push({ locale: name, key, problem: 'missing' });
                }
            }
            for (const key of keys) {
                if (!ourKeys.has(key)) {
                    parityErrors.push({ locale: name, key, problem: 'extra' });
                }
            }
        }

        let untranslated = 0;

        for (const [ key, value ] of locale.dictionary) {
            if (placeholders(value).join(',') !== placeholders(key).join(',')) {
                placeholderErrors.push({ locale: name, key, value });
            }
            if (key === value) {
                untranslated++;
            }
        }

        // English is the identity mapping, so counting it as untranslated is
        // meaningless.
        const count = isReference ? 0 : untranslated;

        report[name] = {
            keys: locale.dictionary.size,
            untranslated: count,
            translated: locale.dictionary.size - count,
            coverage: +(100 * (locale.dictionary.size - count) / locale.dictionary.size).toFixed(1),
            duplicates: locale.duplicates.length,
            reference: isReference || undefined
        };
    }

    const regressions = [];

    for (const [ name, stats ] of Object.entries(report)) {
        const before = baseline?.locales?.[name];

        if (!before) {
            continue;
        }

        if (stats.untranslated > before.untranslated) {
            regressions.push(`${name}: untranslated rose ${before.untranslated} -> ${stats.untranslated}`);
        }
        if (stats.duplicates > before.duplicates) {
            regressions.push(`${name}: duplicate keys rose ${before.duplicates} -> ${stats.duplicates}`);
        }
    }

    const blocking = missing.length + parityErrors.length + placeholderErrors.length + regressions.length;

    return {
        reference: REFERENCE_LOCALE,
        upstreamKeys: upstream.size,
        ourKeys: ourKeys.size,
        dynamicCallSites: dynamic,
        skippedPackages: skipped,
        missing,
        unknown,
        parityErrors,
        placeholderErrors,
        regressions,
        locales: report,
        blocking
    };
}

/**
 * A committed, diffable snapshot of where each language stands. Reviewing a
 * translation PR otherwise means re-deriving the numbers by hand.
 */
export function coverageMarkdown(result) {
    const rows = Object.entries(result.locales)
        .filter(([ , s ]) => !s.reference)
        .sort((a, b) => a[1].coverage - b[1].coverage)
        .map(([ name, s ]) => {
            const mark = s.untranslated === 0 ? '🟢' : s.coverage >= 95 ? '🟡' : '🔴';

            return `| ${name} | ${mark} | ${s.coverage}% | ${s.translated} | ${s.untranslated} |`;
        });

    return [
        '# Translation coverage',
        '',
        'Generated by `npm run check:translations:coverage`. Do not edit by hand.',
        '',
        `Reference locale \`${result.reference}\` defines ${result.ourKeys} keys.`,
        `${result.upstreamKeys} strings were discovered upstream.`,
        '',
        '"Untranslated" counts values still identical to the English key. A few are',
        'legitimately identical across languages, so 100% is not always reachable.',
        '',
        '| locale | | coverage | translated | untranslated |',
        '| --- | --- | --- | --- | --- |',
        ...rows,
        ''
    ].join('\n');
}

/** Human-readable report; also used verbatim as the drift issue body. */
export function format(result) {
    const lines = [
        'Translation drift report',
        '========================',
        '',
        `  upstream keys discovered : ${result.upstreamKeys}`,
        `  keys we translate        : ${result.ourKeys}`,
        `  dynamic translate() sites: ${result.dynamicCallSites}  (invisible to static analysis)`
    ];

    if (result.skippedPackages.length) {
        lines.push(`  not installed, skipped   : ${result.skippedPackages.join(', ')}`);
    }

    lines.push('', '  locale    keys  translated  coverage  dupes');

    for (const [ name, s ] of Object.entries(result.locales)) {
        lines.push(
            `  ${name.padEnd(9)} ${String(s.keys).padStart(4)}  ${String(s.translated).padStart(10)}  ` +
            `${`${s.coverage}%`.padStart(6)}  ${String(s.duplicates).padStart(5)}`
        );
    }

    if (result.missing.length) {
        lines.push('', `  MISSING — upstream strings with no translation (${result.missing.length}):`);
        result.missing.forEach(m => lines.push(`    ${JSON.stringify(m.key)}  [${m.source}]`));
    }

    if (result.parityErrors.length) {
        lines.push('', `  PARITY — locales out of sync (${result.parityErrors.length}):`);
        result.parityErrors.slice(0, 20).forEach(e =>
            lines.push(`    ${e.locale}: ${e.problem} ${JSON.stringify(e.key)}`));
    }

    if (result.placeholderErrors.length) {
        lines.push('', `  PLACEHOLDERS — interpolation does not match the key (${result.placeholderErrors.length}):`);
        result.placeholderErrors.slice(0, 20).forEach(e =>
            lines.push(`    ${e.locale}: ${JSON.stringify(e.key)} -> ${JSON.stringify(e.value)}`));
    }

    if (result.regressions.length) {
        lines.push('', `  RATCHET — coverage went backwards (${result.regressions.length}):`);
        result.regressions.forEach(r => lines.push(`    ${r}`));
    }

    if (result.unknown.length) {
        lines.push(
            '',
            `  unknown — our keys no source reports (${result.unknown.length}, informational).`,
            '    Run `npm run harvest` to classify them.'
        );
    }

    lines.push('', result.blocking ? `FAILED — ${result.blocking} blocking problem(s).` : 'OK — no blocking problems.');

    return lines.join('\n');
}

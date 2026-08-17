/** Locale invariants that were previously only documented in prose. */

import fs from 'node:fs';
import path from 'node:path';

import { describe, it, expect } from 'vitest';

import {
    LANGUAGES_DIR, LOCALE_FILES, listLocales, loadAllLocales, placeholders
} from '../lib/locales.mjs';
import { BASELINE_FILE } from '../lib/drift.mjs';

const REFERENCE = 'en';

const locales = listLocales();
const loaded = loadAllLocales();
const reference = loaded.get(REFERENCE);

const readSource = file => fs.readFileSync(path.join(LANGUAGES_DIR, file), 'utf8');

describe('locale registry', () => {

    it('exposes at least the twelve shipped locales', () => {
        expect(locales).toContain(REFERENCE);
        expect(locales.length).toBeGreaterThanOrEqual(12);
    });

    // `pt_br` vs `pt-br`: a mismatch falls back to the default language.
    it('registers every locale in both translate.js and I18nPlugin.js', () => {
        const translateSrc = fs.readFileSync(
            path.join(LANGUAGES_DIR, '..', 'translate.js'), 'utf8'
        );
        const pluginSrc = fs.readFileSync(
            path.join(LANGUAGES_DIR, '..', '..', 'config', 'I18nPlugin.js'), 'utf8'
        );

        const languageMap = translateSrc.match(/const languages = \{([^}]*)\}/s);
        expect(languageMap, 'languages map not found in translate.js').toBeTruthy();

        const registered = languageMap[1]
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .sort();

        const offered = [ ...pluginSrc.matchAll(/\{\s*value:\s*'([^']+)'/g) ]
            .map(m => m[1])
            .sort();

        expect(offered).toEqual(registered);

        const expectedDirs = registered.map(key => key.replace(/_/g, '-')).sort();
        expect(expectedDirs).toEqual([ ...locales ].sort());
    });

    it.each(locales)('%s barrel spreads all four translation files', locale => {
        const barrel = readSource(`${locale}.js`);

        for (const name of LOCALE_FILES) {
            expect(barrel, `${locale}.js must import ./${locale}/${name}`)
                .toContain(`./${locale}/${name}`);
        }

        // Importing without spreading silently drops the file.
        const spreads = [ ...barrel.matchAll(/\.\.\.(\w+)/g) ].map(m => m[1]);
        expect(spreads).toHaveLength(LOCALE_FILES.length);
    });
});

describe('locale contents', () => {

    it.each(locales)('%s parses without unresolvable entries', locale => {
        expect(loaded.get(locale).unresolved).toEqual([]);
    });

    it.each(locales.filter(l => l !== REFERENCE))(
        '%s has exactly the same keys as ' + REFERENCE,
        locale => {
            const keys = new Set(loaded.get(locale).dictionary.keys());
            const referenceKeys = [ ...reference.dictionary.keys() ];

            expect([ ...referenceKeys ].filter(k => !keys.has(k))).toEqual([]);
            expect([ ...keys ].filter(k => !reference.dictionary.has(k))).toEqual([]);
        }
    );

    // A dropped placeholder renders as literal "{maxLength}" to the user.
    it.each(locales)('%s preserves every {placeholder}', locale => {
        const offenders = [];

        for (const [ key, value ] of loaded.get(locale).dictionary) {
            if (placeholders(value).join(',') !== placeholders(key).join(',')) {
                offenders.push({ key, value });
            }
        }

        expect(offenders).toEqual([]);
    });

    it.each(locales)('%s has no empty translations', locale => {
        const empty = [ ...loaded.get(locale).dictionary ]
            .filter(([ , value ]) => value.trim() === '')
            .map(([ key ]) => key);

        expect(empty).toEqual([]);
    });
});

describe('duplicate keys', () => {

    // A key repeated across the four files is silently shadowed by the barrel
    // spread. Shrink-only ratchet.
    const baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));

    it.each(locales)('%s does not gain duplicate keys', locale => {
        const { duplicates } = loaded.get(locale);
        const allowed = baseline.locales[locale].duplicates;

        expect(
            duplicates.length,
            `duplicates in ${locale}:\n` +
                duplicates.map(d => `  ${JSON.stringify(d.key)} in ${d.file}:${d.line} shadows ${d.shadows}`).join('\n')
        ).toBeLessThanOrEqual(allowed);
    });
});

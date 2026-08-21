/**
 * Locale invariants for the shared translations library.
 *
 * These guard the data itself (independent of any consumer): every locale covers
 * the same keys as the English reference, `{placeholder}` tokens are preserved,
 * no translation is empty, and no key is repeated across the four source files of
 * a locale (a duplicate would be silently shadowed by the barrel spread).
 */

import { describe, it, expect } from 'vitest';

import { supportedLanguages, dictionaries, type SupportedLocale } from '../src/languages/index.js';

const REFERENCE: SupportedLocale = 'en';
const LOCALES = supportedLanguages.map((l) => l.locale);
const SUB_FILES = ['bpmn-js', 'dmn-js', 'camunda-8-cloud', 'camunda-7-platform', 'other'] as const;

const placeholders = (text: string): string =>
    [...text.matchAll(/{([^}]+)}/g)]
        .map((m) => m[1])
        .sort()
        .join(',');

// Each per-locale source file loaded separately, used to detect keys duplicated
// across the four files of one locale (invisible once the barrel merges them).
const subByLocale: Record<string, Record<string, Record<string, string>>> = {};
for (const locale of LOCALES) {
    subByLocale[locale] = {};
    for (const file of SUB_FILES) {
        const mod = (await import(`../src/languages/${locale}/${file}.ts`)) as {
            default: Record<string, string>;
        };
        subByLocale[locale][file] = mod.default;
    }
}

describe('locale registry', () => {
    it('exposes the twelve shipped locales including the reference', () => {
        expect(LOCALES).toContain(REFERENCE);
        expect(LOCALES.length).toBe(12);
    });

    it('has a dictionary for every registered locale and no orphans', () => {
        expect([...LOCALES].sort()).toEqual(
            (Object.keys(dictionaries) as SupportedLocale[]).sort(),
        );
    });

    it('has a unique locale code and non-empty label per language', () => {
        expect(new Set(LOCALES).size).toBe(LOCALES.length);
        for (const { locale, label } of supportedLanguages) {
            expect(label.trim(), `empty label for ${locale}`).not.toBe('');
        }
    });
});

describe('locale contents', () => {
    const referenceKeys = new Set(Object.keys(dictionaries[REFERENCE]));

    it.each(LOCALES.filter((l) => l !== REFERENCE))(
        '%s covers exactly the same keys as the reference',
        (locale) => {
            const keys = new Set(Object.keys(dictionaries[locale]));
            expect([...referenceKeys].filter((k) => !keys.has(k))).toEqual([]);
            expect([...keys].filter((k) => !referenceKeys.has(k))).toEqual([]);
        },
    );

    // A dropped placeholder renders as the literal "{maxLength}" to the user.
    it.each(LOCALES)('%s preserves every {placeholder}', (locale) => {
        const offenders: { key: string; value: string }[] = [];
        for (const [key, value] of Object.entries(dictionaries[locale])) {
            if (placeholders(value) !== placeholders(key)) offenders.push({ key, value });
        }
        expect(offenders).toEqual([]);
    });

    it.each(LOCALES)('%s has no empty translations', (locale) => {
        const empty = Object.entries(dictionaries[locale])
            .filter(([, value]) => value.trim() === '')
            .map(([key]) => key);
        expect(empty).toEqual([]);
    });
});

describe("no duplicate keys across a locale's four files", () => {
    // A key present in more than one of the four files is silently shadowed by the
    // barrel spread, so the earlier translation becomes dead code. Keep this at zero.
    it.each(LOCALES)('%s has no cross-file duplicate keys', (locale) => {
        const files = subByLocale[locale];
        const seen = new Map<string, string>();
        const duplicates: { key: string; file: string; shadows: string }[] = [];
        for (const file of SUB_FILES) {
            for (const key of Object.keys(files[file])) {
                if (seen.has(key)) {
                    duplicates.push({ key, file, shadows: seen.get(key)! });
                } else {
                    seen.set(key, file);
                }
            }
        }
        expect(
            duplicates,
            duplicates
                .map((d) => `  ${JSON.stringify(d.key)} in ${d.file} shadows ${d.shadows}`)
                .join('\n'),
        ).toEqual([]);
    });
});

/**
 * Per-platform invariants for the engine overlays.
 *
 * The engine-specific properties are split by Camunda version: `camunda-8-cloud`
 * (C8) and `camunda-7-platform` (C7), the C-version visible in each file name.
 *
 * Both overlays must preserve `{placeholder}` tokens and ship no empty values.
 * The C7 overlay is generated uniformly, so it must be key-identical across every
 * locale. (The C8 file is the older curated set; its per-file key distribution
 * varies by locale — only the *merged* dictionary is at key parity, which
 * `locales.spec.ts` guards.) A key belongs to exactly one engine — the two
 * overlays stay disjoint.
 */

import { describe, it, expect } from 'vitest';

import { supportedLanguages } from '../src/languages/index.js';

const LOCALES = supportedLanguages.map((l) => l.locale);

// engine id → source file (the C-version is visible in both).
const OVERLAYS = {
    'camunda-8': 'camunda-8-cloud',
    'camunda-7': 'camunda-7-platform',
} as const;

const placeholders = (text: string): string =>
    [...text.matchAll(/{([^}]+)}/g)]
        .map((m) => m[1])
        .sort()
        .join(',');

// Load each locale's two engine overlays.
const overlays: Record<string, Record<string, Record<string, string>>> = {};
for (const locale of LOCALES) {
    overlays[locale] = {};
    for (const [engine, file] of Object.entries(OVERLAYS)) {
        const mod = (await import(`../src/languages/${locale}/${file}.ts`)) as {
            default: Record<string, string>;
        };
        overlays[locale][engine] = mod.default;
    }
}

for (const engine of Object.keys(OVERLAYS)) {
    describe(`${engine} overlay`, () => {
        it('ships keys for the reference locale', () => {
            expect(Object.keys(overlays.en[engine]).length).toBeGreaterThan(0);
        });

        it.each(LOCALES)('%s preserves every {placeholder}', (locale) => {
            const offenders: string[] = [];
            for (const [key, value] of Object.entries(overlays[locale][engine])) {
                if (placeholders(value) !== placeholders(key)) offenders.push(key);
            }
            expect(offenders).toEqual([]);
        });

        it.each(LOCALES)('%s has no empty translations', (locale) => {
            const empty = Object.entries(overlays[locale][engine])
                .filter(([, value]) => value.trim() === '')
                .map(([key]) => key);
            expect(empty).toEqual([]);
        });
    });
}

describe('camunda-7 overlay is uniform across locales', () => {
    const referenceKeys = Object.keys(overlays.en['camunda-7']).sort();

    it('the reference overlay is non-empty', () => {
        expect(referenceKeys.length).toBeGreaterThan(0);
    });

    it.each(LOCALES.filter((l) => l !== 'en'))('%s covers exactly the reference keys', (locale) => {
        expect(Object.keys(overlays[locale]['camunda-7']).sort()).toEqual(referenceKeys);
    });
});

describe('engine overlays are disjoint', () => {
    it.each(LOCALES)('%s: no camunda-7 key is also a camunda-8 key', (locale) => {
        const c8 = new Set(Object.keys(overlays[locale]['camunda-8']));
        const shared = Object.keys(overlays[locale]['camunda-7']).filter((k) => c8.has(k));
        expect(shared, `keys in both engine overlays: ${JSON.stringify(shared)}`).toEqual([]);
    });
});

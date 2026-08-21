/**
 * Plugin-side locale wiring.
 *
 * The translation data and its invariants (key parity, placeholders, duplicate
 * keys) live in and are tested by `@miragon/bpmn-modeler-i18n`. What remains
 * plugin-specific is the seam in `bpmnjs-i18n-extension`: the dropdown options
 * derived from the library and the backward-compat mapping from the locale keys
 * older plugin versions persisted (`pt_br`) to the library's BCP-47 codes.
 */

import { describe, it, expect } from 'vitest';

import { supportedLanguages } from '@miragon/bpmn-modeler-i18n';
import { options, canonicalLocale } from '../../client/bpmnjs-i18n-extension/index.js';

const localeCodes = supportedLanguages.map((l) => l.locale);

describe('dropdown options', () => {
    it('offers exactly one option per shipped language', () => {
        expect(options.map((o) => o.value)).toEqual(localeCodes);
        expect(options.length).toBe(12);
    });

    it('carries a non-empty label and the library locale code as value', () => {
        for (const option of options) {
            expect(localeCodes, `${option.value} is not a library locale`).toContain(option.value);
            expect(option.label.trim()).not.toBe('');
        }
    });

    it('includes the default language', () => {
        expect(options.map((o) => o.value)).toContain('en');
    });
});

describe('legacy locale mapping', () => {
    // The four compound locales whose persisted key changed from `_` to `-`.
    const legacy = {
        pt_br: 'pt-br',
        nl_nl: 'nl-nl',
        zh_Hans: 'zh-Hans',
        zh_Hant: 'zh-Hant',
    };

    it.each(Object.entries(legacy))('maps the legacy key %s to a supported locale', (from, to) => {
        expect(canonicalLocale(from)).toBe(to);
        expect(localeCodes, `${to} is not a supported locale`).toContain(to);
    });

    it('passes through codes that are already canonical', () => {
        for (const code of localeCodes) {
            expect(canonicalLocale(code)).toBe(code);
        }
    });
});

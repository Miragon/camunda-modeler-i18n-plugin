/**
 * The translation data and its invariants (key parity, placeholders, duplicate
 * keys) live in and are tested by `@miragon/bpmn-modeler-i18n`. What remains
 * plugin-specific are the dropdown options derived from the library.
 */

import { describe, it, expect } from 'vitest';

import { supportedLanguages } from '@miragon/bpmn-modeler-i18n';
import LanguageOptions from '../../client/language/LanguageOptions.js';

const localeCodes = supportedLanguages.map((l) => l.locale);
const options = new LanguageOptions().all();

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

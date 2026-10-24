/**
 * Plugin-side locale wiring.
 *
 * The translation data and its invariants (key parity, placeholders, duplicate
 * keys) live in and are tested by `@miragon/bpmn-modeler-i18n`. What remains
 * plugin-specific is the seam in `bpmnjs-i18n-extension`: the dropdown options
 * derived from the library.
 */

import { describe, it, expect } from 'vitest';

import { supportedLanguages } from '@miragon/bpmn-modeler-i18n';
import { options } from '../../client/bpmnjs-i18n-extension/index.js';

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

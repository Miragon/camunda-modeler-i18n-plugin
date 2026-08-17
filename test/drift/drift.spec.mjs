/**
 * Fails when the Modeler asks for a string we do not translate. Nothing else
 * notices: this plugin does not depend on bpmn-js, so new UI strings produce no
 * build error and no other test failure.
 */

import { describe, it, expect } from 'vitest';

import { analyse } from '../lib/drift.mjs';

const result = analyse();

describe('translation drift', () => {

    it('discovers upstream keys to compare against', () => {
        expect(result.upstreamKeys).toBeGreaterThan(0);
    });

    it('translates every string the Modeler asks for', () => {
        const listed = result.missing
            .map(m => `  ${JSON.stringify(m.key)}  [${m.source}]`)
            .join('\n');

        expect(
            result.missing,
            `Upstream strings with no translation:\n${listed}\n\n` +
            'Run `npm run check:translations` for the full report, then use the ' +
            '/i18n-translate skill to fill the gaps.'
        ).toEqual([]);
    });

    it('keeps every locale in sync with the reference', () => {
        expect(result.parityErrors).toEqual([]);
    });

    it('preserves interpolation placeholders', () => {
        expect(result.placeholderErrors).toEqual([]);
    });

    it('does not lose translation coverage', () => {
        expect(result.regressions).toEqual([]);
    });
});

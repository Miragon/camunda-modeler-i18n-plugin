/**
 * The drift check discovers most upstream strings by scanning the installed
 * bundles for literal `translate()` arguments. A call shape the scanner cannot
 * see is a silent hole: dmn-js asks for `this._translate('Custom')`, and until
 * the scanner matched `._translate(` that key never reached the drift check.
 */

import { describe, it, expect } from 'vitest';

import { scanTranslateCalls } from '../lib/utils/scanTranslateCalls.mjs';

describe('scanTranslateCalls', () => {
    it('extracts the literal of a free translate() call', () => {
        expect(scanTranslateCalls(`title: translate('Create decision')`)).toEqual({
            keys: ['Create decision'],
            dynamic: 0,
        });
    });

    it('extracts the literal of a this._translate() call (dmn-js components)', () => {
        const source = `const group = { id: 'custom', name: this._translate('Custom') };`;

        expect(scanTranslateCalls(source).keys).toEqual(['Custom']);
    });

    it('extracts a literal that is followed by replacements', () => {
        const source = `placeholder: this._translate('e.g. {sample}', { sample: 'P1Y2M' })`;

        expect(scanTranslateCalls(source).keys).toEqual(['e.g. {sample}']);
    });

    it('decodes double quotes inside a single-quoted literal', () => {
        const source = `"placeholder": this._translate('"value", "value", ...')`;

        expect(scanTranslateCalls(source).keys).toEqual(['"value", "value", ...']);
    });

    it('decodes both quote styles and escapes', () => {
        const source = `translate("Don't save"); translate('It\\'s here')`;

        expect(scanTranslateCalls(source).keys).toEqual(["Don't save", "It's here"]);
    });

    it('ignores method calls named translate on other objects', () => {
        const source = `canvas.translate(10, 20); element.translate('x');`;

        expect(scanTranslateCalls(source)).toEqual({ keys: [], dynamic: 0 });
    });

    it('ignores the SVG transform string', () => {
        const source = `attr(gfx, { transform: 'translate(' + x + ', ' + y + ')' });`;

        expect(scanTranslateCalls(source)).toEqual({ keys: [], dynamic: 0 });
    });

    it('ignores identifiers that merely end in translate', () => {
        const source = `mytranslate('Not a key'); this.__translate('Neither');`;

        expect(scanTranslateCalls(source).keys).toEqual([]);
    });

    it('counts a literal prefix concatenated at runtime as dynamic, not as a key', () => {
        expect(scanTranslateCalls(`translate('Align elements ' + alignment)`)).toEqual({
            keys: [],
            dynamic: 1,
        });
    });

    it('counts identifier and template-literal arguments as dynamic', () => {
        const source = [
            'translate(label);',
            'this._translate(typeRef, {});',
            'translate(`Create ${type}`);',
        ].join('\n');

        expect(scanTranslateCalls(source)).toEqual({ keys: [], dynamic: 3 });
    });

    it('ignores the worked example inside a JSDoc block', () => {
        const source = [
            '/**',
            " * @example translate('Example {name}', { name: 'x' })",
            ' */',
            "translate('Real key')",
        ].join('\n');

        expect(scanTranslateCalls(source).keys).toEqual(['Real key']);
    });
});

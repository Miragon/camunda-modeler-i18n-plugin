/**
 * Behavior of the runtime translator: lookup, fallback, `{param}` interpolation,
 * language switching, and change notifications.
 */

import { describe, it, expect, vi } from 'vitest';

import { CustomTranslator, TranslateModule } from '../src/TranslateModule.js';
import { dictionaries } from '../src/languages/index.js';

describe('CustomTranslator', () => {
    it('defaults to English and returns the source string unchanged', () => {
        const t = new CustomTranslator();
        expect(t.getLocale()).toBe('en');
        expect(t.translate('User Task')).toBe('User Task');
    });

    it('translates using the active language after setLanguage', () => {
        const t = new CustomTranslator();
        t.setLanguage('de');
        expect(t.translate('User Task')).toBe(dictionaries.de['User Task']);
    });

    it('falls back to the template for an unknown key', () => {
        const t = new CustomTranslator();
        t.setLanguage('de');
        expect(t.translate('this string does not exist anywhere')).toBe(
            'this string does not exist anywhere',
        );
    });

    it('interpolates {params} and leaves unresolved ones as {key}', () => {
        const t = new CustomTranslator();
        expect(t.translate('must have at most {count} chars', { count: '8' })).toBe(
            'must have at most 8 chars',
        );
        expect(t.translate('value {a} and {b}', { a: '1' })).toBe('value 1 and {b}');
    });

    it('falls back to English for an unknown locale rather than throwing', () => {
        const t = new CustomTranslator();
        // @ts-expect-error deliberately passing an unsupported code
        t.setLanguage('xx-yy');
        expect(t.getLocale()).toBe('en');
    });

    it('notifies onChange listeners on switch and stops after unsubscribe', () => {
        const t = new CustomTranslator();
        const listener = vi.fn();
        const off = t.onChange(listener);
        t.setLanguage('fr');
        expect(listener).toHaveBeenCalledTimes(1);
        off();
        t.setLanguage('es');
        expect(listener).toHaveBeenCalledTimes(1);
    });
});

describe('CustomTranslator.extend', () => {
    it('adds consumer keys the library does not ship', () => {
        const t = new CustomTranslator();
        t.extend({ en: { 'A product-specific label': 'A product-specific label' } });
        expect(t.translate('A product-specific label')).toBe('A product-specific label');

        t.setLanguage('de');
        t.extend({ de: { 'failed to import {element}': 'Import von {element} fehlgeschlagen' } });
        expect(t.translate('failed to import {element}', { element: 'Task_1' })).toBe(
            'Import von Task_1 fehlgeschlagen',
        );
    });

    it('overrides a bundled translation locally (consumer wins)', () => {
        const t = new CustomTranslator();
        t.setLanguage('de');
        t.extend({ de: { 'User Task': 'Meine Benutzeraufgabe' } });
        expect(t.translate('User Task')).toBe('Meine Benutzeraufgabe');
    });

    it('persists overrides across a language switch and merges cumulatively', () => {
        const t = new CustomTranslator();
        t.extend({ de: { Foo: 'DE-Foo' }, en: { Foo: 'EN-Foo' } });
        t.extend({ de: { Bar: 'DE-Bar' } }); // second call must not drop Foo

        t.setLanguage('en');
        expect(t.translate('Foo')).toBe('EN-Foo');
        t.setLanguage('de');
        expect(t.translate('Foo')).toBe('DE-Foo');
        expect(t.translate('Bar')).toBe('DE-Bar');
    });

    it('does not leak overrides into the shared dictionaries export', () => {
        const t = new CustomTranslator();
        t.extend({ de: { Leak: 'nope' } });
        expect(dictionaries.de['Leak']).toBeUndefined();
    });

    it('notifies subscribers so they can re-render', () => {
        const t = new CustomTranslator();
        const listener = vi.fn();
        t.onChange(listener);
        t.extend({ en: { Foo: 'Bar' } });
        expect(listener).toHaveBeenCalledTimes(1);
    });
});

describe('TranslateModule (didi wiring)', () => {
    it('registers a value + factory the modeler can consume', () => {
        expect(TranslateModule.__init__).toContain('customTranslator');
        expect(TranslateModule.customTranslator[0]).toBe('value');
        expect(TranslateModule.translate[0]).toBe('factory');

        const factory = TranslateModule.translate[1] as (
            t: CustomTranslator,
        ) => (s: string, r?: Record<string, string>) => string;
        const translator = new CustomTranslator();
        translator.setLanguage('de');
        const translate = factory(translator);
        expect(translate('User Task')).toBe(dictionaries.de['User Task']);
    });
});

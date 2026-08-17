import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import translateModule from '../../client/bpmnjs-i18n-extension/index.js';

const Translator = translateModule.translateModule;

/** Builds a translator for a language, the way didi instantiates it. */
function translatorFor(language) {
    const original = Translator.prototype.currentLanguage;

    Translator.prototype.currentLanguage = () => language;
    try {
        return new Translator();
    } finally {
        Translator.prototype.currentLanguage = original;
    }
}

describe('translate module', () => {

    it('is a didi module registering the translate service', () => {
        expect(translateModule.__init__).toEqual([ 'translate' ]);
        expect(translateModule.translate).toEqual([ 'type', Translator ]);
    });

    it('declares no injections', () => {
        expect(Translator.$inject).toEqual([]);
    });

    it('defaults to English', () => {
        expect(Translator.prototype.currentLanguage()).toBe('en');
    });
});

describe('translation', () => {

    let log;

    beforeEach(() => {
        log = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        log.mockRestore();
    });

    it('translates a known string', () => {
        expect(translatorFor('de')('Activate hand tool')).toBe('Handwerkzeug aktivieren');
    });

    it('falls back to the template when the key is unknown', () => {
        expect(translatorFor('de')('Not a real string')).toBe('Not a real string');
    });

    it('interpolates {placeholders}', () => {
        const translate = translatorFor('en');

        expect(translate('{label} must not be empty.', { label: 'Name' }))
            .toBe('Name must not be empty.');
    });

    it('leaves a placeholder untouched when no replacement is given', () => {
        const translate = translatorFor('en');

        expect(translate('{label} must not be empty.')).toBe('{label} must not be empty.');
        expect(translate('{label} must not be empty.', {})).toBe('{label} must not be empty.');
    });

    it('interpolates a translated value', () => {
        const translate = translatorFor('de');

        expect(translate('Must be at least {minLength} characters.', { minLength: 3 }))
            .toContain('3');
    });

    // Cached at construction, which is why a language change needs a restart.
    it('resolves the language once, at construction time', () => {
        const translate = translatorFor('de');

        Translator.prototype.currentLanguage = () => 'fr';
        try {
            expect(translate('Activate hand tool')).toBe('Handwerkzeug aktivieren');
        } finally {
            Translator.prototype.currentLanguage = () => 'en';
        }
    });

    it('reports a missing translation once, not on every call', () => {
        const translate = translatorFor('de');

        translate('Definitely missing string A');
        translate('Definitely missing string A');

        const reports = log.mock.calls
            .map(([ msg ]) => msg)
            .filter(msg => typeof msg === 'string' && msg.includes('Definitely missing string A'));

        expect(reports).toHaveLength(1);
    });

    describe('resilience', () => {

        // Regression: an unresolved locale reached `languages[undefined]` and
        // the first translated string threw, blanking the editor.
        it.each([ undefined, null, 'not-a-language', '' ])(
            'does not throw when the language is %p',
            language => {
                const translate = translatorFor(language);

                expect(() => translate('Activate hand tool')).not.toThrow();
            }
        );

        it('falls back to English for an unknown language', () => {
            expect(translatorFor('not-a-language')('Activate hand tool'))
                .toBe('Activate hand tool');
        });
    });
});

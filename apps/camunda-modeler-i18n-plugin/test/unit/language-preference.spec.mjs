import { describe, it, expect, vi } from 'vitest';

import { supportedLanguages } from '@miragon/bpmn-modeler-i18n';
import {
    defaultLanguage,
    loadLanguage,
    saveLanguage,
} from '../../client/config/languagePreference.js';

const localeCodes = supportedLanguages.map((l) => l.locale);

const storedConfig = (stored) => ({
    getForPlugin: vi.fn().mockResolvedValue(stored),
});

describe('loading the language', () => {
    it('reads it from the i18n plugin config', async () => {
        const config = storedConfig({ currentLanguage: { value: 'fr', label: 'Français' } });

        expect(await loadLanguage(config)).toBe('fr');
        expect(config.getForPlugin).toHaveBeenCalledWith('i18n', 'config');
    });

    it('accepts the plain string older versions stored', async () => {
        expect(await loadLanguage(storedConfig({ currentLanguage: 'de' }))).toBe('de');
    });

    // The four compound locales whose persisted key changed from `_` to `-`.
    it.each([
        ['pt_br', 'pt-br'],
        ['nl_nl', 'nl-nl'],
        ['zh_Hans', 'zh-Hans'],
        ['zh_Hant', 'zh-Hant'],
    ])('maps the legacy key %s to %s', async (legacy, locale) => {
        expect(localeCodes).toContain(locale);
        expect(await loadLanguage(storedConfig({ currentLanguage: legacy }))).toBe(locale);
        expect(await loadLanguage(storedConfig({ currentLanguage: { value: legacy } }))).toBe(
            locale,
        );
    });

    it.each(localeCodes)('keeps the canonical locale %s', async (locale) => {
        expect(await loadLanguage(storedConfig({ currentLanguage: locale }))).toBe(locale);
    });

    it.each([undefined, {}, { currentLanguage: 'xx' }])(
        'falls back to the default language for %j',
        async (stored) => {
            expect(await loadLanguage(storedConfig(stored))).toBe(defaultLanguage);
        },
    );
});

describe('saving the language', () => {
    it('stores the option shape every plugin version can read', async () => {
        const config = { setForPlugin: vi.fn().mockResolvedValue() };

        await saveLanguage(config, 'fr');

        expect(config.setForPlugin).toHaveBeenCalledWith('i18n', 'config', {
            currentLanguage: { value: 'fr', label: 'Français' },
        });
    });
});

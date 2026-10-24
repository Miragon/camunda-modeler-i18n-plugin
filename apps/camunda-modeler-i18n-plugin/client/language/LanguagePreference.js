import LanguageOptions from './LanguageOptions';

const pluginKey = 'i18n';
const configName = 'config';

// Older plugin versions persisted JS-identifier locale keys; the library uses BCP-47.
const legacyLocales = {
    pt_br: 'pt-br',
    nl_nl: 'nl-nl',
    zh_Hans: 'zh-Hans',
    zh_Hant: 'zh-Hant',
};

export default class LanguagePreference {
    static DEFAULT_LOCALE = 'en';

    #config;

    #options = new LanguageOptions();

    constructor(config) {
        this.#config = config;
    }

    async load() {
        const stored = await this.#config.getForPlugin(pluginKey, configName);

        return this.#decode(stored);
    }

    save(locale) {
        return this.#config.setForPlugin(pluginKey, configName, {
            currentLanguage: this.#options.find(locale),
        });
    }

    #decode(stored) {
        const storedValue = stored?.currentLanguage?.value || stored?.currentLanguage;
        const locale = legacyLocales[storedValue] || storedValue;

        return this.#options.find(locale) ? locale : LanguagePreference.DEFAULT_LOCALE;
    }
}

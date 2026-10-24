import { supportedLanguages } from '@miragon/bpmn-modeler-i18n';

export default class LanguageOptions {
    #options = supportedLanguages.map(({ label, locale }) => ({ value: locale, label }));

    all() {
        return this.#options;
    }

    find(locale) {
        return this.#options.find((option) => option.value === locale);
    }
}

import { optionFor } from '../bpmnjs-i18n-extension';

export const defaultLanguage = 'en';

const configKey = 'i18n';
const configName = 'config';

// Older plugin versions persisted JS-identifier locale keys; the library uses BCP-47.
const legacyLocales = {
    pt_br: 'pt-br',
    nl_nl: 'nl-nl',
    zh_Hans: 'zh-Hans',
    zh_Hant: 'zh-Hant',
};

const decode = (stored) => {
    const storedValue = stored?.currentLanguage?.value || stored?.currentLanguage;
    const locale = legacyLocales[storedValue] || storedValue;

    return optionFor(locale) ? locale : defaultLanguage;
};

export const loadLanguage = (config) => config.getForPlugin(configKey, configName).then(decode);

export const saveLanguage = (config, locale) =>
    config.setForPlugin(configKey, configName, { currentLanguage: optionFor(locale) });

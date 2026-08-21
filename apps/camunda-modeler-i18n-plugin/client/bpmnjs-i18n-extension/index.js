/**
 * The plugin's translation seam.
 *
 * Translation data and the runtime translator now live in the shared
 * `@miragon/bpmn-modeler-i18n` package. This module re-exports its didi
 * `TranslateModule` (injected into each editor as an additional module) plus the
 * shared `i18n` singleton (used to switch language) and `supportedLanguages`
 * (used to build the dropdown), so the rest of the plugin has a single import.
 */

import { TranslateModule, i18n, supportedLanguages } from '@miragon/bpmn-modeler-i18n';

// The plugin's long-standing call for translation contributions. Fires at bundle
// load; the contract test asserts on it.
console.log('Please help us translate by creating a pull request!');

// Dropdown options derived from the shared library, so a language added there
// shows up in the plugin automatically. `value` is the BCP-47 locale code.
export const options = supportedLanguages.map(({ label, locale }) => ({ value: locale, label }));

// Older plugin versions persisted JS-identifier locale keys (e.g. `pt_br`); the
// shared library uses BCP-47 codes (`pt-br`). Map the legacy keys so a language
// a user selected before this change keeps working after the upgrade.
const legacyLocales = {
    pt_br: 'pt-br',
    nl_nl: 'nl-nl',
    zh_Hans: 'zh-Hans',
    zh_Hant: 'zh-Hant',
};
export const canonicalLocale = (code) => legacyLocales[code] || code;

export { i18n, supportedLanguages };

export default TranslateModule;

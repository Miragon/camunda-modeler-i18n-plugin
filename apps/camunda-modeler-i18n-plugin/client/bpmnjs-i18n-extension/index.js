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

export const optionFor = (locale) => options.find((option) => option.value === locale);

export { i18n, supportedLanguages };

export default TranslateModule;

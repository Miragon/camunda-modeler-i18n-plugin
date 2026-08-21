/**
 * Public API of @miragon/bpmn-modeler-i18n.
 *
 * A shared, framework-agnostic set of translations for the bpmn-js / dmn-js
 * modeler UI (palette, context pad, properties panel, and general UI strings),
 * plus a didi translate module and supported-language metadata. Consumed by the
 * Camunda Modeler i18n plugin and the Miragon BPMN Modeler.
 */

export { TranslateModule, CustomTranslator, i18n } from './TranslateModule.js';
export { supportedLanguages, dictionaries } from './languages/index.js';
export type { SupportedLocale, LanguageEntry } from './languages/index.js';

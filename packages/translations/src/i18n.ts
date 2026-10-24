import { CustomTranslator } from './CustomTranslator.js';

/**
 * Shared singleton translator used across a modeler instance.
 *
 * {@link TranslateModule} registers this same instance as the modeler's
 * `customTranslator` / `translate` services, so every caller reads from one
 * dictionary and reacts to one {@link CustomTranslator.setLanguage} call.
 */
export const i18n = new CustomTranslator();

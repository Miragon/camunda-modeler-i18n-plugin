/**
 * Language registry: locale codes → display label and merged dictionary.
 *
 * Locale codes are BCP-47 (e.g. "pt-br", "zh-Hans"). Each dictionary maps the
 * English source string (the key bpmn-js/dmn-js passes to translate()) to its
 * localized value.
 */

import de from './de/index.js';
import en from './en/index.js';
import es from './es/index.js';
import fr from './fr/index.js';
import it from './it/index.js';
import ptBr from './pt-br/index.js';
import zhHans from './zh-Hans/index.js';
import zhHant from './zh-Hant/index.js';
import ru from './ru/index.js';
import nlNl from './nl-nl/index.js';
import ja from './ja/index.js';
import ko from './ko/index.js';

/**
 * A locale code supported by the translations library.
 */
export type SupportedLocale =
    | 'de'
    | 'en'
    | 'es'
    | 'fr'
    | 'it'
    | 'pt-br'
    | 'zh-Hans'
    | 'zh-Hant'
    | 'ru'
    | 'nl-nl'
    | 'ja'
    | 'ko';

/**
 * Metadata for a single supported language.
 */
export interface LanguageEntry {
    readonly label: string;
    readonly locale: SupportedLocale;
    readonly dictionary: Record<string, string>;
}

// All supported languages with display names and dictionaries (dropdown order).
export const supportedLanguages: readonly LanguageEntry[] = [
    { label: 'Deutsch', locale: 'de', dictionary: de },
    { label: 'English', locale: 'en', dictionary: en },
    { label: 'Español', locale: 'es', dictionary: es },
    { label: 'Français', locale: 'fr', dictionary: fr },
    { label: 'Italiano', locale: 'it', dictionary: it },
    { label: 'Português (Brasil)', locale: 'pt-br', dictionary: ptBr },
    { label: '简体中文', locale: 'zh-Hans', dictionary: zhHans },
    { label: '繁体中文', locale: 'zh-Hant', dictionary: zhHant },
    { label: 'Русский', locale: 'ru', dictionary: ru },
    { label: 'Nederlands (Netherlands)', locale: 'nl-nl', dictionary: nlNl },
    { label: '日本語', locale: 'ja', dictionary: ja },
    { label: '한국어', locale: 'ko', dictionary: ko },
] as const;

// Map from locale code to merged dictionary for fast lookup.
export const dictionaries: Record<SupportedLocale, Record<string, string>> = {
    de,
    en,
    es,
    fr,
    it,
    'pt-br': ptBr,
    'zh-Hans': zhHans,
    'zh-Hant': zhHant,
    ru,
    'nl-nl': nlNl,
    ja,
    ko,
};

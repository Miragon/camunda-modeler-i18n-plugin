/**
 * Locale dictionaries for the drift check, sourced from the shared
 * `@miragon/bpmn-modeler-i18n` library (its built `dist`).
 *
 * The library's own test suite guards key parity, `{placeholder}` preservation
 * and duplicate keys. Here the drift engine only needs each locale's merged
 * key→value dictionary to compare against the strings the Modeler asks to
 * translate, so this is a thin adapter over the library's `dictionaries` export.
 */

import { dictionaries } from '@miragon/bpmn-modeler-i18n';

/** @return {String[]} supported locale codes, e.g. ['de', 'en', 'pt-br', ...] */
export function listLocales() {
    return Object.keys(dictionaries).sort();
}

/** Loads a locale's merged dictionary in the shape the drift engine expects. */
export function loadLocale(locale) {
    const dictionary = dictionaries[locale];

    if (!dictionary) {
        throw new Error(`unknown locale: ${locale}`);
    }

    // `duplicates` / `unresolved` are guarded in the library's own tests now, so
    // they are always empty here; the drift ratchet reads them as zero.
    return {
        locale,
        dictionary: new Map(Object.entries(dictionary)),
        duplicates: [],
        unresolved: [],
    };
}

/** @return {Map<String, ReturnType<typeof loadLocale>>} */
export function loadAllLocales() {
    return new Map(listLocales().map((locale) => [locale, loadLocale(locale)]));
}

/** Extracts the `{placeholder}` names a string interpolates. */
export function placeholders(text) {
    return [...text.matchAll(/{([^}]+)}/g)].map((m) => m[1]).sort();
}

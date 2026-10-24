/**
 * Locale dictionaries for the drift check, sourced from the shared
 * `@miragon/bpmn-modeler-i18n` library (its built `dist`).
 *
 * The library's own test suite guards key parity, `{placeholder}` preservation
 * and duplicate keys. Here the drift engine only needs each locale's merged
 * key→value dictionary to compare against the strings the Modeler asks to
 * translate.
 */

import { dictionaries } from '@miragon/bpmn-modeler-i18n';

/** @return {Map<String, Map<String, String>>} locale code → merged dictionary, sorted by code */
export function loadAllLocales() {
    return new Map(
        Object.keys(dictionaries)
            .sort()
            .map((locale) => [locale, new Map(Object.entries(dictionaries[locale]))]),
    );
}

/** Extracts the `{placeholder}` names a string interpolates. */
export function placeholders(text) {
    return [...text.matchAll(/{([^}]+)}/g)].map((m) => m[1]).sort();
}

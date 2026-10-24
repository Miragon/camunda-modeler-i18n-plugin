/**
 * Compares our dictionaries against the Modeler's UI strings.
 *
 * Three buckets by severity: `missing` fails, `untranslated` is a ratchet
 * against a recorded baseline, `unknown` is informational. Key parity and
 * `{placeholder}` preservation are invariants of the library itself and are
 * guarded by its own test suite.
 */

import { dictionaries } from '@miragon/bpmn-modeler-i18n';

import { BASELINE_FILE, IGNORE_FILE, RUNTIME_KEYS_FILE } from './paths.mjs';
import UpstreamKeyCollector from './UpstreamKeyCollector.mjs';
import { readJson } from './utils/readJson.mjs';

const REFERENCE_LOCALE = 'en';

export default class TranslationDrift {
    #raw;

    /**
     * @param {Object} [options]
     * @param {Boolean} [options.raw] ignore the runtime-key allowlist, so `unknown`
     *   holds every undiscovered key. Used to regenerate that allowlist.
     */
    constructor({ raw = false } = {}) {
        this.#raw = raw;
    }

    analyse() {
        const ignored = new Set(Object.keys(readJson(IGNORE_FILE, {})));
        const allowlisted = new Set(this.#raw ? [] : readJson(RUNTIME_KEYS_FILE, []));

        const { keys: upstream, skipped, dynamic } = new UpstreamKeyCollector().collect();
        const ourKeys = new Set(Object.keys(dictionaries[REFERENCE_LOCALE]));

        const missing = [...upstream]
            .filter(([key]) => !ourKeys.has(key) && !ignored.has(key))
            .map(([key, source]) => ({ key, source }))
            .sort((a, b) => a.source.localeCompare(b.source) || a.key.localeCompare(b.key));

        const unknown = [...ourKeys]
            .filter((key) => !upstream.has(key) && !allowlisted.has(key))
            .sort();

        const locales = this.#coverageByLocale();
        const regressions = this.#regressionsAgainstBaseline(locales);

        return {
            reference: REFERENCE_LOCALE,
            upstreamKeys: upstream.size,
            ourKeys: ourKeys.size,
            dynamicCallSites: dynamic,
            skippedPackages: skipped,
            missing,
            unknown,
            regressions,
            locales,
            blocking: missing.length + regressions.length,
        };
    }

    #coverageByLocale() {
        const report = {};

        for (const locale of Object.keys(dictionaries).sort()) {
            const entries = Object.entries(dictionaries[locale]);
            const isReference = locale === REFERENCE_LOCALE;

            // English is the identity mapping, so counting it as untranslated is
            // meaningless.
            const untranslated = isReference
                ? 0
                : entries.filter(([key, value]) => key === value).length;

            report[locale] = {
                keys: entries.length,
                untranslated,
                translated: entries.length - untranslated,
                coverage: +((100 * (entries.length - untranslated)) / entries.length).toFixed(1),
                reference: isReference || undefined,
            };
        }

        return report;
    }

    #regressionsAgainstBaseline(locales) {
        const baseline = readJson(BASELINE_FILE, null);

        return Object.entries(locales)
            .filter(([locale, stats]) => {
                const before = baseline?.locales?.[locale];
                return before && stats.untranslated > before.untranslated;
            })
            .map(
                ([locale, stats]) =>
                    `${locale}: untranslated rose ${baseline.locales[locale].untranslated} -> ${stats.untranslated}`,
            );
    }
}

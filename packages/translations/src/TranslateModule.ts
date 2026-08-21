/**
 * Custom translator for bpmn-js / dmn-js that supports runtime language switching.
 *
 * Exposes a shared singleton {@link i18n} and a didi module ({@link TranslateModule})
 * that registers the same instance under the `translate` and `customTranslator`
 * services. UI that lives outside the modeler's DI container can import {@link i18n}
 * directly and subscribe to {@link CustomTranslator.onChange} to refresh labels when
 * the active language changes.
 */

import { dictionaries, type SupportedLocale } from './languages/index.js';

// Template keys already reported as missing, to avoid console spam.
const missingKeys = new Set<string>();

/**
 * Translates template strings using the active language dictionary.
 *
 * Registered as a didi service under the `translate` key. Holds a mutable locale
 * field that can be swapped at runtime via {@link setLanguage} — the next call to
 * {@link translate} uses the new dictionary immediately, and any listener
 * registered via {@link onChange} is notified so UI outside the DI container can
 * re-render its labels.
 */
export class CustomTranslator {
    static $inject: string[] = [];

    private locale: SupportedLocale = 'en';

    private dictionary: Record<string, string> = dictionaries['en'];

    private readonly listeners = new Set<() => void>();

    // Consumer-supplied entries merged on top of the bundled dictionaries, per
    // locale. Lets a host add its own keys (or override a shared translation)
    // without those strings living in this library. See {@link extend}.
    private readonly overrides: Partial<Record<SupportedLocale, Record<string, string>>> = {};

    /**
     * Translates a template string using the active language dictionary.
     *
     * Falls back to the original template when no translation is found and
     * replaces `{param}` placeholders with the values from `replacements`.
     * Unresolved placeholders are left untouched as `{key}`.
     *
     * @param template The English source string used as the dictionary key.
     * @param replacements Optional parameter map for `{key}` substitution.
     * @returns The translated (or original) string with placeholders resolved.
     */
    translate(template: string, replacements?: Record<string, string>): string {
        if (this.locale !== 'en' && !this.dictionary[template] && !missingKeys.has(template)) {
            missingKeys.add(template);
            console.log(`Missing translation [${this.locale}]: ${template}`);
        }

        const translation = this.dictionary[template] || template;

        return translation.replace(
            /{([^}]+)}/g,
            (_, key: string) => (replacements || {})[key] ?? `{${key}}`,
        );
    }

    /**
     * Switches the active language dictionary and notifies subscribers.
     *
     * An unknown locale falls back to the default (`en`) rather than throwing.
     * Modeler UI needs a diagram refresh to re-invoke `translate()` for already
     * rendered elements; UI registered via {@link onChange} is notified directly.
     *
     * @param locale The locale code to switch to.
     */
    setLanguage(locale: SupportedLocale): void {
        this.locale = dictionaries[locale] ? locale : 'en';
        this.dictionary = this.resolve(this.locale);
        this.notify();
    }

    /**
     * Extends (or overrides) the bundled dictionaries with consumer-supplied
     * entries, per locale, at runtime.
     *
     * A host can add keys the shared library deliberately does not ship — its own
     * product-specific UI, engine-specific labels, internal diagnostics — or
     * override a shared translation locally, without any of it living in this
     * library. Consumer entries win on conflict, persist across
     * {@link setLanguage}, and merge cumulatively across repeated calls. Active
     * subscribers are notified so they can re-render.
     *
     * @param extra Locale code → additional `{ source: translation }` entries.
     */
    extend(extra: Partial<Record<SupportedLocale, Record<string, string>>>): void {
        for (const [locale, entries] of Object.entries(extra)) {
            if (!entries) {
                continue;
            }
            const code = locale as SupportedLocale;
            this.overrides[code] = { ...(this.overrides[code] ?? {}), ...entries };
        }
        this.dictionary = this.resolve(this.locale);
        this.notify();
    }

    /** Merges any consumer overrides for a locale on top of its bundled dictionary. */
    private resolve(locale: SupportedLocale): Record<string, string> {
        const extra = this.overrides[locale];
        return extra ? { ...dictionaries[locale], ...extra } : dictionaries[locale];
    }

    private notify(): void {
        for (const listener of this.listeners) {
            listener();
        }
    }

    /**
     * Returns the currently active locale code.
     */
    getLocale(): SupportedLocale {
        return this.locale;
    }

    /**
     * Registers a listener invoked whenever {@link setLanguage} switches locale.
     *
     * @param listener Callback fired after the locale has been updated.
     * @returns Unsubscribe function — call to stop receiving notifications.
     */
    onChange(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
}

/**
 * Shared singleton translator used across a modeler instance.
 *
 * The {@link TranslateModule} below registers this same instance as the modeler's
 * `customTranslator` / `translate` services, so every caller reads from one
 * dictionary and reacts to one {@link CustomTranslator.setLanguage} call.
 */
export const i18n = new CustomTranslator();

/**
 * didi module that binds the shared {@link i18n} instance as the modeler's
 * `customTranslator` service and exposes its `translate` method as the callable
 * `translate` service that bpmn-js / dmn-js expect.
 */
export const TranslateModule = {
    __init__: ['customTranslator'],
    customTranslator: ['value', i18n],
    translate: [
        'factory',
        function translateFactory(customTranslator: CustomTranslator) {
            return function translate(
                template: string,
                replacements?: Record<string, string>,
            ): string {
                return customTranslator.translate(template, replacements);
            };
        },
    ],
};

// Make the translate factory injectable.
(TranslateModule.translate as unknown as { $inject: string[] }[])[1].$inject = ['customTranslator'];

import { dictionaries, type SupportedLocale } from './languages/index.js';

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

    private readonly reportedMissingKeys = new Set<string>();

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
        this.reportIfMissing(template);

        const translation = this.dictionary[template] || template;

        return translation.replace(
            /{([^}]+)}/g,
            (_, key: string) => (replacements || {})[key] ?? `{${key}}`,
        );
    }

    private reportIfMissing(template: string): void {
        const isMissing = this.locale !== 'en' && !this.dictionary[template];
        if (!isMissing || this.reportedMissingKeys.has(template)) {
            return;
        }
        this.reportedMissingKeys.add(template);
        console.log(`Missing translation [${this.locale}]: ${template}`);
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

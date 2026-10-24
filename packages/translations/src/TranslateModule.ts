import type { CustomTranslator } from './CustomTranslator.js';
import { i18n } from './i18n.js';

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
        [
            'customTranslator',
            (customTranslator: CustomTranslator) =>
                (template: string, replacements?: Record<string, string>): string =>
                    customTranslator.translate(template, replacements),
        ],
    ],
};

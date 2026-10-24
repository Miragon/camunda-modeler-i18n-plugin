import { describe, it, expect } from 'vitest';

import { bpmnMiddleware, dmnMiddleware } from '../../client/config/editorMiddlewares.js';

const translateModule = { __init__: ['customTranslator'] };
const otherModule = { __init__: [] };
const dmnEditors = ['drd', 'decisionTable', 'literalExpression'];

describe('bpmn middleware', () => {
    it('adds the module to an empty config', () => {
        expect(bpmnMiddleware(translateModule)({}).additionalModules).toEqual([translateModule]);
    });

    it('keeps modules and options other plugins contributed', () => {
        const config = bpmnMiddleware(translateModule)({
            additionalModules: [otherModule],
            keyboard: { bindTo: 'window' },
        });

        expect(config.additionalModules).toEqual([otherModule, translateModule]);
        expect(config.keyboard).toEqual({ bindTo: 'window' });
    });
});

describe('dmn middleware', () => {
    it.each(dmnEditors)('adds the module to the %s editor', (editor) => {
        expect(dmnMiddleware(translateModule)({})[editor].additionalModules).toEqual([
            translateModule,
        ]);
    });

    it.each(dmnEditors)('keeps what other plugins contributed to the %s editor', (editor) => {
        const config = dmnMiddleware(translateModule)({
            [editor]: { additionalModules: [otherModule], moddleExtensions: { x: {} } },
        });

        expect(config[editor].additionalModules).toEqual([otherModule, translateModule]);
        expect(config[editor].moddleExtensions).toEqual({ x: {} });
    });

    it('leaves the rest of the config untouched', () => {
        const config = dmnMiddleware(translateModule)({ common: { keyboard: {} } });

        expect(config.common).toEqual({ keyboard: {} });
    });
});

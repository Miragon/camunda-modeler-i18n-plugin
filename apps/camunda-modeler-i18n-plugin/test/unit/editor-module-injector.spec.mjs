import { describe, it, expect } from 'vitest';

import EditorModuleInjector from '../../client/editors/EditorModuleInjector.js';

const translateModule = { __init__: ['customTranslator'] };
const otherModule = { __init__: [] };
const dmnEditors = ['drd', 'decisionTable', 'literalExpression'];
const injector = new EditorModuleInjector(translateModule);

describe('extending a BPMN editor', () => {
    it('adds the module to an empty config', () => {
        expect(injector.extendBpmn({}).additionalModules).toEqual([translateModule]);
    });

    it('keeps modules and options other plugins contributed', () => {
        const config = injector.extendBpmn({
            additionalModules: [otherModule],
            keyboard: { bindTo: 'window' },
        });

        expect(config.additionalModules).toEqual([otherModule, translateModule]);
        expect(config.keyboard).toEqual({ bindTo: 'window' });
    });
});

describe('extending a DMN editor', () => {
    it.each(dmnEditors)('adds the module to the %s editor', (editor) => {
        expect(injector.extendDmn({})[editor].additionalModules).toEqual([translateModule]);
    });

    it.each(dmnEditors)('keeps what other plugins contributed to the %s editor', (editor) => {
        const config = injector.extendDmn({
            [editor]: { additionalModules: [otherModule], moddleExtensions: { x: {} } },
        });

        expect(config[editor].additionalModules).toEqual([otherModule, translateModule]);
        expect(config[editor].moddleExtensions).toEqual({ x: {} });
    });

    it('leaves the rest of the config untouched', () => {
        const config = injector.extendDmn({ common: { keyboard: {} } });

        expect(config.common).toEqual({ keyboard: {} });
    });
});

const dmnEditors = ['drd', 'decisionTable', 'literalExpression'];

export default class EditorModuleInjector {
    #extensionModule;

    constructor(extensionModule) {
        this.#extensionModule = extensionModule;
    }

    subscribeTo(subscribe) {
        subscribe('bpmn.modeler.configure', ({ middlewares }) => {
            middlewares.push((config) => this.extendBpmn(config));
        });

        subscribe('dmn.modeler.configure', ({ middlewares }) => {
            middlewares.push((config) => this.extendDmn(config));
        });
    }

    extendBpmn(config) {
        return this.#withExtensionModule(config);
    }

    extendDmn(config) {
        const extendedEditors = dmnEditors.map((editor) => [
            editor,
            this.#withExtensionModule(config[editor]),
        ]);

        return { ...config, ...Object.fromEntries(extendedEditors) };
    }

    #withExtensionModule(editorConfig = {}) {
        return {
            ...editorConfig,
            additionalModules: [...(editorConfig.additionalModules || []), this.#extensionModule],
        };
    }
}

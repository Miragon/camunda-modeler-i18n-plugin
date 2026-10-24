const dmnEditors = ['drd', 'decisionTable', 'literalExpression'];

const withModule = (editorConfig = {}, extensionModule) => ({
    ...editorConfig,
    additionalModules: [...(editorConfig.additionalModules || []), extensionModule],
});

export const bpmnMiddleware = (extensionModule) => (config) => withModule(config, extensionModule);

export const dmnMiddleware = (extensionModule) => (config) => ({
    ...config,
    ...Object.fromEntries(
        dmnEditors.map((editor) => [editor, withModule(config[editor], extensionModule)]),
    ),
});

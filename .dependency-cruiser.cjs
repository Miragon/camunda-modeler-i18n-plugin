/**
 * Architecture boundary: the shared translations library is a leaf. It must not
 * depend on the Camunda Modeler plugin (the plugin depends on it, never the
 * reverse), and nothing may introduce a dependency cycle.
 */
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    forbidden: [
        {
            name: 'lib-not-depend-on-plugin',
            comment:
                'The shared translations library must stay a leaf — no dependency on the plugin.',
            severity: 'error',
            from: { path: '^packages/translations/src' },
            to: { path: '^apps/camunda-modeler-i18n-plugin' },
        },
        {
            name: 'no-circular',
            comment: 'No circular dependencies.',
            severity: 'error',
            from: {},
            to: { circular: true },
        },
    ],
    options: {
        doNotFollow: { path: 'node_modules' },
        tsConfig: { fileName: 'tsconfig.base.json' },
        tsPreCompilationDeps: true,
        enhancedResolveOptions: {
            exportsFields: ['exports'],
            conditionNames: ['import', 'require', 'node', 'default', 'types'],
        },
    },
};

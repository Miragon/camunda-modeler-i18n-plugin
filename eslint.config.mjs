import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/**
 * Flat config for the monorepo.
 *
 * Three source shapes: the TypeScript translations library, the plugin's React
 * client (browser + classic JSX runtime), and the plugin's Node tooling / tests
 * (.mjs). Build and tool configs are ignored; Prettier owns formatting.
 */
export default tseslint.config(
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/coverage/**',
            '**/*.tsbuildinfo',
            '**/*.config.{js,cjs,mjs,ts}',
            '.dependency-cruiser.cjs',
        ],
    },

    js.configs.recommended,

    // Shared translations library (TypeScript, Node-targeted, no DOM).
    {
        files: ['packages/translations/**/*.ts'],
        extends: [...tseslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.node },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
        },
    },

    // Plugin React client (browser globals, classic JSX runtime).
    {
        files: ['apps/camunda-modeler-i18n-plugin/client/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: { ...globals.browser },
        },
        rules: {
            // Core ESLint can't see that JSX references React and the capitalized
            // components it renders (that needs eslint-plugin-react, which does not
            // yet support ESLint 10). Ignore capitalized identifiers so real unused
            // locals are still caught; `_`-prefixed args/vars stay ignored too.
            'no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^(_|[A-Z])' },
            ],
        },
    },

    // Plugin Node tooling and tests (.mjs); the browser test entries also run in
    // Chromium, so both global sets apply.
    {
        files: [
            'apps/camunda-modeler-i18n-plugin/**/*.mjs',
            'apps/camunda-modeler-i18n-plugin/test/**/*.js',
        ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.node, ...globals.browser },
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        },
    },

    // Classes first: behaviour lives in classes, one per file; pure helpers go to a
    // `utils/` folder. Scripts, specs and browser test entries are exempt.
    {
        files: [
            'packages/translations/src/**/*.ts',
            'apps/camunda-modeler-i18n-plugin/client/**/*.js',
            'apps/camunda-modeler-i18n-plugin/test/lib/**/*.mjs',
        ],
        ignores: ['**/utils/**'],
        rules: {
            'max-classes-per-file': ['error', 1],
            'no-restricted-syntax': [
                'error',
                ...[
                    'Program > FunctionDeclaration',
                    'Program > ExportNamedDeclaration > FunctionDeclaration',
                    'Program > ExportDefaultDeclaration > FunctionDeclaration',
                    'Program > ExportDefaultDeclaration > ArrowFunctionExpression',
                    'Program > VariableDeclaration > VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)',
                    'Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)',
                ].map((selector) => ({
                    selector,
                    message:
                        'Top-level functions belong in a class, or in a utils/ module when they are pure helpers.',
                })),
            ],
        },
    },

    // Plugin manifest (CommonJS).
    {
        files: ['apps/camunda-modeler-i18n-plugin/index.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: { ...globals.node },
        },
    },

    prettier,
);

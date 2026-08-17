import { defineConfig } from 'vitest/config';
import { transform } from 'esbuild';

/**
 * The sources keep JSX in plain `.js` files; Vite only loads JSX from `.jsx`.
 * `jsx: 'transform'` mirrors `@babel/preset-react` in `webpack.config.js`.
 */
const jsxInJs = {
    name: 'i18n-plugin:jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
        if (!/\/client\/.*\.js$/.test(id)) {
            return null;
        }

        const { code: js, map } = await transform(code, {
            loader: 'jsx',
            jsx: 'transform',
            sourcefile: id,
            sourcemap: true
        });

        return { code: js, map };
    }
};

export default defineConfig({
    plugins: [ jsxInJs ],
    test: {
        include: [ 'test/**/*.spec.{js,mjs}' ],

        // `npm test` stays fast and browserless. The suites that need a real
        // browser or the Modeler binary have their own configs and own scripts,
        // because CI has to install those prerequisites first.
        exclude: [ '**/node_modules/**', 'test/integration/**', 'test/e2e/**' ],

        // Specs needing a DOM opt in with a `@vitest-environment` docblock.
        environment: 'node',
        testTimeout: 20000
    },
    resolve: {
        alias: {
            // The build maps `react` onto the Modeler's React; tests invert it.
            'camunda-modeler-plugin-helpers/vendor/react': 'react'
        }
    }
});

import { defineConfig } from 'vitest/config';

/**
 * Kept out of `npm test` because it launches Chromium: bpmn-js needs SVG layout
 * jsdom does not implement. Run `npx playwright install chromium` once first.
 */
export default defineConfig({
    test: {
        include: ['test/integration/**/*.spec.mjs'],
        environment: 'node',
        testTimeout: 60000,
        hookTimeout: 120000,
    },
});

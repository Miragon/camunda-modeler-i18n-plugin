import { defineConfig } from 'vitest/config';

/**
 * The Modeler E2E suite is excluded from `npm test`: it needs a 150 MB download
 * and launches Electron several times. `npm run test:e2e` opts in.
 */
export default defineConfig({
    test: {
        include: ['test/e2e/**/*.spec.mjs'],
        environment: 'node',

        // Each launch boots a full Electron app and opens a diagram.
        testTimeout: 120000,
        hookTimeout: 300000,

        // Electron windows compete for focus; one at a time keeps it honest.
        fileParallelism: false,
    },
});

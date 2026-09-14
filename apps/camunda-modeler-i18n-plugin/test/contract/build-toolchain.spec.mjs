import { createRequire } from 'node:module';

import { expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const plugin = require('../../package.json');
const requireFromLoader = createRequire(require.resolve('babel-loader'));

it('webpack uses the declared Babel core instead of a hoisted older major', () => {
    // babel-loader resolves core from its own location, not the plugin workspace.
    // Without this guard, a core upgrade can pass CI while still building with 7.
    expect(requireFromLoader('@babel/core/package.json').version).toBe(
        plugin.devDependencies['@babel/core'],
    );
});

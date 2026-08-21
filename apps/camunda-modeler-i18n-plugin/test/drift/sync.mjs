#!/usr/bin/env node
/**
 * Refreshes the vendored bpmn-js key list so the drift check follows the
 * Modeler rather than a hand-maintained list. Vendored rather than fetched at
 * check time so pull-request runs stay offline.
 *
 *   --modeler latest|v5.50.1   which release to follow (default: supportedModeler)
 *   --check                    report drift, write nothing
 *   --write-deps               pin our dependencies to the Modeler's versions
 */

import fs from 'node:fs';
import path from 'node:path';

import { PUBLISHED_FIXTURE } from '../lib/upstream.mjs';

// The plugin package (holds `supportedModeler` and the camunda-* dev-deps) and
// the workspace root (holds the `overrides` block npm only honors at the root).
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const WORKSPACE_ROOT = path.resolve(ROOT, '..', '..');
const PLUGIN_PKG = path.join(ROOT, 'package.json');
const ROOT_PKG = path.join(WORKSPACE_ROOT, 'package.json');

// npm workspaces hoist dependencies to the root node_modules, but a conflict can
// leave one nested under the plugin.
const NODE_MODULES_ROOTS = [WORKSPACE_ROOT, ROOT];

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const writeDeps = args.includes('--write-deps');

// We depend on these two directly; everything else reaches us through them, so
// it has to be pinned with `overrides` or npm resolves something newer than the
// Modeler ships and we extract keys from the wrong version.
const DIRECT_DEPS = ['camunda-bpmn-js', 'camunda-dmn-js'];
const flag = (name) => {
    const i = args.indexOf(name);
    return i === -1 ? null : args[i + 1];
};

const pkg = JSON.parse(fs.readFileSync(PLUGIN_PKG, 'utf8'));
const requested = flag('--modeler') ?? pkg.supportedModeler ?? 'latest';

async function get(url, asJson) {
    const response = await fetch(url, { headers: { 'user-agent': 'camunda-modeler-i18n-plugin' } });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} for ${url}`);
    }

    return asJson ? response.json() : response.text();
}

async function resolveModelerTag(spec) {
    if (spec !== 'latest') {
        return spec.startsWith('v') ? spec : `v${spec}`;
    }

    const release = await get(
        'https://api.github.com/repos/camunda/camunda-modeler/releases/latest',
        true,
    );

    return release.tag_name;
}

/** Reads the Modeler's own manifest, so we check what users actually run. */
async function modelerDependencies(tag) {
    const manifest = JSON.parse(
        await get(
            `https://raw.githubusercontent.com/camunda/camunda-modeler/${tag}/client/package.json`,
        ),
    );

    const deps = { ...manifest.dependencies, ...manifest.devDependencies };
    const interesting = [
        'bpmn-js',
        'dmn-js',
        'camunda-bpmn-js',
        'camunda-dmn-js',
        'bpmn-js-properties-panel',
        'dmn-js-properties-panel',
        '@bpmn-io/properties-panel',
        'bpmn-js-element-templates',
    ];

    return Object.fromEntries(interesting.filter((n) => deps[n]).map((n) => [n, deps[n]]));
}

const clean = (range) => range.replace(/^[\^~]/, '');

const installedVersion = (name) => {
    for (const root of NODE_MODULES_ROOTS) {
        try {
            return JSON.parse(
                fs.readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8'),
            ).version;
        } catch {
            // try the next root
        }
    }
    return null;
};

const tag = await resolveModelerTag(requested);

console.log(`Camunda Modeler ${tag}`);

const deps = await modelerDependencies(tag);

for (const [name, range] of Object.entries(deps)) {
    const installed = installedVersion(name);
    const drifted = installed && installed !== clean(range);

    console.log(
        `  ${name.padEnd(28)} modeler ${range.padEnd(12)} installed ${installed ?? '-'}` +
            (drifted ? '   <- drifted' : ''),
    );
}

if (writeDeps) {
    // supportedModeler + the direct camunda-* dev-deps live in the plugin package;
    // the transitive `overrides` live in the workspace-root package.
    const plugin = JSON.parse(fs.readFileSync(PLUGIN_PKG, 'utf8'));
    const root = JSON.parse(fs.readFileSync(ROOT_PKG, 'utf8'));

    plugin.supportedModeler = tag.replace(/^v/, '');

    const overrides = { ...root.overrides };

    for (const [name, range] of Object.entries(deps)) {
        const exact = clean(range);

        if (DIRECT_DEPS.includes(name)) {
            plugin.devDependencies[name] = exact;
        } else {
            overrides[name] = exact;
        }
    }

    root.overrides = Object.fromEntries(Object.entries(overrides).sort());

    fs.writeFileSync(PLUGIN_PKG, JSON.stringify(plugin, null, 4) + '\n');
    fs.writeFileSync(ROOT_PKG, JSON.stringify(root, null, 4) + '\n');

    console.log('\nPinned the plugin package (supportedModeler + camunda-* deps) and the');
    console.log('root overrides to this release. Now run:');
    console.log('  npm install && npm run harvest && npm run check:translations');
}

const bpmnJsTag = `v${clean(deps['bpmn-js'])}`;
const keys = JSON.parse(
    await get(
        `https://raw.githubusercontent.com/bpmn-io/bpmn-js/${bpmnJsTag}/docs/translations.json`,
    ),
);

const current = fs.existsSync(PUBLISHED_FIXTURE)
    ? JSON.parse(fs.readFileSync(PUBLISHED_FIXTURE, 'utf8'))
    : [];

const added = keys.filter((k) => !current.includes(k));
const removed = current.filter((k) => !keys.includes(k));

console.log(`\nbpmn-js ${bpmnJsTag}: ${keys.length} published keys (vendored: ${current.length})`);

if (added.length) {
    console.log(`\n  new upstream strings (${added.length}):`);
    added.forEach((k) => console.log(`    ${JSON.stringify(k)}`));
}

if (removed.length) {
    console.log(`\n  no longer upstream (${removed.length}):`);
    removed.forEach((k) => console.log(`    ${JSON.stringify(k)}`));
}

if (!added.length && !removed.length) {
    console.log('  up to date');
}

if (checkOnly) {
    process.exit(added.length || removed.length ? 1 : 0);
}

fs.writeFileSync(PUBLISHED_FIXTURE, JSON.stringify(keys, null, 2) + '\n');
console.log(`\nWrote ${path.relative(ROOT, PUBLISHED_FIXTURE)}`);

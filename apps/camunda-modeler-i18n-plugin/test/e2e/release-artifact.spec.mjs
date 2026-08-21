/**
 * Installs the plugin from a release zip instead of the working tree.
 *
 * `plugin.spec.mjs` proves the sources work in the Modeler; this proves the
 * thing we actually ship does. It packs exactly what `release.yml` packs, so a
 * missing file or a wrong folder layout fails here rather than in an issue.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { _electron as electron } from 'playwright';

import { modelerBinary, createProfile, cleanup } from './modeler.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const executablePath = modelerBinary();

/** Mirrors the `zip -r ... index.js dist/` step in release.yml. */
function packRelease() {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'cm-i18n-release-'));
    const archive = path.join(workspace, 'plugin.zip');
    const unpacked = path.join(workspace, 'unpacked');

    execFileSync('zip', ['-r', '-q', archive, 'index.js', 'dist/'], { cwd: ROOT });
    fs.mkdirSync(unpacked, { recursive: true });
    execFileSync('unzip', ['-q', archive, '-d', unpacked]);

    return { workspace, archive, unpacked };
}

describe.skipIf(!executablePath)('the released artefact', () => {
    let release;
    let app;
    let profile;
    let state;
    let errors;

    beforeAll(async () => {
        release = packRelease();

        ({ profile } = createProfile({ language: 'de', source: release.unpacked }));

        app = await electron.launch({
            executablePath,
            args: [`--user-data-dir=${profile}`, '--disable-remote-interaction=true'],
        });

        const window = await app.firstWindow();

        errors = [];
        window.on('pageerror', (error) => errors.push(error.message));

        await window.waitForSelector('.tabs', { timeout: 60000 });
        await window.getByText('BPMN diagram', { exact: true }).first().click();
        await window.waitForSelector('.djs-palette', { timeout: 30000 });

        state = await window.evaluate(() => ({
            registered: (window.plugins || []).map((entry) => entry.type),
            palette: [...document.querySelectorAll('.djs-palette [title]')].map((entry) =>
                entry.getAttribute('title'),
            ),
        }));
    }, 300000);

    afterAll(async () => {
        await app?.close().catch(() => {});
        if (profile) {
            cleanup(profile);
        }
        if (release) {
            cleanup(release.workspace);
        }
    });

    it('contains the two paths the Modeler needs', () => {
        expect(fs.existsSync(path.join(release.unpacked, 'index.js'))).toBe(true);
        expect(fs.existsSync(path.join(release.unpacked, 'dist', 'client.js'))).toBe(true);
    });

    it('loads from the zip without a renderer error', () => {
        expect(errors).toEqual([]);
    });

    it('registers and translates', () => {
        expect(state.registered).toContain('client');
        expect(state.palette).toContain('Handwerkzeug aktivieren');
    });
});

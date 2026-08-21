/**
 * Drives the real Camunda Modeler with the plugin installed.
 *
 * Every other layer tests our sources or the libraries they translate. This one
 * tests the artefact inside its host: that the Modeler finds the plugin at all,
 * that the bundle survives the React and component globals it is given, and that
 * a user actually sees translated text.
 *
 * Requires `npm run e2e:setup`; skips itself when the Modeler is not cached.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { _electron as electron } from 'playwright';

import { modelerBinary, createProfile, cleanup } from './modeler.mjs';

const executablePath = modelerBinary();

/**
 * Launches against a throwaway profile and opens a Camunda 8 BPMN diagram, so
 * the palette and properties panel are on screen.
 *
 * @param {Object} options passed to `createProfile`
 */
async function open(options) {
    const { profile } = createProfile(options);

    const app = await electron.launch({
        executablePath,
        args: [`--user-data-dir=${profile}`, '--disable-remote-interaction=true'],
    });

    const window = await app.firstWindow();
    const errors = [];

    window.on('pageerror', (error) => errors.push(error.message));

    await window.waitForSelector('.tabs', { timeout: 60000 });

    // The welcome screen's card, rather than the application menu: the Modeler's
    // menu handler expects a real click event and throws when invoked directly.
    await window.getByText('BPMN diagram', { exact: true }).first().click();
    await window.waitForSelector('.djs-palette', { timeout: 30000 });
    await window.waitForSelector('.bio-properties-panel-group-header-title', { timeout: 30000 });

    const read = () =>
        window.evaluate(() => ({
            registered: (window.plugins || []).map((entry) => entry.type),
            languageControl: document.querySelectorAll('[name="language_selection"]').length,
            palette: [...document.querySelectorAll('.djs-palette [title]')].map((entry) =>
                entry.getAttribute('title'),
            ),
            propertyGroups: [
                ...document.querySelectorAll('.bio-properties-panel-group-header-title'),
            ].map((entry) => entry.textContent),
        }));

    return { app, window, profile, errors, read };
}

describe.skipIf(!executablePath)('Camunda Modeler with the plugin installed', () => {
    let german;
    let english;
    let state;

    beforeAll(async () => {
        german = await open({ language: 'de' });
        state = await german.read();

        english = await open({ language: 'en' });
    }, 300000);

    afterAll(async () => {
        for (const session of [german, english]) {
            await session?.app.close().catch(() => {});
            if (session) {
                cleanup(session.profile);
            }
        }
    });

    it('loads without a renderer error', () => {
        // A moved export or a missing global throws here, exactly as it did when
        // plugin-helpers v6 relocated its components.
        expect(german.errors).toEqual([]);
    });

    it('registers itself as a client extension', () => {
        expect(state.registered).toContain('client');
    });

    it('renders the language dropdown in the toolbar', () => {
        expect(state.languageControl).toBe(1);
    });

    it('translates the palette', () => {
        expect(state.palette).toContain('Handwerkzeug aktivieren');
        expect(state.palette).toContain('Startereignis erstellen');
    });

    it('translates the properties panel', () => {
        expect(state.propertyGroups).toContain('Allgemein');
        expect(state.propertyGroups).toContain('Dokumentation');
    });

    it('leaves the UI in English when English is selected', async () => {
        const plain = await english.read();

        expect(plain.palette).toContain('Activate hand tool');
        expect(plain.propertyGroups).toContain('General');
    });
});

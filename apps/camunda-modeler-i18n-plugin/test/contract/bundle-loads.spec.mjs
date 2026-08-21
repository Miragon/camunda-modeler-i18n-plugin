/**
 * @vitest-environment jsdom
 */

/**
 * Loads the shipped bundle the way the Modeler does and asserts it registers
 * itself. Regression test for plugin-helpers v6 moving `Fill`/`Modal` out of a
 * barrel, which broke the build unnoticed.
 *
 * plugin-helpers resolves components at *module load time*, so a renamed global
 * or moved export path throws on import rather than in front of a user.
 */

import fs from 'node:fs';
import path from 'node:path';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import * as React from 'react';

const BUNDLE = path.resolve(import.meta.dirname, '..', '..', 'dist', 'client.js');

/** The only globals the Modeler exposes to a client extension. */
function installModelerGlobals() {
    const Fill = ({ children }) => children ?? null;
    const Modal = ({ children }) => children ?? null;

    Modal.Title = ({ children }) => children ?? null;
    Modal.Body = ({ children }) => children ?? null;
    Modal.Footer = ({ children }) => children ?? null;

    window.react = React;
    window.components = { Fill, Modal };
    window.plugins = [];
}

/** Executes the bundle as a classic script, exactly as the Modeler injects it. */
function loadBundle() {
    const code = fs.readFileSync(BUNDLE, 'utf8');

    new Function(code).call(window);
}

describe('shipped bundle', () => {
    let errors;
    let logs;

    beforeEach(() => {
        installModelerGlobals();
        errors = vi.spyOn(console, 'error').mockImplementation(() => {});
        logs = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete window.react;
        delete window.components;
        delete window.plugins;
    });

    it('exists — run `npm run build` first', () => {
        expect(fs.existsSync(BUNDLE), `${BUNDLE} is missing`).toBe(true);
    });

    it('loads without throwing', () => {
        expect(() => loadBundle()).not.toThrow();
    });

    it('registers exactly one client extension', () => {
        loadBundle();

        expect(window.plugins).toHaveLength(1);
        expect(window.plugins[0].type).toBe('client');
        expect(typeof window.plugins[0].plugin).toBe('function');
    });

    it('fails loudly when the Modeler does not provide components', () => {
        delete window.components;

        expect(() => loadBundle()).toThrow(/Not compatible with Camunda Modeler/);
    });

    it('fails loudly when the Modeler does not provide React', () => {
        delete window.react;

        expect(() => loadBundle()).toThrow(/Not compatible with Camunda Modeler/);
    });

    // We import `vendor/react` directly rather than the deprecated
    // `plugin-helpers/react` shim, which is slated for removal. Asserting on
    // zero warnings is what keeps us off a path upstream is retiring.
    it('emits no warnings at all', () => {
        loadBundle();

        expect(errors.mock.calls.map(([msg]) => String(msg))).toEqual([]);
    });

    it('greets translators', () => {
        loadBundle();

        expect(logs.mock.calls.map(([m]) => String(m))).toContain(
            'Please help us translate by creating a pull request!',
        );
    });
});

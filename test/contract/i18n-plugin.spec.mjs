/**
 * @vitest-environment jsdom
 */

/**
 * Pins the plugin's contract with the Modeler: the slot it claims, the editor
 * events it subscribes to, and the middleware shape it pushes. None of it is
 * documented or type-checked upstream.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import * as React from 'react';

/** Records what the component renders into a Fill without a real slot host. */
const fills = [];

function installModelerGlobals() {
    fills.length = 0;

    const Fill = props => {
        fills.push(props);
        return null;
    };

    const Modal = ({ children }) => React.createElement('div', { role: 'dialog' }, children);

    Modal.Title = ({ children }) => React.createElement('h2', null, children);
    Modal.Body = ({ children }) => React.createElement('div', null, children);
    Modal.Footer = ({ children }) => React.createElement('div', null, children);

    window.react = React;
    window.components = { Fill, Modal };
    window.plugins = [];
}

/** Imported after the globals exist; plugin-helpers resolves them on load. */
async function loadPlugin() {
    return (await import('../../client/config/I18nPlugin.js')).default;
}

/** Minimal stand-ins for the two props the Modeler passes a client extension. */
function createProps(storedConfig) {
    const subscriptions = new Map();
    const saved = [];

    return {
        subscriptions,
        saved,
        props: {
            config: {
                getForPlugin: vi.fn().mockResolvedValue(storedConfig),
                setForPlugin: vi.fn((key, name, value) => {
                    saved.push({ key, name, value });
                    return Promise.resolve();
                })
            },
            subscribe: vi.fn((event, callback) => {
                subscriptions.set(event, callback);
            })
        }
    };
}

/** Runs every middleware registered for an event over a starting config. */
function applyMiddlewares(callback, initial = {}) {
    const middlewares = [];

    callback({ middlewares });

    return middlewares.reduce((config, middleware) => middleware(config), initial);
}

describe('I18nPlugin', () => {

    let render, act, cleanup;

    beforeEach(async () => {
        installModelerGlobals();
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});

        ({ render, act, cleanup } = await import('@testing-library/react'));
    });

    afterEach(() => {
        cleanup?.();
        vi.restoreAllMocks();
        vi.resetModules();
        delete window.react;
        delete window.components;
        delete window.plugins;
    });

    const stored = { currentLanguage: { value: 'de', label: 'Deutsch' } };

    describe('toolbar control', () => {

        it('renders into the tab-actions slot', async () => {
            const I18nPlugin = await loadPlugin();
            const { props } = createProps(stored);

            await act(async () => {
                render(React.createElement(I18nPlugin, props));
            });

            expect(fills.length).toBeGreaterThan(0);

            // Modeler 5.0 removed the `toolbar` slot; `tab-actions` replaced it.
            for (const fill of fills) {
                expect(fill.slot).toBe('tab-actions');
                expect(fill.group).toBe('9_language');
            }
        });

        it('offers a language for every registered locale', async () => {
            const I18nPlugin = await loadPlugin();
            const { props } = createProps(stored);

            await act(async () => {
                render(React.createElement(I18nPlugin, props));
            });

            const select = fills[0].children;

            expect(select.props.options.length).toBeGreaterThanOrEqual(12);
            expect(select.props.options.map(o => o.value)).toContain('de');
        });
    });

    describe('editor wiring', () => {

        it('subscribes to both the BPMN and the DMN editor', async () => {
            const I18nPlugin = await loadPlugin();
            const { props, subscriptions } = createProps(stored);

            await act(async () => {
                render(React.createElement(I18nPlugin, props));
            });

            expect([ ...subscriptions.keys() ].sort())
                .toEqual([ 'bpmn.modeler.configure', 'dmn.modeler.configure' ]);
        });

        it('adds the translate module to the BPMN editor', async () => {
            const I18nPlugin = await loadPlugin();
            const translateModule =
                (await import('../../client/bpmnjs-i18n-extension/index.js')).default;
            const { props, subscriptions } = createProps(stored);

            await act(async () => {
                render(React.createElement(I18nPlugin, props));
            });

            const config = applyMiddlewares(subscriptions.get('bpmn.modeler.configure'));

            expect(config.additionalModules).toContain(translateModule);
        });

        it('preserves additional modules contributed by other plugins', async () => {
            const I18nPlugin = await loadPlugin();
            const other = { __init__: [] };
            const { props, subscriptions } = createProps(stored);

            await act(async () => {
                render(React.createElement(I18nPlugin, props));
            });

            const config = applyMiddlewares(
                subscriptions.get('bpmn.modeler.configure'),
                { additionalModules: [ other ] }
            );

            expect(config.additionalModules).toContain(other);
        });

        it('adds the translate module to all three DMN sub-editors', async () => {
            const I18nPlugin = await loadPlugin();
            const translateModule =
                (await import('../../client/bpmnjs-i18n-extension/index.js')).default;
            const { props, subscriptions } = createProps(stored);

            await act(async () => {
                render(React.createElement(I18nPlugin, props));
            });

            const config = applyMiddlewares(subscriptions.get('dmn.modeler.configure'));

            for (const editor of [ 'drd', 'decisionTable', 'literalExpression' ]) {
                expect(config[editor].additionalModules, editor).toContain(translateModule);
            }
        });

        it('applies the stored language to the translator', async () => {
            const I18nPlugin = await loadPlugin();
            const translateModule =
                (await import('../../client/bpmnjs-i18n-extension/index.js')).default;
            const { props } = createProps(stored);

            await act(async () => {
                render(React.createElement(I18nPlugin, props));
            });

            expect(translateModule.translateModule.prototype.currentLanguage()).toBe('de');
        });
    });

    describe('language selection', () => {

        it('persists the choice under the i18n plugin key', async () => {
            const I18nPlugin = await loadPlugin();
            const { props, saved } = createProps(stored);

            let instance;

            await act(async () => {
                render(React.createElement(I18nPlugin, { ...props, ref: c => (instance = c) }));
            });

            await act(async () => {
                instance.handleLanguageChanged({ value: 'fr', label: 'Français' });
            });

            expect(saved).toEqual([
                { key: 'i18n', name: 'config', value: { currentLanguage: { value: 'fr', label: 'Français' } } }
            ]);
        });

        it('asks the user to restart after a change', async () => {
            const I18nPlugin = await loadPlugin();
            const { props } = createProps(stored);

            let instance;

            const { queryByRole } = render(
                React.createElement(I18nPlugin, { ...props, ref: c => (instance = c) })
            );

            expect(queryByRole('dialog')).toBeNull();

            await act(async () => {
                instance.handleLanguageChanged({ value: 'fr', label: 'Français' });
            });

            expect(queryByRole('dialog')).not.toBeNull();
        });
    });

    describe('first run', () => {

        // Regression: both subscriptions used to sit inside `if (config)`, so a
        // fresh install never registered the translate module at all.
        it('still wires up the editors when nothing has been saved yet', async () => {
            const I18nPlugin = await loadPlugin();
            const { props, subscriptions } = createProps(undefined);

            await act(async () => {
                render(React.createElement(I18nPlugin, props));
            });

            expect([ ...subscriptions.keys() ].sort())
                .toEqual([ 'bpmn.modeler.configure', 'dmn.modeler.configure' ]);
        });

        it('falls back to the default language when nothing has been saved', async () => {
            const I18nPlugin = await loadPlugin();
            const translateModule =
                (await import('../../client/bpmnjs-i18n-extension/index.js')).default;
            const { props } = createProps(undefined);

            await act(async () => {
                render(React.createElement(I18nPlugin, props));
            });

            expect(translateModule.translateModule.prototype.currentLanguage()).toBe('en');
        });
    });
});

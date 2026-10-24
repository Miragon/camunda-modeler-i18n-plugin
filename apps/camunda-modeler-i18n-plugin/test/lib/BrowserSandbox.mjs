/**
 * Bundles an entry point and runs it in Chromium.
 *
 * bpmn-js needs SVG layout that jsdom does not implement, so anything touching
 * a real editor has to run in a real browser - the same reason bpmn-js tests
 * itself through Karma.
 */

import path from 'node:path';

import * as esbuild from 'esbuild';
import { chromium } from 'playwright';

import { PLUGIN_ROOT } from './paths.mjs';

const LOADERS = {
    '.bpmn': 'text',
    '.dmn': 'text',
    '.css': 'text',
    '.svg': 'text',
    '.png': 'dataurl',
};

export default class BrowserSandbox {
    /**
     * Loads the bundle in a blank page and calls one of the globals it installed.
     *
     * @param {String} entry   path to the browser entry point
     * @param {String} call    expression evaluated in the page, e.g. `__harvest()`
     */
    async run(entry, call) {
        const script = await this.#bundle(entry);
        const browser = await chromium.launch();

        try {
            const page = await browser.newPage();
            const pageErrors = [];

            page.on('pageerror', (error) => pageErrors.push(error.message));

            await page.setContent('<!doctype html><html><body></body></html>');
            await page.addScriptTag({ content: script });

            const result = await page.evaluate(`(${call})`);

            return { ...result, pageErrors };
        } finally {
            await browser.close();
        }
    }

    async #bundle(entry) {
        const result = await esbuild.build({
            entryPoints: [path.resolve(PLUGIN_ROOT, entry)],
            bundle: true,
            write: false,
            format: 'iife',
            platform: 'browser',
            loader: LOADERS,
            logLevel: 'silent',
        });

        return result.outputFiles[0].text;
    }
}

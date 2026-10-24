/**
 * A throwaway Modeler profile with this plugin installed.
 *
 * Plugin discovery follows `app/lib/index.js`: the Modeler globs
 * `plugins/<name>/index.js` under `<appPath>/resources` and `<userData>/resources`.
 * Pointing `--user-data-dir` at a temp directory therefore gives a per-run
 * install and leaves any real Modeler on the machine untouched.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { PLUGIN_ROOT } from './paths.mjs';

export default class ModelerProfile {
    /**
     * @param {Object}  [options]
     * @param {String}  [options.language] pre-seed the stored language, as picking
     *   one in the UI only takes effect after a restart.
     * @param {String}  [options.source] directory holding `index.js` and `dist/`;
     *   defaults to the working tree, but a release zip can be unpacked and passed
     *   here to test the shipped artefact instead.
     */
    static create({ language, source = PLUGIN_ROOT } = {}) {
        const profile = new ModelerProfile(fs.mkdtempSync(path.join(os.tmpdir(), 'cm-i18n-')));

        profile.#installPlugin(source);
        profile.#writeConfig(language);

        return profile;
    }

    constructor(dir) {
        this.dir = dir;
    }

    remove() {
        fs.rmSync(this.dir, { recursive: true, force: true });
    }

    #installPlugin(source) {
        const pluginDir = path.join(this.dir, 'resources', 'plugins', 'i18n');

        fs.mkdirSync(pluginDir, { recursive: true });
        fs.copyFileSync(path.join(source, 'index.js'), path.join(pluginDir, 'index.js'));
        fs.cpSync(path.join(source, 'dist'), path.join(pluginDir, 'dist'), { recursive: true });
    }

    #writeConfig(language) {
        const config = {
            // Suppress the first-run overlays so they cannot cover the toolbar.
            'editor.privacyPreferences': {
                ENABLE_CRASH_REPORTS: false,
                ENABLE_USAGE_STATISTICS: false,
            },
            'versionInfo.lastOpenedVersion': '99.0.0',
        };

        if (language) {
            // `getForPlugin(name, key)` reads config.plugins[name][key], so the
            // shape here has to be nested rather than a dotted key.
            config.plugins = {
                i18n: { config: { currentLanguage: { value: language, label: language } } },
            };
        }

        fs.writeFileSync(path.join(this.dir, 'config.json'), JSON.stringify(config, null, 2));
    }
}

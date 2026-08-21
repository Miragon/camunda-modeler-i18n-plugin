/**
 * Downloads a Camunda Modeler release and installs this plugin into a throwaway
 * profile, so the E2E specs exercise the artefact users actually get.
 *
 * Plugin discovery follows `app/lib/index.js`: the Modeler globs
 * `plugins/<name>/index.js` under `<appPath>/resources` and `<userData>/resources`.
 * Pointing `--user-data-dir` at a temp directory therefore gives a per-run
 * install and leaves any real Modeler on the machine untouched.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..', '..');

export const CACHE =
    process.env.MODELER_CACHE ?? path.join(os.homedir(), '.cache', 'camunda-modeler-e2e');

const version = () =>
    JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).supportedModeler;

/** The release asset matching this machine, and where it unpacks to. */
function target(v) {
    const arch = process.arch === 'arm64' ? 'arm64' : 'x64';

    if (process.platform === 'darwin') {
        return {
            asset: `camunda-modeler-${v}-mac-${arch}.zip`,
            dir: `camunda-modeler-${v}-mac-${arch}`,
            binary: ['Camunda Modeler.app', 'Contents', 'MacOS', 'Camunda Modeler'],
        };
    }

    if (process.platform === 'linux') {
        return {
            asset: `camunda-modeler-${v}-linux-x64.tar.gz`,
            dir: `camunda-modeler-${v}-linux-x64`,
            binary: [`camunda-modeler-${v}-linux-x64`, 'camunda-modeler'],
        };
    }

    throw new Error(`Unsupported platform for the Modeler E2E suite: ${process.platform}`);
}

/**
 * @return {String|null} path to the executable, or null when the release has
 *   not been downloaded and `download` is false.
 */
export function modelerBinary({ download = false } = {}) {
    const v = version();
    const { asset, dir, binary } = target(v);

    const unpacked = path.join(CACHE, dir);
    const executable = path.join(unpacked, ...binary);

    if (fs.existsSync(executable)) {
        return executable;
    }

    const archive = path.join(CACHE, asset);

    if (!fs.existsSync(archive)) {
        if (!download) {
            return null;
        }

        fs.mkdirSync(CACHE, { recursive: true });
        execFileSync(
            'curl',
            [
                '-sfL',
                '-o',
                archive,
                `https://github.com/camunda/camunda-modeler/releases/download/v${v}/${asset}`,
            ],
            { stdio: 'inherit' },
        );
    }

    fs.mkdirSync(unpacked, { recursive: true });

    if (asset.endsWith('.zip')) {
        execFileSync('unzip', ['-q', '-o', archive, '-d', unpacked], { stdio: 'inherit' });
    } else {
        execFileSync('tar', ['xzf', archive, '-C', unpacked], { stdio: 'inherit' });
    }

    if (!fs.existsSync(executable)) {
        throw new Error(`Unpacked ${asset} but found no executable at ${executable}`);
    }

    return executable;
}

/**
 * Creates a profile directory with the plugin installed.
 *
 * @param {Object}  [options]
 * @param {String}  [options.language] pre-seed the stored language, as picking
 *   one in the UI only takes effect after a restart.
 * @param {String}  [options.source] directory holding `index.js` and `dist/`;
 *   defaults to the working tree, but a release zip can be unpacked and passed
 *   here to test the shipped artefact instead.
 */
export function createProfile({ language, source = ROOT } = {}) {
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cm-i18n-'));
    const pluginDir = path.join(profile, 'resources', 'plugins', 'i18n');

    fs.mkdirSync(pluginDir, { recursive: true });
    fs.copyFileSync(path.join(source, 'index.js'), path.join(pluginDir, 'index.js'));
    fs.cpSync(path.join(source, 'dist'), path.join(pluginDir, 'dist'), { recursive: true });

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

    fs.writeFileSync(path.join(profile, 'config.json'), JSON.stringify(config, null, 2));

    return { profile, pluginDir };
}

export const cleanup = (profile) => fs.rmSync(profile, { recursive: true, force: true });

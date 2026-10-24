/**
 * Downloads the Camunda Modeler release named by `supportedModeler`, so the E2E
 * specs exercise the artefact users actually get.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { PLUGIN_ROOT } from './paths.mjs';
import { readJson } from './utils/readJson.mjs';

export default class ModelerRelease {
    static CACHE =
        process.env.MODELER_CACHE ?? path.join(os.homedir(), '.cache', 'camunda-modeler-e2e');

    #version = readJson(path.join(PLUGIN_ROOT, 'package.json')).supportedModeler;

    /**
     * @return {String|null} path to the executable, or null when the release has
     *   not been downloaded and `download` is false.
     */
    executable({ download = false } = {}) {
        const { asset, dir, binary } = this.#target();

        const unpacked = path.join(ModelerRelease.CACHE, dir);
        const executable = path.join(unpacked, ...binary);

        if (fs.existsSync(executable)) {
            return executable;
        }

        const archive = path.join(ModelerRelease.CACHE, asset);

        if (!fs.existsSync(archive)) {
            if (!download) {
                return null;
            }

            this.#download(asset, archive);
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

    #download(asset, archive) {
        fs.mkdirSync(ModelerRelease.CACHE, { recursive: true });
        execFileSync(
            'curl',
            [
                '-sfL',
                '-o',
                archive,
                `https://github.com/camunda/camunda-modeler/releases/download/v${this.#version}/${asset}`,
            ],
            { stdio: 'inherit' },
        );
    }

    /** The release asset matching this machine, and where it unpacks to. */
    #target() {
        const v = this.#version;
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
}

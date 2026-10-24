import fs from 'node:fs';

export function readJson(file, fallback) {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
}

import fs from 'node:fs';
import path from 'node:path';

/** Every non-minified `.js` file below `dir`, skipping nested `node_modules`. */
export function listJsFiles(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules') {
                listJsFiles(full, out);
            }
        } else if (entry.name.endsWith('.js') && !entry.name.endsWith('.min.js')) {
            out.push(full);
        }
    }
    return out;
}

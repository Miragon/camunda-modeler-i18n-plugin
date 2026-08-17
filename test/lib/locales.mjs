/**
 * Loads the translation dictionaries from source.
 *
 * Parsed with Babel rather than a regex: only an AST reports duplicate keys,
 * which an object literal silently drops.
 */

import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';

// The order the barrel spreads them in; later files win on duplicate keys.
export const LOCALE_FILES = [ 'bpmn-js', 'dmn-js', 'properties-panel', 'other' ];

export const LANGUAGES_DIR = path.resolve(
    import.meta.dirname, '..', '..', 'client', 'bpmnjs-i18n-extension', 'languages'
);

/** Folds a value node to a string, including `'a' + 'b'` concatenations. */
function foldString(node) {
    if (node.type === 'StringLiteral') {
        return node.value;
    }

    if (node.type === 'BinaryExpression' && node.operator === '+') {
        const left = foldString(node.left);
        const right = foldString(node.right);

        return left === null || right === null ? null : left + right;
    }

    if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
        return node.quasis[0].value.cooked;
    }

    return null;
}

/**
 * @return {{ entries: Array<{key: String, value: String, line: Number}>, unresolved: Array }}
 */
export function parseTranslationFile(file) {
    const ast = parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module' });
    const exported = ast.program.body.find(n => n.type === 'ExportDefaultDeclaration');

    if (!exported) {
        throw new Error(`${file}: no default export found`);
    }

    if (exported.declaration.type !== 'ObjectExpression') {
        throw new Error(`${file}: default export is not an object literal`);
    }

    const entries = [];
    const unresolved = [];

    for (const prop of exported.declaration.properties) {
        if (prop.type !== 'ObjectProperty') {
            unresolved.push({ line: prop.loc.start.line, reason: prop.type });
            continue;
        }

        const key = foldString(prop.key) ?? (prop.key.type === 'Identifier' ? prop.key.name : null);
        const value = foldString(prop.value);

        if (key === null || value === null) {
            unresolved.push({ line: prop.loc.start.line, reason: `${prop.key.type}: ${prop.value.type}` });
            continue;
        }

        entries.push({ key, value, line: prop.loc.start.line });
    }

    return { entries, unresolved };
}

/** @return {String[]} locale directory names, e.g. ['de', 'en', 'pt-br', ...] */
export function listLocales() {
    return fs.readdirSync(LANGUAGES_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name)
        .sort();
}

/** Loads a locale's merged dictionary plus the detail needed to report duplicates. */
export function loadLocale(locale) {
    const files = {};
    const merged = new Map();
    const duplicates = [];
    const unresolved = [];

    for (const name of LOCALE_FILES) {
        const file = path.join(LANGUAGES_DIR, locale, `${name}.js`);
        const parsed = parseTranslationFile(file);

        files[name] = parsed.entries;
        unresolved.push(...parsed.unresolved.map(u => ({ ...u, file: name })));

        for (const entry of parsed.entries) {
            if (merged.has(entry.key)) {
                duplicates.push({
                    key: entry.key, file: name, line: entry.line, shadows: merged.get(entry.key).file
                });
            }
            merged.set(entry.key, { ...entry, file: name });
        }
    }

    return {
        locale,
        files,
        dictionary: new Map([ ...merged ].map(([ k, v ]) => [ k, v.value ])),
        duplicates,
        unresolved
    };
}

/** @return {Map<String, ReturnType<typeof loadLocale>>} */
export function loadAllLocales() {
    return new Map(listLocales().map(locale => [ locale, loadLocale(locale) ]));
}

/** Extracts the `{placeholder}` names a string interpolates. */
export function placeholders(text) {
    return [ ...text.matchAll(/{([^}]+)}/g) ].map(m => m[1]).sort();
}

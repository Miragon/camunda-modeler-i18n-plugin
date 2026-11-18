import { unquoteJsLiteral } from './unquoteJsLiteral.mjs';

// Two call shapes reach the translate service: a free `translate(...)` (the
// injected function, as in bpmn-js providers) and a `._translate(...)` member
// (dmn-js stores the injected service as `this._translate` in its components).
// The lookbehind rejects `transform: 'translate(' + x` from SVG plumbing and
// method calls like `canvas.translate(...)`.
const CALLEE = String.raw`(?:(?<!['"\x60.])\btranslate|\._translate)\(\s*`;

const TRANSLATE_LITERAL = new RegExp(
    CALLEE + String.raw`('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")`,
    'g',
);
const TRANSLATE_DYNAMIC = new RegExp(CALLEE + String.raw`(?:\x60|[A-Za-z_$][\w$]*\s*[,)])`, 'g');

// JSDoc documents the translate stub with a worked example that would otherwise
// be extracted as a real UI string.
const JSDOC_BLOCK = /\/\*\*[\s\S]*?\*\//g;

/**
 * Extracts the literal `translate()` keys from one JavaScript source text.
 *
 * Calls whose key is computed at runtime (a template literal, an identifier, or
 * a literal prefix concatenated with `+`) are counted as `dynamic` instead.
 *
 * @param {String} source
 * @return {{ keys: String[], dynamic: Number }}
 */
export function scanTranslateCalls(source) {
    const src = source.replace(JSDOC_BLOCK, '');
    const keys = [];
    let dynamic = 0;

    for (const match of src.matchAll(TRANSLATE_LITERAL)) {
        const key = unquoteJsLiteral(match[1]);

        if (key === null) {
            continue;
        }

        // A literal that is only the prefix of a key computed at runtime,
        // e.g. `translate('Align elements ' + alignment)`.
        if (/^\s*\+/.test(src.slice(match.index + match[0].length))) {
            dynamic++;
            continue;
        }

        keys.push(key);
    }

    dynamic += [...src.matchAll(TRANSLATE_DYNAMIC)].length;

    return { keys, dynamic };
}

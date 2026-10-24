/** Decodes a single- or double-quoted JS string literal; null when it is malformed. */
export function unquoteJsLiteral(literal) {
    try {
        if (literal.startsWith('"')) {
            return JSON.parse(literal);
        }
        return JSON.parse(
            '"' + literal.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"') + '"',
        );
    } catch {
        return null;
    }
}

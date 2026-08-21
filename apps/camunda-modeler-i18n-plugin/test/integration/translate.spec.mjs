/**
 * Drives real BPMN and DMN editors in Chromium with the translate module
 * injected, so the assertions cover what a user actually sees rather than the
 * dictionaries in isolation.
 */

import { describe, it, expect, beforeAll } from 'vitest';

import { runInBrowser } from '../lib/browser.mjs';

const ENTRY = 'test/integration/translate-entry.js';

describe('translation in a real editor', () => {
    let german;
    let english;

    beforeAll(async () => {
        german = await runInBrowser(ENTRY, "window.__inspect('de')");
        english = await runInBrowser(ENTRY, "window.__inspect('en')");
    }, 120000);

    it('loads both editors without a page error', () => {
        expect(german.pageErrors).toEqual([]);
    });

    it('serves translations through the injected translate service', () => {
        expect(german.service.handTool).toBe('Handwerkzeug aktivieren');
        expect(english.service.handTool).toBe('Activate hand tool');
    });

    it('interpolates placeholders through the injected service', () => {
        expect(german.service.interpolated).toContain('X');
        expect(german.service.interpolated).not.toContain('{label}');
    });

    it('translates the palette a user sees', () => {
        expect(german.paletteLabels.length).toBeGreaterThan(0);
        expect(german.paletteLabels).toContain('Handwerkzeug aktivieren');
        expect(english.paletteLabels).toContain('Activate hand tool');
    });

    // Every dmn-js.js still carries a note saying these strings do not work.
    // They do, as long as the module reaches all three sub-editors.
    it('translates the DMN decision table', () => {
        expect(german.dmnText).toContain('Trefferregel');
        expect(english.dmnText).toContain('Hit policy');
    });
});
